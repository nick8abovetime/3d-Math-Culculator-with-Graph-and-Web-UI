import pytest


def test_expression_basic_calculation(page):
    page.locator(".mode-tab[data-mode='expression']").click()
    expr_input = page.locator("#expression")
    expr_input.fill("2+2")
    page.locator("#calculate-btn").click()
    result = page.locator("#result-output").text_content()
    assert result == "4"


def test_expression_sqrt(page):
    page.locator(".mode-tab[data-mode='expression']").click()
    expr_input = page.locator("#expression")
    expr_input.fill("sqrt(16)")
    page.locator("#calculate-btn").click()
    result = page.locator("#result-output").text_content()
    assert "4" in result


def test_expression_sin(page):
    page.locator(".mode-tab[data-mode='expression']").click()
    expr_input = page.locator("#expression")
    expr_input.fill("sin(pi/2)")
    page.locator("#calculate-btn").click()
    result = page.locator("#result-output").text_content()
    assert "1" in result


def test_expression_invalid_shows_error(page):
    page.locator(".mode-tab[data-mode='expression']").click()
    expr_input = page.locator("#expression")
    expr_input.fill("invalid_expr")
    page.locator("#calculate-btn").click()
    error_msg = page.locator("#error-message")
    assert error_msg.is_visible()
    assert len(error_msg.text_content()) > 0


def test_expression_clears_error_on_valid(page):
    page.locator(".mode-tab[data-mode='expression']").click()
    expr_input = page.locator("#expression")
    expr_input.fill("invalid")
    page.locator("#calculate-btn").click()
    assert page.locator("#error-message").is_visible()
    expr_input.fill("2+2")
    page.locator("#calculate-btn").click()
    result = page.locator("#result-output").text_content()
    assert result == "4"
