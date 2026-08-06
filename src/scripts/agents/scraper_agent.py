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
            
            # Fill login inputs
            try:
                email_input = page.locator("input[type='email'], input[name='email'], input[type='text'], input[name='username']").first
                if email_input.is_visible():
                    email_input.fill(username)
                    page.locator("input[type='password'], input[name='password']").first.fill(password)
                    page.locator("button[type='submit'], input[type='submit']").first.click()
                    page.wait_for_load_state("networkidle")
                    page.wait_for_timeout(2500)
            except Exception:
                pass

            # Click Outreach & Impact tab
            try:
                outreach_tab = page.get_by_text("Outreach & Impact").first
                if outreach_tab.is_visible():
                    outreach_tab.click()
                    page.wait_for_load_state("networkidle")
                    
                    # Try clicking Apply button if present
                    try:
                        apply_btn = page.get_by_role("button", name="Apply").first
                        if apply_btn.is_visible() and not apply_btn.is_disabled():
                            apply_btn.click()
                            page.wait_for_timeout(2000)
                    except Exception:
                        pass

                    # Wait for Loading indicator to detach or 15s
                    try:
                        print("[Agent 1] Waiting for portal live database to finish loading...")
                        page.wait_for_selector("text=Loading…", state="detached", timeout=20000)
                    except Exception as err:
                        print(f"[Agent 1 Note] Waiting selector timeout: {err}")
                        page.wait_for_timeout(5000)
            except Exception:
                pass

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
