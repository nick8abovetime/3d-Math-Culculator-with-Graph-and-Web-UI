import subprocess
import time

proc = subprocess.Popen(
    ["python3", "-m", "http.server", "8781", "-d", ".."],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
time.sleep(1)

from playwright.sync_api import sync_playwright


def handle_console(msg):
    print(f"Console: {msg.type}: {msg.text}")


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.on("console", handle_console)
    page.goto("http://localhost:8781")
    print("Title:", page.title())

    # Test if clicking works with evaluate
    page.evaluate(
        "document.querySelectorAll('.mode-tab').forEach(t => t.addEventListener('click', e => console.log('clicked:' + e.target.textContent)))"
    )

    # Click using evaluate
    result = page.evaluate("""
        (function() {
            const tab = document.querySelector('.mode-tab[data-mode="vector"]');
            console.log('Found tab:', tab);
            console.log('Tab HTML:', tab.outerHTML);
            tab.click();
            console.log('After click, currentMode:', window.currentMode);
            return tab.classList.contains('active');
        })()
    """)
    print("Tab active after click:", result)
    print("Active tab text:", page.locator(".mode-tab.active").text_content())

    browser.close()
proc.terminate()
proc.wait()
