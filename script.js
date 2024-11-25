const keyboard = document.getElementById("keyboard");
const input = document.getElementById("text-input");

const rows = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Ctrl", "Alt", "Space", "Alt", "Ctrl", "←", "↑", "↓", "→"]
];

const shiftKeys = {
  "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")",
  "-": "_", "=": "+", "`": "~", "[": "{", "]": "}", "\\": "|", ";": ":", "'": "\"", ",": "<", ".": ">", "/": "?"
};

let isCapsLock = false;
let isShift = false;

// Helper to apply character transformations
const transformKey = (key) => {
  if (isShift && shiftKeys[key]) return shiftKeys[key];
  return isCapsLock ? key.toUpperCase() : key.toLowerCase();
};

// Create the keyboard layout
rows.forEach((row) => {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("keyboard-row");

  row.forEach((key) => {
    const keyDiv = document.createElement("div");
    keyDiv.classList.add("key");
    if (["Backspace", "Tab", "CapsLock", "Enter", "Shift"].includes(key)) {
      keyDiv.classList.add("wide");
    }
    if (["Space"].includes(key)) {
      keyDiv.classList.add("ultra-wide");
    }
    if (["←", "↑", "↓", "→"].includes(key)) {
      keyDiv.classList.add("arrow");
    }
    if (key.length > 5) {
      keyDiv.classList.add("small-font");
    }
    keyDiv.textContent = key;
    keyDiv.dataset.key = key; // Map real keypresses to virtual keys
    keyDiv.addEventListener("click", () => handleKeyPress(key));
    rowDiv.appendChild(keyDiv);
  });

  keyboard.appendChild(rowDiv);
});

// Add active styling on real keypress
document.addEventListener("keydown", (e) => {
  const virtualKey = document.querySelector(`.key[data-key="${e.key}"]`);
  if (virtualKey) virtualKey.classList.add("active");
});

document.addEventListener("keyup", (e) => {
  const virtualKey = document.querySelector(`.key[data-key="${e.key}"]`);
  if (virtualKey) virtualKey.classList.remove("active");
});

// Handle key press events
function handleKeyPress(key) {
  if (key === "Backspace") {
    input.value = input.value.slice(0, -1);
  } else if (key === "Tab") {
    input.value += "    ";
  } else if (key === "CapsLock") {
    isCapsLock = !isCapsLock;
    updateKeys();
  } else if (key === "Enter") {
    input.value += "\n";
  } else if (key === "Shift") {
    isShift = !isShift;
    updateKeys();
  } else if (key === "Space") {
    input.value += " ";
  } else if (["←", "→"].includes(key)) {
    moveCursor(key === "←" ? -1 : 1);
  } else if (["↑", "↓"].includes(key)) {
    moveCursorVertical(key === "↑" ? -1 : 1);
  } else {
    input.value += transformKey(key);
    if (isShift) {
      isShift = false; // Disable shift after one use
      updateKeys();
    }
  }
}

// Update keys on CapsLock/Shift toggles
function updateKeys() {
  document.querySelectorAll(".key").forEach((key) => {
    if (key.textContent.length === 1 && key.textContent.match(/[a-z0-9`~!@#$%^&*()\-_+=\[\]{};:'",.<>?/]/i)) {
      key.textContent = transformKey(key.dataset.key);
    }
  });
  document.querySelectorAll(".key[data-key='Shift']").forEach((key) =>
    key.classList.toggle("active", isShift)
  );
}

// Move the cursor horizontally
function moveCursor(direction) {
  const pos = input.selectionStart;
  input.setSelectionRange(pos + direction, pos + direction);
}

// Move the cursor vertically
function moveCursorVertical(direction) {
  const lines = input.value.split("\n");
  const currentPos = input.selectionStart;
  const currentLine = input.value.substring(0, currentPos).split("\n").length - 1;

  const newLine = Math.max(0, Math.min(lines.length - 1, currentLine + direction));
  const targetPos =
    lines.slice(0, newLine).reduce((acc, line) => acc + line.length + 1, 0) +
    Math.min(lines[newLine].length, currentPos - lines.slice(0, currentLine).reduce((acc, line) => acc + line.length + 1, 0));

  input.setSelectionRange(targetPos, targetPos);
}

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  document.body.dataset.theme =
    document.body.dataset.theme === "dark" ? "light" : "dark";
  themeToggle.textContent =
    document.body.dataset.theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
});

