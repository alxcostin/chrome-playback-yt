import { waitForElement } from "./domUtils.js";
import { createSpeedControlUI, highlightActiveSpeed } from "./ui.js";
import { currentSpeed, monitorSpeedChanges } from "./speedManager.js";
import { watchForThemeChanges } from "./domUtils.js";

// Safely injects the custom speed UI only once
function injectSpeedControls(titleElement) {
  const existing = document.querySelector("#fln-speed-controls");
  if (existing || injectSpeedControls._inProgress) {
    console.debug("Injection skipped: already in progress or UI exists");
    return;
  }

  injectSpeedControls._inProgress = true;

  chrome.storage.sync.get("customSpeeds", (data) => {
    const speeds = data.customSpeeds ?? [1, 2.5, 3, 3.5, 4];
    const ui = createSpeedControlUI(speeds);
    titleElement.parentElement.insertBefore(ui, titleElement);
    injectSpeedControls._inProgress = false;
    console.log("✅ Injected speed control UI");
  });
}

// Applies saved playback speed and injects UI after elements are available
function watchForVideoElement() {
  chrome.storage.sync.get("preferredSpeed", (data) => {
    const speed = data.preferredSpeed ?? 1;

    const apply = () => {
      const video = document.querySelector("video");
      if (video) {
        video.defaultPlaybackRate = speed;
        video.playbackRate = speed;
        monitorSpeedChanges();

        waitForElement("#above-the-fold #title", (titleEl) => {
          const old = document.querySelector("#fln-speed-controls");
          if (old) old.remove();

          injectSpeedControls(titleEl);

          waitForElement("#fln-speed-controls", (controls) => {
            highlightActiveSpeed(speed);
            controls.classList.remove("fln-loading");
            watchForThemeChanges(controls);
          });
        });

        console.log(`🎯 Applied playback speed: ${speed}x`);
      }
    };

    apply();

    const observer = new MutationObserver(() => {
      const video = document.querySelector("video");
      if (video && !video.__flnAlreadyHandled) {
        video.__flnAlreadyHandled = true;
        observer.disconnect();
        apply();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

function init() {
  watchForVideoElement();
}

init();
window.addEventListener("yt-navigate-finish", () => {
  console.log("🔁 Navigation detected");
  init();
});
