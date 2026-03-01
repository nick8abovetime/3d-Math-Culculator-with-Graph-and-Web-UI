import pytest


def test_3d_surface_loads(page):
    page.locator(".mode-tab[data-mode='surface']").click()
    assert page.locator('[id="3d-function"]').is_visible()
    assert page.locator("#surface-graph-btn").is_visible()


def test_3d_surface_generate(page):
    page.locator(".mode-tab[data-mode='surface']").click()
    page.locator('[id="3d-function"]').fill("sin(x) * cos(y)")
    page.locator("#surface-graph-btn").click()
    container = page.locator('[id="3d-canvas-container"]')
    assert container.is_visible()


def test_3d_surface_with_polynomial(page):
    page.locator(".mode-tab[data-mode='surface']").click()
    page.locator('[id="3d-function"]').fill("x^2 + y^2")
    page.locator("#surface-graph-btn").click()
    container = page.locator('[id="3d-canvas-container"]')
    assert container.is_visible()


def test_3d_surface_invalid_shows_error(page):
    page.locator(".mode-tab[data-mode='surface']").click()
    page.locator('[id="3d-function"]').fill("invalid_expr")
    page.locator("#surface-graph-btn").click()
    error_msg = page.locator('[id="3d-error-message"]')
    assert error_msg.is_visible() or "Error" in page.locator("body").text_content()


def test_3d_surface_rotate_button_exists(page):
    page.locator(".mode-tab[data-mode='surface']").click()
    assert page.locator("#rotate-btn").is_visible()
    assert page.locator("#reset-camera-btn").is_visible()
