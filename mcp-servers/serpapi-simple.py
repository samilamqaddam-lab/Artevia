#!/usr/bin/env python3
"""
Simple SERPAPI Script for Artevia SEO Analysis
Direct API usage without MCP - works with Python 3.9+
"""

import os
import json
import sys
from serpapi import GoogleSearch

SERPAPI_API_KEY = "172f997ef4ef33b74125204b44d1e8bc026349f79ac7e426b32ae4cfe73f986e"

def google_search(query, location="Morocco", num=10, hl="fr"):
    """Perform Google search via SERPAPI."""
    params = {
        "q": query,
        "location": location,
        "num": num,
        "hl": hl,
        "api_key": SERPAPI_API_KEY
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    # Format results
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

    return {
        "query": query,
        "location": location,
        "total_results": len(formatted_results),
        "results": formatted_results
    }

def google_shopping(query, location="Morocco", num=10):
    """Search Google Shopping via SERPAPI."""
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

    return {
        "query": query,
        "total_results": len(formatted_results),
        "results": formatted_results
    }

def analyze_competitors(keyword):
    """Analyze top competitors for a given keyword."""
    print(f"\n🔍 Analyzing competitors for: {keyword}\n")

    results = google_search(keyword, location="Morocco", num=10)

    print(f"Total results: {results['total_results']}\n")
    print("=" * 80)

    for result in results['results']:
        print(f"\n#{result['position']} - {result['title']}")
        print(f"URL: {result['link']}")
        print(f"Snippet: {result['snippet'][:150]}...")
        print("-" * 80)

    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 serpapi-simple.py <search_query>")
        print("\nExamples:")
        print("  python3 serpapi-simple.py 'impression en ligne maroc'")
        print("  python3 serpapi-simple.py 'bloc notes personnalisé'")
        sys.exit(1)

    query = " ".join(sys.argv[1:])
    analyze_competitors(query)
