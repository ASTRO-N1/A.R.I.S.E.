"""
ARISE Backend — Flask API Server
"""
import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# CORS — allow requests from the frontend origin defined in .env
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
CORS(app, resources={r"/api/*": {"origins": frontend_url}})

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "change-me")

APP_NAME = os.environ.get("APP_NAME", "ARISE API")
APP_VERSION = os.environ.get("APP_VERSION", "1.0.0")


# ──────────────────────────────────────────────
# Health check
# ──────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    """Return a simple health-check response."""
    return jsonify({
        "status": "healthy",
        "service": APP_NAME,
        "version": APP_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }), 200


# ──────────────────────────────────────────────
# Test API — verifies frontend ↔ backend integration
# ──────────────────────────────────────────────
@app.route("/api/test", methods=["GET"])
def test_api():
    """A dedicated test endpoint for integration verification."""
    return jsonify({
        "success": True,
        "message": "🚀 ARISE backend is connected and working!",
        "environment": "development" if os.environ.get("FLASK_DEBUG") == "1" else "production",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }), 200


# ──────────────────────────────────────────────
# Sample resource endpoints
# ──────────────────────────────────────────────
@app.route("/api/items", methods=["GET"])
def get_items():
    """Return a list of sample items."""
    items = [
        {"id": 1, "name": "Alpha Module", "description": "Core processing unit"},
        {"id": 2, "name": "Beta Module", "description": "Data analytics engine"},
        {"id": 3, "name": "Gamma Module", "description": "User interface layer"},
    ]
    return jsonify(items), 200


@app.route("/api/items", methods=["POST"])
def create_item():
    """Create a new item (demo endpoint)."""
    data = request.get_json()
    if not data or "name" not in data:
        return jsonify({"error": "name is required"}), 400

    new_item = {
        "id": 4,
        "name": data["name"],
        "description": data.get("description", ""),
    }
    return jsonify(new_item), 201


# ──────────────────────────────────────────────
# Entry-point
# ──────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    print(f"🚀  {APP_NAME} v{APP_VERSION} starting on port {port} (debug={debug})")
    app.run(host="0.0.0.0", port=port, debug=debug)
