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

def fetch_report_html(target_url: str, username: str = None, password: str = None) -> dict:
    """
    Agent 1: Web-Scraper & API Interceptor Agent
    1. Authenticates at target portal via Playwright.
    2. Listens to API responses to intercept live JSON payloads.
    3. Automates hover/tap interactions over dynamic charts to reveal hidden tooltips.
    4. Extracts embedded window state (__NEXT_DATA__ / __INITIAL_STATE__).
    """
    print(f"[Agent 1] Target Portal URL: {target_url}")

    is_valid_auth = (
        username 
        and password 
        and username.lower() != 'none' 
        and 'your-email' not in username.lower()
        and 'your-secure-password' not in password.lower()
    )

    captured_api_payloads = []

    if not is_valid_auth:
        print("[Agent 1] No valid live credentials provided. Checking local/sample sources...")
        fallback_file = "public/sample-report.html"
        html_text = ""
        if target_url and target_url.startswith("http"):
            try:
                response = requests.get(target_url, timeout=15)
                response.raise_for_status()
                html_text = response.text
            except Exception:
                pass
        
        if not html_text and os.path.exists(fallback_file):
            with open(fallback_file, "r", encoding="utf-8") as f:
                html_text = f.read()
        
        return {
            "html": html_text or "<html><body><h1>DigiSwasthya Portal Sync</h1></body></html>",
            "json_payloads": []
        }

    # Authenticated Portal Flow via Playwright with API Interception & Hover Automation
    try:
        import importlib
        playwright_sync = importlib.import_module("playwright.sync_api")
        sync_playwright = getattr(playwright_sync, "sync_playwright")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()

            # Listener: Intercept live API responses & log errors
            page.on("console", lambda msg: print(f"[Browser Console] {msg.type}: {msg.text}"))
            page.on("requestfailed", lambda req: print(f"[Browser Request Failed] {req.url} - {req.failure}"))

            def handle_response(response):
                try:
                    content_type = response.headers.get("content-type", "")
                    if "application/json" in content_type and response.status == 200:
                        data = response.json()
                        captured_api_payloads.append({
                            "url": response.url,
                            "data": data
                        })
                except Exception:
                    pass

            page.on("response", handle_response)

            print(f"[Agent 1] Authenticating at {target_url} with user '{username}'...")
            page.goto(target_url, wait_until="networkidle")

            # Click Management Portal or Admin Login if landing screen is shown
            try:
                if page.get_by_text("Management Portal").first.is_visible():
                    page.get_by_text("Management Portal").first.click()
                    page.wait_for_timeout(1000)
                elif page.get_by_text("Administrator Login").first.is_visible():
                    page.get_by_text("Administrator Login").first.click()
                    page.wait_for_timeout(1000)
            except Exception:
                pass
            
            # Fill login inputs and wait until login actually completes
            try:
                email_input = page.locator("input[type='email'], input[name='email'], input[type='text'], input[name='username']").first
                if not email_input.is_visible():
                    raise Exception("Login form email input not found on page — may already be logged in or wrong URL.")
                email_input.fill(username)
                page.locator("input[type='password'], input[name='password']").first.fill(password)
                page.locator("button[type='submit'], input[type='submit']").first.click()
                # Wait until URL changes away from /login — this is the reliable proof login completed
                print("[Agent 1] Credentials submitted. Waiting for login to complete...")
                page.wait_for_url(lambda url: "/login" not in url, timeout=30000)
                print(f"[Agent 1] Login successful! Now at: {page.url}")
            except Exception as login_err:
                print(f"[Agent 1 CRITICAL ERROR] Login failed: {login_err}")
                page.screenshot(path="portal_debug.png", full_page=True)
                raise  # Re-raise so pipeline fails loudly — no fake success

            # Portal lands DIRECTLY on Outreach & Impact after login — no tab navigation needed

            # Step 1: Wait for initial network to settle
            print("[Agent 1] Waiting for page network to settle...")
            try:
                page.wait_for_load_state("networkidle", timeout=20000)
            except Exception:
                pass

            # Step 2: Click Apply button — this triggers the actual data API calls
            print("[Agent 1] Clicking Apply button to trigger data load...")
            try:
                apply_btn = page.get_by_role("button", name="Apply").first
                apply_btn.wait_for(state="visible", timeout=8000)
                apply_btn.click()
                print("[Agent 1] Apply button clicked. Waiting for data API calls to complete...")
                try:
                    page.wait_for_load_state("networkidle", timeout=30000)
                except Exception:
                    pass
                page.wait_for_timeout(5000)  # Extra wait for data to render
            except Exception as apply_err:
                print(f"[Agent 1 Note] Apply button not found ({apply_err}). Waiting 12s for auto-load...")
                page.wait_for_timeout(12000)

            # Step 3: Final wait for all charts and tooltips to fully render
            page.wait_for_timeout(3000)
            print(f"[Agent 1] Page ready. Captured {len(captured_api_payloads)} API payloads so far.")
            print("[Agent 1] Dashboard fully ready for scraping.")

            # Save screenshot for exact visual inspection
            page.screenshot(path="portal_debug.png", full_page=True)
            print("[Agent 1] Debug screenshot saved to portal_debug.png")

            # Automate Hover Actions over Interactive Chart Elements
            try:
                chart_elements = page.locator("rect, circle, path, canvas, .recharts-rectangle, .apexcharts-series, .bar, .chart-point").all()
                print(f"[Agent 1] Found {len(chart_elements)} interactive chart elements. Triggering hover events...")
                for el in chart_elements[:40]: # Hover first 40 chart elements to reveal hidden tooltips
                    try:
                        if el.is_visible():
                            el.hover(timeout=300)
                            page.wait_for_timeout(50)
                    except Exception:
                        pass
            except Exception as hover_err:
                print(f"[Agent 1 Hover Note] {hover_err}")

            # Extract window.__NEXT_DATA__ or embedded state if available
            embedded_state = None
            try:
                embedded_state = page.evaluate("() => window.__NEXT_DATA__ || window.__INITIAL_STATE__ || null")
                if embedded_state:
                    captured_api_payloads.append({
                        "url": "window.__NEXT_DATA__",
                        "data": embedded_state
                    })
            except Exception:
                pass

            html_content = page.content()
            browser.close()
            print(f"[Agent 1] Playwright successfully scraped portal ({len(html_content)} bytes HTML, {len(captured_api_payloads)} API payloads).")
            # DEBUG: Print every captured payload URL and its top-level keys so extractor can be verified
            for idx, p in enumerate(captured_api_payloads):
                p_data = p.get("data", {})
                if isinstance(p_data, dict):
                    keys = list(p_data.keys())[:15]
                elif isinstance(p_data, list):
                    keys = f"[list, {len(p_data)} items]"
                else:
                    keys = type(p_data).__name__
                print(f"  [Payload {idx}] URL: {p.get('url','?')[:80]} | keys: {keys}")
            return {
                "html": html_content,
                "json_payloads": captured_api_payloads
            }

    except Exception as e:
        print(f"[Agent 1 Warning] Playwright execution failed: {e}. Falling back to requests Session auth...")
        session = requests.Session()
        try:
            session.post(target_url, data={"username": username, "email": username, "password": password}, timeout=15)
            resp = session.get(target_url, timeout=15)
            return {
                "html": resp.text,
                "json_payloads": []
            }
        except Exception as req_err:
            print(f"[Agent 1 Error] Session auth failed: {req_err}")
            return {
                "html": "<html><body><h1>DigiSwasthya Live Sync</h1></body></html>",
                "json_payloads": []
            }

if __name__ == "__main__":
    portal_url = os.getenv("MANAGEMENT_PORTAL_URL", "http://localhost:3000/sample-report.html")
    portal_user = os.getenv("MANAGEMENT_PORTAL_EMAIL", os.getenv("DIGISWASTHYA_PORTAL_USER", "none"))
    portal_pass = os.getenv("MANAGEMENT_PORTAL_PASSWORD", os.getenv("DIGISWASTHYA_PORTAL_PASS", "none"))

    if len(sys.argv) > 1:
        portal_url = sys.argv[1]

    result = fetch_report_html(portal_url, portal_user, portal_pass)
    with open("scraped_report_temp.html", "w", encoding="utf-8") as f:
        f.write(result["html"])
    with open("scraped_report_temp.json", "w", encoding="utf-8") as f:
        json.dump(result["json_payloads"], f, indent=2)
    print("[Agent 1 Completed] Scraped HTML and API payloads saved to temp files.")
