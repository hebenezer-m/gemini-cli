# Gemini CLI Extensions

Gemini CLI supports extensions that can be used to configure and extend its functionality.

## How it works

On startup, Gemini CLI looks for extensions in two locations:

1.  `<workspace>/.gemini/extensions`
2.  `<home>/.gemini/extensions`

Gemini CLI loads all extensions from both locations. If an extension with the same name exists in both locations, the extension in the workspace directory takes precedence.

Within each location, individual extensions exist as a directory that contains a `gemini-extension.json` file. For example:

`<workspace>/.gemini/extensions/my-extension/gemini-extension.json`

### `gemini-extension.json`

The `gemini-extension.json` file contains the configuration for the extension. The file has the following structure:

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "mcpServers": {
    "my-server": {
      "command": "node my-server.js"
    }
  },
  "contextFileName": "GEMINI.md",
  "excludeTools": ["run_shell_command"]
}
```

- `name`: The name of the extension. This is used to uniquely identify the extension and for conflict resolution when extension commands have the same name as user or project commands.
- `version`: The version of the extension.
- `mcpServers`: A map of MCP servers to configure. The key is the name of the server, and the value is the server configuration. These servers will be loaded on startup just like MCP servers configured in a [`settings.json` file](./cli/configuration.md). If both an extension and a `settings.json` file configure an MCP server with the same name, the server defined in the `settings.json` file takes precedence.
- `contextFileName`: The name of the file that contains the context for the extension. This will be used to load the context from the workspace. If this property is not used but a `GEMINI.md` file is present in your extension directory, then that file will be loaded.
- `excludeTools`: An array of tool names to exclude from the model. You can also specify command-specific restrictions for tools that support it, like the `run_shell_command` tool. For example, `"excludeTools": ["run_shell_command(rm -rf)"]` will block the `rm -rf` command.

When Gemini CLI starts, it loads all the extensions and merges their configurations. If there are any conflicts, the workspace configuration takes precedence.

### Extension Environment Variables

Some extensions may require you to set environment variables for them to function correctly. For example, an extension that connects to a service like GitHub will likely need an API token.

These variables are not configured within the `gemini-extension.json` file itself, but in a separate `.env` file. The Gemini CLI will automatically load environment variables from a `.gemini/.env` file in your project's root directory.

#### Example: Configuring the GitHub MCP Extension

The `github/github-mcp-server` extension for GitHub requires a Personal Access Token (PAT) to authenticate with the GitHub API. This token should be stored in an environment variable named `GITHUB_MCP_PAT`.

To configure this:

1.  Create a file named `.env` inside the `.gemini` directory in your project root: `.gemini/.env`.
2.  Add the following line to this file, replacing `your_personal_access_token` with your actual GitHub PAT:

    ```
    GITHUB_MCP_PAT=your_personal_access_token
    ```

The Gemini CLI will automatically load this variable when it starts, allowing the extension to authenticate successfully. Refer to the [CLI Configuration documentation](./cli/configuration.md#environment-variables--env-files) for more general information on how the CLI handles `.env` files.

## Extension Commands

Extensions can provide [custom commands](./cli/commands.md#custom-commands) by placing TOML files in a `commands/` subdirectory within the extension directory. These commands follow the same format as user and project custom commands and use standard naming conventions.

### Example

An extension named `gcp` with the following structure:

```
.gemini/extensions/gcp/
├── gemini-extension.json
└── commands/
    ├── deploy.toml
    └── gcs/
        └── sync.toml
```

Would provide these commands:

- `/deploy` - Shows as `[gcp] Custom command from deploy.toml` in help
- `/gcs:sync` - Shows as `[gcp] Custom command from sync.toml` in help

### Conflict Resolution

Extension commands have the lowest precedence. When a conflict occurs with user or project commands:

1. **No conflict**: Extension command uses its natural name (e.g., `/deploy`)
2. **With conflict**: Extension command is renamed with the extension prefix (e.g., `/gcp.deploy`)

For example, if both a user and the `gcp` extension define a `deploy` command:

- `/deploy` - Executes the user's deploy command
- `/gcp.deploy` - Executes the extension's deploy command (marked with `[gcp]` tag)
