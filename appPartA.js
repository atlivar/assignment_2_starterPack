import axios from "axios";

/* =========================
   CONFIG
========================= */
const API_BASE = "https://veff-2026-quotes.netlify.app/api/v1";

/* =========================
   QUOTE FEATURE
========================= */

/**
 * Fetch a quote from the API
 * @param {string} category - quote category
 */
const loadQuote = async (category = "general") => {
  // TODO: Use the assignment description to figure out what to do here
  const url = "https://veff-2026-quotes.netlify.app/api/v1/quotes";

  try {
    const response = await axios.get(url, {
      params: {
        category: category,
      },
    });

    const { quote, author } = response.data;

    const quoteTextElement = document.getElementById("quote-text");
    const quoteAuthorElement = document.getElementById("quote-author");

    if (!quoteTextElement || !quoteAuthorElement) return;

    quoteTextElement.textContent = `"${quote}"`;
    quoteAuthorElement.textContent = author;
  } catch (error) {
    console.log("Error fetching quote:", error);
  }
};

    
/**
 * Attach event listeners for quote feature
 */
const wireQuoteEvents = () => {
  // TODO: Use the assignment description to figure out what to do here
  const select = document.getElementById("quote-category-select");
  const button = document.getElementById("new-quote-btn");

  if (!select || !button) return;

  select.addEventListener("change", async () => {
    await loadQuote(select.value);
  });

  button.addEventListener("click", async () => {
    await loadQuote(select.value);
  });
};

/* =========================
   INIT
========================= */

/**
 * Initialize application
 */
const init = async () => {
  wireQuoteEvents();

  const select = document.getElementById("quote-category-select");
  const category = select?.value || "general";

  await loadQuote(category);
};

/* =========================
   EXPORT (DO NOT REMOVE)
========================= */

export { init, loadQuote, wireQuoteEvents };

init();
