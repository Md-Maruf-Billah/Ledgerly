"""
Vercel Python serverless entry point for the Ledgerly FastAPI backend.

Vercel detects the `app` ASGI variable at module level and serves it.
All requests to /api/* and /health are rewritten here by vercel.json.
"""
import sys
import os

# Make the backend package importable from this api/ subdirectory.
# At runtime on Vercel, __file__ is absolute, so this resolves correctly.
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend"))

from app.main import app  # noqa: F401, E402; Vercel picks up the ASGI `app` object
