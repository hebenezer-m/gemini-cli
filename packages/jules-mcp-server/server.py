from mcp.server.fastmcp import FastMCP
import jules_api

# Initialize FastMCP server
mcp = FastMCP("jules-api")

# Register tools
mcp.tool()(jules_api.list_sources)
mcp.tool()(jules_api.create_session)
mcp.tool()(jules_api.list_sessions)
mcp.tool()(jules_api.approve_plan)
mcp.tool()(jules_api.list_activities)
mcp.tool()(jules_api.send_message)

def main():
    # Initialize and run the server
    mcp.run(transport='stdio')

if __name__ == "__main__":
    main()
