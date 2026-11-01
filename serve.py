"""Optional local preview server. Run: python serve.py (no packages needed)."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse


def main():
    parser = argparse.ArgumentParser(description="Preview the Creativo portfolio locally.")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(root))
    try:
        with ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
            print(f"Creativo is running at http://localhost:{args.port}")
            print("Press Ctrl+C to stop.")
            server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except OSError as exc:
        parser.exit(1, f"Could not start server: {exc}. Try --port 8001.\n")


if __name__ == "__main__":
    main()
