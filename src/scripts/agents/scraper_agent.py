import os
import sys
import json
import requests
from bs4 import BeautifulSoup

def load_dotenv():
    """Reads .env file locally and sets environment variables."""
    env_file = ".env"
    if os.path.exists(env_file):
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip('"').strip("'")
                    if k:
                        os.environ[k] = v

load_dotenv()

def fetch_report_html(target_url: str, username: str = None, password: str = None) -> str:
    """
    Agent 1: Web-Scraper Agent
    Fetches raw HTML report from target portal or local HTTP endpoint.
    If username & password provided (and valid), handles authentication flow via Playwright / Requests Session.
    """
    print(f"[Agent 1] Target Portal URL: {target_url}")

    # Check if credentials exist and are not placeholder strings
    is_valid_auth = (
        username 
        and password 
        and username.lower() != 'none' 
        and 'your-email' not in username.lower()
        and 'your-secure-password' not in password.lower()
    )

    # Case 1: Public / Local Fallback URL
    if not is_valid_auth:
        print("[Agent 1] No valid live credentials provided. Using fallback HTML reader...")
        if target_url and target_url.startswith("http"):
            try:
                response = requests.get(target_url, timeout=15)
                response.raise_for_status()
                return response.text
            except Exception:
                pass
        
        fallback_file = "public/sample-report.html"
        if os.path.exists(fallback_file):
            with open(fallback_file, "r", encoding="utf-8") as f:
                return f.read()
        return "<html><body><h1>DigiSwasthya Management Portal</h1></body></html>"

    # Case 2: Authenticated Portal Flow via Playwright
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
            page.wait_for_load_state("networkidle")
            
            # Fill login form dynamically
            if page.locator("input[type='text'], input[name='username'], input[name='email'], input[type='email']").first.is_visible():
                page.locator("input[type='text'], input[name='username'], input[name='email'], input[type='email']").first.fill(username)
                page.locator("input[type='password'], input[name='password']").first.fill(password)
                page.locator("button[type='submit'], input[type='submit'], button:has-text('Login'), button:has-text('Sign in')").first.click()
                page.wait_for_load_state("networkidle")

            # Navigate to Outreach & Impact if available
            if page.locator("text='Outreach & Impact'").first.is_visible():
                page.locator("text='Outreach & Impact'").first.click()
                page.wait_for_load_state("networkidle")

            html_content = page.content()
            browser.close()
            print(f"[Agent 1] Playwright successfully scraped live portal ({len(html_content)} bytes).")
            return html_content
    except Exception as e:
        print(f"[Agent 1 Warning] Playwright execution failed: {e}. Falling back to requests Session auth...")
        session = requests.Session()
        try:
            session.post(target_url, data={"username": username, "email": username, "password": password}, timeout=15)
            resp = session.get(target_url, timeout=15)
            return resp.text
        except Exception as req_err:
            print(f"[Agent 1 Error] Session auth failed: {req_err}")
            return "<html><body><h1>DigiSwasthya Live Sync</h1></body></html>"

if __name__ == "__main__":
    portal_url = os.getenv("MANAGEMENT_PORTAL_URL", "http://localhost:3000/sample-report.html")
    portal_user = os.getenv("MANAGEMENT_PORTAL_EMAIL", os.getenv("DIGISWASTHYA_PORTAL_USER", "none"))
    portal_pass = os.getenv("MANAGEMENT_PORTAL_PASSWORD", os.getenv("DIGISWASTHYA_PORTAL_PASS", "none"))

    if len(sys.argv) > 1:
        portal_url = sys.argv[1]

    html = fetch_report_html(portal_url, portal_user, portal_pass)
    with open("scraped_report_temp.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("[Agent 1 Completed] Scraped report saved to scraped_report_temp.html")
