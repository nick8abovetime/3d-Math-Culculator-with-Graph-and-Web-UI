import pytest


def test_2d_graph_loads(page):
    page.locator(".mode-tab[data-mode='graph']").click()
    assert page.locator("#graph-canvas").is_visible()


def test_2d_graph_sin_function(page):
    page.locator(".mode-tab[data-mode='graph']").click()
    page.locator("#graph-function").fill("sin(x)")
    page.locator("#calculate-btn").click()
    canvas = page.locator("#graph-canvas")
    assert canvas.is_visible()


def test_2d_graph_quadratic(page):
    page.locator(".mode-tab[data-mode='graph']").click()
    page.locator("#graph-function").fill("x^2")
    page.locator("#calculate-btn").click()
    canvas = page.locator("#graph-canvas")
    assert canvas.is_visible()


def test_2d_graph_invalid_function_shows_error(page):
    page.locator(".mode-tab[data-mode='graph']").click()
    page.locator("#graph-function").fill("invalid_func")
    page.locator("#calculate-btn").click()
    error_msg = page.locator("#graph-error")
    assert error_msg.is_visible()
    assert len(error_msg.text_content()) > 0


def test_2d_graph_range_inputs_work(page):
    page.locator(".mode-tab[data-mode='graph']").click()
    page.locator("#x-min").fill("-5")
    page.locator("#x-max").fill("5")
    page.locator("#graph-function").fill("x")
    page.locator("#calculate-btn").click()
    assert page.locator("#graph-canvas").is_visible()
