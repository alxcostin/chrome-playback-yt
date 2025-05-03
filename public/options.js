const checkboxContainer = document.getElementById("checkboxContainer");
const status = document.getElementById("status");

// Define available speeds
const availableSpeeds = Array.from({ length: 16 }, (_, i) => (i + 1) * 0.25); // 0.25x to 4x
const defaultChecked = [1, 1.5, 2, 2.5, 3];

// Create checkboxes
availableSpeeds.forEach((speed) => {
  const label = document.createElement("label");
  label.style.marginRight = "12px";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = speed;
  checkbox.name = "speed";
  checkbox.classList.add("speed-checkbox");

  label.appendChild(checkbox);
  label.append(` ${speed}x`);
  checkboxContainer.appendChild(label);
});

// Load saved speeds and check relevant boxes
chrome.storage.sync.get("customSpeeds", (data) => {
  const saved = data.customSpeeds ?? defaultChecked;
  document.querySelectorAll(".speed-checkbox").forEach((box) => {
    if (saved.includes(parseFloat(box.value))) {
      box.checked = true;
    }
  });
});

// Save selected speeds
document.getElementById("speedForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const selected = Array.from(document.querySelectorAll(".speed-checkbox"))
    .filter((cb) => cb.checked)
    .map((cb) => parseFloat(cb.value));

  chrome.storage.sync.set({ customSpeeds: selected }, () => {
    status.textContent = "✅ Speeds saved!";
    setTimeout(() => (status.textContent = ""), 1500);
  });
});
