# Extensão do Servidor MCP Jules

Esta extensão fornece a [API Jules](https://developers.google.com/jules/api)
como um conjunto de ferramentas através de um servidor
[Model Context Protocol (MCP)](https://modelcontextprotocol.io/), totalmente
integrado com o Gemini CLI.

## Pré-requisitos

- Gemini CLI instalado.
- Python 3.10+ e `uv` instalados.

## Configuração

Antes de usar a extensão, você deve definir sua chave da API Jules como uma
variável de ambiente. O Gemini CLI irá carregá-la automaticamente.

1.  Localize ou crie o arquivo de ambiente do Gemini CLI em `~/.gemini/.env`.
2.  Adicione a seguinte linha ao arquivo, substituindo `"SUA_CHAVE_DE_API_AQUI"`
    pela sua chave real:

    ```
    JULES_API_KEY="SUA_CHAVE_DE_API_AQUI"
    ```

## Instalação

Para instalar a extensão a partir de um checkout local do repositório
`gemini-cli`, execute o seguinte comando a partir da raiz do repositório:

```bash
# Primeiro, construa o CLI
npm run build

# Em seguida, instale a extensão a partir do seu caminho local
./dist/gemini extensions install --path packages/jules-mcp-server
```

## Uso

Uma vez instalada, o Gemini CLI irá gerir automaticamente o servidor. Quando
você usar ferramentas que requerem a API Jules, o CLI iniciará o servidor MCP em
segundo plano.

Para verificar a instalação, você pode listar todas as extensões instaladas:

```bash
gemini extensions list
```

Você deve ver `jules-mcp-server` na saída.
