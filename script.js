document.addEventListener("DOMContentLoaded", () => {
  const addNoteBtn = document.getElementById("addNoteBtn");
  const noteTextInput = document.getElementById("noteText");
  const notesContainer = document.getElementById("notesContainer");
  const undoModal = document.getElementById("undoModal");
  const undoBtn = document.getElementById("undoBtn");
  const modalText = undoModal.querySelector("p"); // Modal text where countdown is shown

  let currentNoteToDelete = null;
  let countdownTimer = null; // To hold the countdown timer reference

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

  // Show the undo modal with countdown
  function showUndoModal(note) {
    currentNoteToDelete = note;
    let countdown = 5; // Start countdown from 5 seconds

    undoModal.style.display = "flex"; // Show modal

    // Update modal text with countdown every second
    countdownTimer = setInterval(() => {
      modalText.textContent = `This task will be deleted in ${countdown} seconds.`;
      countdown--;

      if (countdown < 0) {
        clearInterval(countdownTimer); // Stop the countdown
        if (currentNoteToDelete) {
          currentNoteToDelete.remove(); // Remove note after countdown
          undoModal.style.display = "none"; // Hide modal
          currentNoteToDelete = null;
        }
      }
    }, 1000); // Update every second
  }

  // Undo button click
  undoBtn.addEventListener("click", () => {
    if (currentNoteToDelete) {
      clearInterval(countdownTimer); // Cancel the countdown
      undoModal.style.display = "none"; // Hide modal
      currentNoteToDelete.setAttribute("data-state", "no"); // Reset the state back to "no"
      const status = currentNoteToDelete.querySelector(".status");
      status.textContent = "NO"; // Reset status text to "NO"
      currentNoteToDelete = null; // Cancel deletion
    }
  });
});
