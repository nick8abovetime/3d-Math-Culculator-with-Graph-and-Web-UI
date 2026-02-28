import pytest
from playwright.sync_api import Page, expect


BASE_URL = "http://localhost:9090"


def test_load_main_page(page: Page):
    """Should load the main page with correct title."""
    page.goto(BASE_URL)
    expect(page).to_have_title("3D Math Calculator")
    expect(page.locator("h1")).to_have_text("3D Math Calculator")


def test_display_all_mode_tabs(page: Page):
    """Should display all 6 mode tabs."""
    page.goto(BASE_URL)
    tabs = page.locator(".mode-tab")
    expect(tabs).to_have_count(6)
    expect(tabs.first).to_have_text("Expression")


def test_active_tab_highlighted(page: Page):
    """Should highlight the active tab."""
    page.goto(BASE_URL)
    active_tab = page.locator(".mode-tab.active")
    expect(active_tab).to_have_text("Expression")


def test_calculate_button_exists(page: Page):
    """Should have a calculate button."""
    page.goto(BASE_URL)
    calculate_btn = page.locator("#calculate-btn")
    expect(calculate_btn).to_be_visible()
    expect(calculate_btn).to_be_enabled()


def test_result_output_area(page: Page):
    """Should have a result output area."""
    page.goto(BASE_URL)
    result_output = page.locator("#result-output")
    expect(result_output).to_be_visible()
    expect(result_output).to_have_text("-")


class TestExpressionMode:
    """Tests for Expression mode calculations."""

    def test_evaluate_simple_addition(self, page: Page):
        """Should evaluate 2+2 correctly."""
        page.goto(BASE_URL)
        page.fill("#expression", "2+2")
        page.click("#calculate-btn")
        expect(page.locator("#result-output")).to_have_text("4")

    def test_evaluate_sqrt(self, page: Page):
        """Should evaluate sqrt(16) correctly."""
        page.goto(BASE_URL)
        page.fill("#expression", "sqrt(16)")
        page.click("#calculate-btn")
        expect(page.locator("#result-output")).to_have_text("4")

    def test_evaluate_sin(self, page: Page):
        """Should evaluate sin(pi/2) correctly."""
        page.goto(BASE_URL)
        page.fill("#expression", "sin(pi/2)")
        page.click("#calculate-btn")
        expect(page.locator("#result-output")).to_have_text("1")

    def test_evaluate_cosine(self, page: Page):
        """Should evaluate cos(0) correctly."""
        page.goto(BASE_URL)
        page.fill("#expression", "cos(0)")
        page.click("#calculate-btn")
        expect(page.locator("#result-output")).to_have_text("1")

    def test_evaluate_power(self, page: Page):
        """Should evaluate 2^3 correctly."""
        page.goto(BASE_URL)
        page.fill("#expression", "2^3")
        page.click("#calculate-btn")
        expect(page.locator("#result-output")).to_have_text("8")

    def test_handle_empty_expression(self, page: Page):
        """Should show error for empty expression."""
        page.goto(BASE_URL)
        page.click("#calculate-btn")
        expect(page.locator("#error-message")).not_to_be_empty()
