import { setPlaybackSpeed, currentSpeed } from "./speedManager.js";
import { detectTheme } from "./domUtils.js";

export function createSpeedControlUI(speeds = [1, 2.5, 3, 3.5, 4]) {
  const container = document.createElement("div");
  container.id = "fln-speed-controls";
  container.className = "fln-speed-ui fln-loading";

  const theme = detectTheme();
  container.classList.add(`fln-${theme}`);

  speeds.forEach((speed) => {
    const btn = document.createElement("button");
    btn.textContent = `${speed}x`;
    btn.className = "fln-speed-btn";

    btn.addEventListener("click", () => setPlaybackSpeed(speed));
    container.appendChild(btn);
  });

  return container;
}

export function highlightActiveSpeed(currentSpeed) {
  const buttons = document.querySelectorAll(".fln-speed-btn");
  buttons.forEach((btn) => {
    const btnSpeed = parseFloat(btn.textContent.replace("x", ""));
    const isActive =
      Math.round(btnSpeed * 100) === Math.round(currentSpeed * 100);
    btn.classList.toggle("active", isActive);
  });
}
