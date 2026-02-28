import pytest


def test_vector_addition(page):
    page.locator(".mode-tab[data-mode='vector']").click()
    page.locator("#vec-a-x").fill("1")
    page.locator("#vec-a-y").fill("2")
    page.locator("#vec-a-z").fill("3")
    page.locator("#vec-b-x").fill("4")
    page.locator("#vec-b-y").fill("5")
    page.locator("#vec-b-z").fill("6")
    page.locator("select#vector-operation").select_option("add")
    page.locator("#calculate-btn").click()
    result = page.locator("#result-output").text_content()
    assert "5" in result and "7" in result and "9" in result


def test_vector_subtraction(page):
    page.locator(".mode-tab[data-mode='vector']").click()
    page.locator("#vec-a-x").fill("4")
    page.locator("#vec-a-y").fill("5")
    page.locator("#vec-a-z").fill("6")
    page.locator("#vec-b-x").fill("1")
    page.locator("#vec-b-y").fill("2")
    page.locator("#vec-b-z").fill("3")
    page.locator("select#vector-operation").select_option("subtract")
    page.locator("#calculate-btn").click()
    result = page.locator("#result-output").text_content()
    assert "3" in result


def test_vector_magnitude(page):
    page.locator(".mode-tab[data-mode='vector']").click()
    page.locator("#vec-a-x").fill("3")
    page.locator("#vec-a-y").fill("4")
    page.locator("#vec-a-z").fill("0")
    page.locator("select#vector-operation").select_option("magnitude")
    page.locator("#calculate-btn").click()
    result = page.locator("#result-output").text_content()
    assert "5" in result


def test_vector_dot_product(page):
    page.locator(".mode-tab[data-mode='vector']").click()
    page.locator("#vec-a-x").fill("1")
    page.locator("#vec-a-y").fill("0")
    page.locator("#vec-a-z").fill("0")
    page.locator("#vec-b-x").fill("1")
    page.locator("#vec-b-y").fill("0")
    page.locator("#vec-b-z").fill("0")
    page.locator("select#vector-operation").select_option("dot")
    page.locator("#calculate-btn").click()
    result = page.locator("#result-output").text_content()
    assert "1" in result


def test_vector_cross_product(page):
    page.locator(".mode-tab[data-mode='vector']").click()
    page.locator("#vec-a-x").fill("1")
    page.locator("#vec-a-y").fill("0")
    page.locator("#vec-a-z").fill("0")
    page.locator("#vec-b-x").fill("0")
    page.locator("#vec-b-y").fill("1")
    page.locator("#vec-b-z").fill("0")
    page.locator("select#vector-operation").select_option("cross")
    page.locator("#calculate-btn").click()
    result = page.locator("#result-output").text_content()
    assert "0" in result
