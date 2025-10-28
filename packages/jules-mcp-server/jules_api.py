import os
import httpx
from typing import Any, Dict, List

# Get the API key from the environment variable
API_KEY = os.environ.get("JULES_API_KEY")
BASE_URL = "https://jules.googleapis.com/v1alpha"

async def _make_request(method: str, endpoint: str, json: Dict[str, Any] = None) -> Dict[str, Any]:
    """Make a request to the Jules API."""
    headers = {
        "X-Goog-Api-Key": API_KEY,
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient() as client:
        response = await client.request(method, f"{BASE_URL}/{endpoint}", headers=headers, json=json, timeout=30.0)
        response.raise_for_status()
        return response.json()

async def list_sources() -> Dict[str, Any]:
    """List all available sources."""
    return await _make_request("GET", "sources")

async def create_session(prompt: str, source: str, starting_branch: str, title: str) -> Dict[str, Any]:
    """Create a new session.

    Args:
        prompt: The prompt for the new session.
        source: The source to use for the new session.
        starting_branch: The starting branch for the new session.
        title: The title for the new session.
    """
    return await _make_request(
        "POST",
        "sessions",
        json={
            "prompt": prompt,
            "sourceContext": {
                "source": source,
                "githubRepoContext": {
                    "startingBranch": starting_branch,
                },
            },
            "title": title,
        },
    )

async def list_sessions() -> Dict[str, Any]:
    """List all sessions."""
    return await _make_request("GET", "sessions")

async def approve_plan(session_id: str) -> Dict[str, Any]:
    """Approve the latest plan for a session.

    Args:
        session_id: The ID of the session.
    """
    return await _make_request("POST", f"sessions/{session_id}:approvePlan")

async def list_activities(session_id: str) -> Dict[str, Any]:
    """List all activities for a session.

    Args:
        session_id: The ID of the session.
    """
    return await _make_request("GET", f"sessions/{session_id}/activities")

async def send_message(session_id: str, prompt: str) -> Dict[str, Any]:
    """Send a message to the agent.

    Args:
        session_id: The ID of the session.
        prompt: The prompt to send to the agent.
    """
    return await _make_request(
        "POST",
        f"sessions/{session_id}:sendMessage",
        json={"prompt": prompt},
    )
