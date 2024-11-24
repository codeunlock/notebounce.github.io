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

  // Add a new note
  addNoteBtn.addEventListener("click", () => {
    const noteText = noteTextInput.value.trim();
    const timestamp = new Date().toLocaleString();

    if (noteText) {
      const noteElement = createNoteElement(noteText, timestamp);
      notesContainer.appendChild(noteElement);
      noteTextInput.value = ""; // Clear the input
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
  function createNoteElement(text, timestamp) {
    const note = document.createElement("div");
    note.className = "note";
    note.setAttribute("data-state", "no"); // Default state is "No"

    const question = document.createElement("span");
    question.textContent = text;

    const status = document.createElement("div");
    status.className = "status";
    status.textContent = "NO";

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

      if (newState === "yes") {
        showUndoModal(note);
      }
    });

    return note;
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
      currentNoteToDelete = null; // Cancel deletion
    }
  });
});
