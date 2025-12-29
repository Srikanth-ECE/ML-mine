'''import uvicorn

if __name__ == "__main__":
    print("=" * 50)
    print("Starting Smart PPE Compliance System")
    print("=" * 50)
    print("\nAccess URLs:")
    print("API: http://localhost:8000")
    print("Interactive Docs: http://localhost:8000/docs")
    print("Dashboard: http://localhost:8000/api/dashboard")
    print("\nPress Ctrl+C to stop\n")
    print("=" * 50)
    
    # CHANGE THIS LINE: Use "127.0.0.1" instead of "0.0.0.0"
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",  # ← CHANGE THIS from "0.0.0.0" to "127.0.0.1"
        port=8000,
        reload=True,
        log_level="info"
    )'''
import uvicorn
import webbrowser
import time

if __name__ == "__main__":
    print("=" * 50)
    print("Starting Smart PPE Compliance System")
    print("=" * 50)
    
    # The correct URL to use in browser
    docs_url = "http://127.0.0.1:8000/docs"
    
    print(f"\n✅ Server is starting...")
    print(f"\n📋 IMPORTANT: After server starts, open browser and go to:")
    print(f"👉 {docs_url}")
    print(f"\nOr click here if it becomes clickable...")
    print(f"\nAlternative: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop\n")
    print("=" * 50)
    
    # Try to open browser automatically after 2 seconds
    def open_browser():
        time.sleep(2)
        try:
            webbrowser.open(docs_url)
            print(f"\n🌐 Browser opened automatically!")
        except:
            print(f"\n⚠️ Could not open browser automatically.")
            print(f"Please manually open: {docs_url}")
    
    import threading
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    # Use 0.0.0.0 for server (standard), but tell user to use 127.0.0.1
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # Keep this for server
        port=8000,
        reload=True,
        log_level="info"
    )