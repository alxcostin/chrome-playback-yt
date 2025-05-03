import { setPlaybackSpeed, currentSpeed } from "./speedManager.js";
import { detectTheme } from "./domUtils.js";

// Builds the UI component that contains the speed buttons
export function createSpeedControlUI(speeds = [1, 2.5, 3, 3.5, 4]) {
  const container = document.createElement("div");
  container.id = "fln-speed-controls";
  container.className = "fln-speed-ui fln-loading"; // apply loading style

  const theme = detectTheme(); // 🆕 get light/dark mode
  container.classList.add(`fln-${theme}`); // adds fln-dark or fln-light

  // Basic styles applied directly (these could be in CSS too)
  //   container.style.display = "flex";
  //   container.style.gap = "8px";
  //   container.style.margin = "12px 0";
  //   container.style.padding = "6px 12px";
  //   container.style.background = "#111";
  //   container.style.color = "white";
  //   container.style.borderRadius = "8px";

  speeds.forEach((speed) => {
    const btn = document.createElement("button");
    btn.textContent = `${speed}x`;
    btn.className = "fln-speed-btn";
    btn.style.padding = "6px 12px";
    btn.style.cursor = "pointer";
    btn.style.background = "white";
    btn.style.color = "black";
    btn.style.border = "none";
    btn.style.borderRadius = "4px";

    btn.addEventListener("click", () => setPlaybackSpeed(speed)); // click = change speed
    container.appendChild(btn);
  });

  return container;
}

// Highlights the active speed button visually
export function highlightActiveSpeed(currentSpeed) {
  const buttons = document.querySelectorAll(".fln-speed-btn");

  buttons.forEach((btn) => {
    const btnSpeed = parseFloat(btn.textContent.replace("x", ""));
    const isActive =
      Math.round(btnSpeed * 100) === Math.round(currentSpeed * 100);

    // ✅ Use a class instead of inline styles
    btn.classList.toggle("active", isActive);
  });
}
