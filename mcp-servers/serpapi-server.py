#!/usr/bin/env python3
"""
SERPAPI MCP Server for Artevia SEO Analysis
Provides search capabilities via SERPAPI for competitive analysis and SEO research.
"""

import os
import json
from typing import Any
from mcp.server import Server
from mcp.types import Tool, TextContent
from serpapi import GoogleSearch
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize MCP server
app = Server("serpapi-artevia")

SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

if not SERPAPI_API_KEY:
    raise ValueError("SERPAPI_API_KEY environment variable is required")


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available SERPAPI search tools."""
    return [
        Tool(
            name="google_search",
            description="Search Google for websites, pages, and content. Useful for SEO analysis and competitor research.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query (e.g., 'impression en ligne maroc', 'fournitures de bureau personnalisées')"
                    },
                    "location": {
                        "type": "string",
                        "description": "Location for localized results (default: 'Morocco')",
                        "default": "Morocco"
                    },
                    "num": {
                        "type": "integer",
                        "description": "Number of results to return (default: 10)",
                        "default": 10
                    },
                    "hl": {
                        "type": "string",
                        "description": "Language code (default: 'fr' for French)",
                        "default": "fr"
                    }
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="google_shopping",
            description="Search Google Shopping for products and pricing. Useful for competitive pricing analysis.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Product search query"
                    },
                    "location": {
                        "type": "string",
                        "description": "Location (default: 'Morocco')",
                        "default": "Morocco"
                    },
                    "num": {
                        "type": "integer",
                        "description": "Number of results (default: 10)",
                        "default": 10
                    }
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="google_trends",
            description="Get Google Trends data for search terms. Useful for keyword research and trend analysis.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search term to analyze trends"
                    },
                    "date": {
                        "type": "string",
                        "description": "Date range (e.g., 'today 12-m', 'today 3-m')",
                        "default": "today 12-m"
                    },
                    "geo": {
                        "type": "string",
                        "description": "Geographic location code (default: 'MA' for Morocco)",
                        "default": "MA"
                    }
                },
                "required": ["query"]
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """Execute SERPAPI search tool."""

    if name == "google_search":
        query = arguments.get("query")
        location = arguments.get("location", "Morocco")
        num = arguments.get("num", 10)
        hl = arguments.get("hl", "fr")

        params = {
            "q": query,
            "location": location,
            "num": num,
            "hl": hl,
            "api_key": SERPAPI_API_KEY
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        # Format organic results
        organic_results = results.get("organic_results", [])
        formatted_results = []

        for idx, result in enumerate(organic_results[:num], 1):
            formatted_results.append({
                "position": idx,
                "title": result.get("title", ""),
                "link": result.get("link", ""),
                "snippet": result.get("snippet", ""),
                "displayed_link": result.get("displayed_link", "")
            })

        return [TextContent(
            type="text",
            text=json.dumps({
                "query": query,
                "location": location,
                "total_results": len(formatted_results),
                "results": formatted_results
            }, indent=2, ensure_ascii=False)
        )]

    elif name == "google_shopping":
        query = arguments.get("query")
        location = arguments.get("location", "Morocco")
        num = arguments.get("num", 10)

        params = {
            "q": query,
            "location": location,
            "num": num,
            "engine": "google_shopping",
            "api_key": SERPAPI_API_KEY
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        shopping_results = results.get("shopping_results", [])
        formatted_results = []

        for idx, result in enumerate(shopping_results[:num], 1):
            formatted_results.append({
                "position": idx,
                "title": result.get("title", ""),
                "link": result.get("link", ""),
                "price": result.get("price", ""),
                "source": result.get("source", ""),
                "rating": result.get("rating", ""),
                "reviews": result.get("reviews", "")
            })

        return [TextContent(
            type="text",
            text=json.dumps({
                "query": query,
                "total_results": len(formatted_results),
                "results": formatted_results
            }, indent=2, ensure_ascii=False)
        )]

    elif name == "google_trends":
        query = arguments.get("query")
        date = arguments.get("date", "today 12-m")
        geo = arguments.get("geo", "MA")

        params = {
            "q": query,
            "date": date,
            "geo": geo,
            "engine": "google_trends",
            "api_key": SERPAPI_API_KEY
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        return [TextContent(
            type="text",
            text=json.dumps(results, indent=2, ensure_ascii=False)
        )]

    else:
        raise ValueError(f"Unknown tool: {name}")


if __name__ == "__main__":
    import asyncio
    from mcp.server.stdio import stdio_server

    async def main():
        async with stdio_server() as (read_stream, write_stream):
            await app.run(
                read_stream,
                write_stream,
                app.create_initialization_options()
            )

    asyncio.run(main())
