document.addEventListener("DOMContentLoaded", () => {
  const addNoteBtn = document.getElementById("addNoteBtn");
  const noteTextInput = document.getElementById("noteText");
  const notesContainer = document.getElementById("notesContainer");
  const undoModal = document.getElementById("undoModal");
  const undoBtn = document.getElementById("undoBtn");
  const darkModeToggle = document.getElementById("darkModeToggle");

  let currentNoteToDelete = null;

  // Check for saved theme preference in localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  // Load saved tasks from localStorage
  loadTasksFromLocalStorage();

  // Add a new note
  addNoteBtn.addEventListener("click", () => {
    const noteText = noteTextInput.value.trim();
    const timestamp = new Date().toLocaleString();

    if (noteText) {
      const noteElement = createNoteElement(noteText, timestamp, "no");
      notesContainer.appendChild(noteElement);
      noteTextInput.value = ""; // Clear the input

      // Save the new task to localStorage
      saveTaskToLocalStorage(noteText, timestamp, "no");
    }
  });

  // Toggle dark mode
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save the theme preference in localStorage
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });

  // Create a note element
  function createNoteElement(text, timestamp, state) {
    const note = document.createElement("div");
    note.className = "note";
    note.setAttribute("data-state", state); // Set task state (default is "no")

    const question = document.createElement("span");
    question.textContent = text;

    const status = document.createElement("div");
    status.className = "status";
    status.textContent = state === "no" ? "NO" : "YES";

    const time = document.createElement("div");
    time.className = "timestamp";
    time.textContent = timestamp;

    note.appendChild(question);
    note.appendChild(status);
    note.appendChild(time);

    // Toggle state when clicking anywhere in the note
    note.addEventListener("click", () => {
      const currentState = note.getAttribute("data-state");
      const newState = currentState === "no" ? "yes" : "no";
      note.setAttribute("data-state", newState);
      status.textContent = newState === "no" ? "NO" : "YES";

      // Update the task state in localStorage
      updateTaskStateInLocalStorage(note, newState);

      if (newState === "yes") {
        showUndoModal(note);
      }
    });

    return note;
  }

  // Load saved tasks from localStorage and display them
  function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(task => {
      const taskElement = createNoteElement(task.text, task.timestamp, task.state);
      notesContainer.appendChild(taskElement);
    });
  }

  // Save the task to localStorage
  function saveTaskToLocalStorage(text, timestamp, state) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text, timestamp, state });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Update task state in localStorage
  function updateTaskStateInLocalStorage(note, newState) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex(task => task.text === note.querySelector("span").textContent);
    
    if (taskIndex > -1) {
      tasks[taskIndex].state = newState;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  // Show the undo modal
  function showUndoModal(note) {
    currentNoteToDelete = note;

    undoModal.style.display = "flex"; // Show modal

    // Set a 5-second timer to delete the note
    setTimeout(() => {
      if (currentNoteToDelete) {
        currentNoteToDelete.remove(); // Remove note after 5 seconds
        undoModal.style.display = "none"; // Hide modal
        currentNoteToDelete = null;
      }
    }, 5000);
  }

  // Undo button click
  undoBtn.addEventListener("click", () => {
    if (currentNoteToDelete) {
      undoModal.style.display = "none"; // Hide modal
      currentNoteToDelete.setAttribute("data-state", "no"); // Reset state to "no"
      const status = currentNoteToDelete.querySelector(".status");
      status.textContent = "NO"; // Reset text to "NO"
      currentNoteToDelete.classList.remove("bouncing"); // Remove bouncing class if exists
      currentNoteToDelete = null; // Cancel deletion
    }
  });
});
