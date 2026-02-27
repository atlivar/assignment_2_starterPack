import axios from "axios";

/* =========================
   CONFIG
========================= */


const QUOTES_API_BASE = "https://veff-2026-quotes.netlify.app/api/v1";


const LOCAL_API_BASE = "http://localhost:3000/api/v1";
const TASKS_URL = `${LOCAL_API_BASE}/tasks`;
const NOTES_URL = `${LOCAL_API_BASE}/notes`;

/* =========================
   TODAY’S TASKS FEATURE
========================= */

const renderTasks = (tasks) => {
  const list = document.querySelector(".task-list");
  if (!list) return;

  list.innerHTML = "";

  tasks.forEach((t) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const checkboxId = `task-${t.id}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = checkboxId;
    checkbox.checked = t.finished === 1;

    const label = document.createElement("label");
    label.setAttribute("for", checkboxId);
    label.textContent = t.task;

    checkbox.addEventListener("change", async () => {
      const finished = checkbox.checked ? 1 : 0;
      await updateTaskFinished(t.id, finished);
      await loadTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    list.appendChild(li);
  });
};

const loadTasks = async () => {
  try {
    const res = await axios.get(TASKS_URL);
    const tasks = Array.isArray(res.data) ? res.data : [];
    renderTasks(tasks);
  } catch (err) {
    console.log("Error loading tasks:", err);
  }
};

const createTask = async (taskText) => {
  try {
    await axios.post(TASKS_URL, { task: taskText });
    return true;
  } catch (err) {
    console.log("Error creating task:", err);
    return false;
  }
};

const updateTaskFinished = async (taskId, finished) => {
  try {
    await axios.patch(`${TASKS_URL}/${taskId}`, { finished });
  } catch (err) {
    console.log("Error updating task status:", err);
  }
};

const wireTaskEvents = () => {
  const input = document.getElementById("new-task");
  const addBtn = document.getElementById("add-task-btn");
  if (!input || !addBtn) return;

  const submit = async () => {
    const text = input.value.trim();
    if (!text) return;

    const ok = await createTask(text);
    if (!ok) return;

    input.value = "";
    await loadTasks();
  };

  addBtn.addEventListener("click", submit);

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await submit();
    }
  });
};

/* =========================
   QUICK NOTES FEATURE
========================= */

let lastSavedNotes = "";

const loadNotes = async () => {
  const textarea = document.getElementById("notes-text");
  const saveBtn = document.getElementById("save-notes-btn");
  if (!textarea || !saveBtn) return;

  try {
    const res = await axios.get(NOTES_URL);
    const notesText = typeof res.data?.notes === "string" ? res.data.notes : "";

    textarea.value = notesText;
    lastSavedNotes = notesText;
    saveBtn.disabled = true;
  } catch (err) {
    console.log("Error loading notes:", err);
  }
};

const saveNotes = async (notesText) => {
  try {
    await axios.put(NOTES_URL, { notes: notesText });
    return true;
  } catch (err) {
    console.log("Error saving notes:", err);
    return false;
  }
};

const wireNotesEvents = () => {
  const textarea = document.getElementById("notes-text");
  const saveBtn = document.getElementById("save-notes-btn");
  if (!textarea || !saveBtn) return;

  textarea.addEventListener("input", () => {
    saveBtn.disabled = textarea.value === lastSavedNotes;
  });

  saveBtn.addEventListener("click", async () => {
    const ok = await saveNotes(textarea.value);
    if (!ok) return;

    lastSavedNotes = textarea.value;
    saveBtn.disabled = true;
  });
};

/* =========================
   QUOTE FEATURE 
========================= */

const loadQuote = async (category = "general") => {
  const url = `${QUOTES_API_BASE}/quotes`;

  try {
    const response = await axios.get(url, {
      params: { category },
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

const wireQuoteEvents = () => {
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

const init = async () => {
  wireQuoteEvents();
  wireTaskEvents();
  wireNotesEvents();

  const select = document.getElementById("quote-category-select");
  const category = select?.value || "general";

  await loadQuote(category);
  await loadTasks();
  await loadNotes();
};

/* =========================
   EXPORT (DO NOT REMOVE)
========================= */

export { init, loadQuote, wireQuoteEvents };

init();