import pytest
from playwright.sync_api import sync_playwright
import subprocess
import time
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def start_server(port=8765):
    proc = subprocess.Popen(
        ["python3", "-m", "http.server", str(port), "-d", BASE_DIR],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(1)
    return proc


def get_server_url(port=8765):
    return f"http://localhost:{port}"


@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()


@pytest.fixture(scope="function")
def context(browser):
    context = browser.new_context()
    yield context
    context.close()


@pytest.fixture(scope="function")
def page(context):
    port = 8766
    proc = start_server(port)
    url = get_server_url(port)
    page = context.new_page()
    page.goto(url)
    yield page
    page.close()
    proc.terminate()
    proc.wait()
