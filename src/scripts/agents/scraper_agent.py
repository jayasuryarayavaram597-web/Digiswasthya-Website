import os
import sys
import requests
from bs4 import BeautifulSoup

def fetch_report_html(target_url: str, username: str = None, password: str = None) -> str:
    """
    Agent 1: Web-Scraper Agent
    Fetches raw HTML report from target portal or local HTTP endpoint.
    If username & password provided (and not 'none'), handles authentication flow via Playwright / Requests Session.
    """
    print(f"[Agent 1] Fetching report from: {target_url}")

    # Case 1: Public / Local URL (or username is 'none' / empty)
    if not username or username.lower() == 'none':
        try:
            response = requests.get(target_url, timeout=15)
            response.raise_for_status()
            print(f"[Agent 1] Successfully fetched {len(response.text)} bytes of HTML content.")
            return response.text
        except Exception as e:
            # Fallback to local file reading if target_url is a file path
            if os.path.exists(target_url):
                with open(target_url, "r", encoding="utf-8") as f:
                    content = f.read()
                print(f"[Agent 1] Successfully read local file {len(content)} bytes.")
                return content
            raise RuntimeError(f"[Agent 1 Error] Failed to fetch report: {e}")

    # Case 2: Authenticated Portal (Playwright Flow)
    try:
        import importlib
        playwright_sync = importlib.import_module("playwright.sync_api")
        sync_playwright = getattr(playwright_sync, "sync_playwright")
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()

            print(f"[Agent 1] Authenticating at {target_url} with user '{username}'...")
            page.goto(target_url)
            
            # Fill login form if elements exist
            if page.locator("input[type='text'], input[name='username'], input[name='email']").first.is_visible():
                page.locator("input[type='text'], input[name='username'], input[name='email']").first.fill(username)
                page.locator("input[type='password'], input[name='password']").first.fill(password)
                page.locator("button[type='submit'], input[type='submit']").first.click()
                page.wait_for_load_state("networkidle")

            html_content = page.content()
            browser.close()
            print(f"[Agent 1] Playwright successfully scraped authenticated report ({len(html_content)} bytes).")
            return html_content
    except ImportError:
        print("[Agent 1 Warning] Playwright not installed. Falling back to requests Session auth...")
        session = requests.Session()
        session.post(target_url, data={"username": username, "password": password})
        resp = session.get(target_url)
        return resp.text

if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000/sample-report.html"
    user = os.getenv("DIGISWASTHYA_PORTAL_USER", "none")
    pwd = os.getenv("DIGISWASTHYA_PORTAL_PASS", "none")
    html = fetch_report_html(url, user, pwd)
    with open("scraped_report_temp.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("[Agent 1 Completed] Scraped report saved to scraped_report_temp.html")
