import pytest


def test_app_loads(page):
    assert page.title() == "3D Math Calculator"
    heading = page.locator("h1").text_content()
    assert "3D Math Calculator" in heading


def test_tab_navigation(page):
    assert page.locator(".mode-tab.active").text_content() == "Expression"

    page.locator(".mode-tab[data-mode='vector']").click()
    assert page.locator(".mode-tab.active").text_content() == "3D Vector"

    page.locator(".mode-tab[data-mode='graph']").click()
    assert page.locator(".mode-tab.active").text_content() == "2D Graph"

    page.locator(".mode-tab[data-mode='surface']").click()
    assert page.locator(".mode-tab.active").text_content() == "3D Surface"

    page.locator(".mode-tab[data-mode='visualize']").click()
    assert page.locator(".mode-tab.active").text_content() == "3D View"

    page.locator(".mode-tab[data-mode='matrix']").click()
    assert page.locator(".mode-tab.active").text_content() == "Matrix"


def test_expression_input_exists(page):
    expr_input = page.locator("#expression")
    assert expr_input.is_visible()


def test_vector_inputs_exist(page):
    page.locator(".mode-tab[data-mode='vector']").click()
    assert page.locator("#vec-a-x").is_visible()
    assert page.locator("#vec-a-y").is_visible()
    assert page.locator("#vec-a-z").is_visible()


def test_canvas_exists_for_graph(page):
    page.locator(".mode-tab[data-mode='graph']").click()
    assert page.locator("#graph-canvas").is_visible()


def test_error_states(page):
    page.locator(".mode-tab[data-mode='expression']").click()
    expr_input = page.locator("#expression")
    expr_input.fill("invalid expression !!!")
    page.locator("#calculate-btn").click()
    error_msg = page.locator("#error-message")
    assert error_msg.is_visible() or "Error" in page.locator("body").text_content()
