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


@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()


@pytest.fixture(scope="function")
def page(browser):
    port = 8790
    proc = start_server(port)
    url = f"http://localhost:{port}"
    page = browser.new_page()
    page.goto(url)
    yield page
    page.close()
    proc.terminate()
    proc.wait()


def test_app_loads(page):
    assert page.title() == "3D Math Calculator"
    heading = page.locator("h1").text_content()
    assert "3D Math Calculator" in heading


def test_all_mode_tabs_present(page):
    tabs = page.locator(".mode-tab").all()
    assert len(tabs) == 6
    tab_names = [t.text_content() for t in tabs]
    assert "Expression" in tab_names
    assert "3D Vector" in tab_names
    assert "2D Graph" in tab_names
    assert "3D Surface" in tab_names
    assert "3D View" in tab_names
    assert "Matrix" in tab_names


def test_expression_mode_elements_exist(page):
    assert page.locator("#expression").count() > 0
    assert page.locator(".expression-mode").count() > 0


def test_vector_mode_elements_exist(page):
    assert page.locator("#vec-a-x").count() > 0
    assert page.locator("#vec-a-y").count() > 0
    assert page.locator("#vec-a-z").count() > 0
    assert page.locator("#vector-operation").count() > 0
    assert page.locator(".vector-mode").count() > 0


def test_graph_mode_elements_exist(page):
    assert page.locator("#graph-canvas").count() > 0
    assert page.locator("#graph-function").count() > 0
    assert page.locator("#x-min").count() > 0
    assert page.locator("#x-max").count() > 0
    assert page.locator(".graph-mode").count() > 0


def test_surface_mode_elements_exist(page):
    assert page.locator("#\\33 d-function").count() > 0
    assert page.locator("#surface-graph-btn").count() > 0
    assert page.locator("#rotate-btn").count() > 0
    assert page.locator("#reset-camera-btn").count() > 0
    assert page.locator(".surface-mode").count() > 0


def test_visualize_mode_elements_exist(page):
    assert page.locator("#viz-vec-a-x").count() > 0
    assert page.locator("#viz-canvas").count() > 0
    assert page.locator(".visualize-mode").count() > 0


def test_matrix_mode_elements_exist(page):
    assert page.locator("#matrix-size").count() > 0
    assert page.locator("#matrix-operation").count() > 0
    assert page.locator(".matrix-mode").count() > 0
