import subprocess
import time

proc = subprocess.Popen(
    ["python3", "-m", "http.server", "8774", "-d", ".."],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
time.sleep(1)

from playwright.sync_api import sync_playwright


def handle_console(msg):
    print(f"Console: {msg.text}")


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.on("console", handle_console)
    page.goto("http://localhost:8774")
    print("Title:", page.title())
    print("Active tab:", page.locator(".mode-tab.active").text_content())

    tab = page.locator('.mode-tab[data-mode="vector"]')
    tab.dispatch_event("click")
    page.wait_for_timeout(500)
    print(
        "After dispatch_event active:", page.locator(".mode-tab.active").text_content()
    )

    browser.close()
proc.terminate()
proc.wait()
