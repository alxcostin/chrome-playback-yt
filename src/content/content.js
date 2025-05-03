import { waitForElement } from "./domUtils.js";
import { createSpeedControlUI, highlightActiveSpeed } from "./ui.js";
import { currentSpeed, monitorSpeedChanges } from "./speedManager.js";
import { detectTheme, watchForThemeChanges } from "./domUtils.js";

// Inserts the UI under the video title if it doesn't already exist
function injectSpeedControls(titleElement) {
  if (document.querySelector("#fln-speed-controls")) return; // already inserted
  const ui = createSpeedControlUI();
  titleElement.parentElement.insertBefore(ui, titleElement);
}

// Main function that coordinates applying speed and loading UI on each video
function watchForVideoElement() {
  chrome.storage.sync.get("preferredSpeed", (data) => {
    const speed = data.preferredSpeed ?? 1; // use saved or fallback to 1x

    const apply = () => {
      const video = document.querySelector("video");
      if (video) {
        video.defaultPlaybackRate = speed;
        video.playbackRate = speed;

        monitorSpeedChanges(); // make sure UI stays in sync

        // Only inject UI once title and video are both ready
        waitForElement("#above-the-fold #title", (titleEl) => {
          injectSpeedControls(titleEl);

          waitForElement("#fln-speed-controls", (controls) => {
            highlightActiveSpeed(speed);
            controls.classList.remove("fln-loading");
            watchForThemeChanges(controls); // 🆕 Start watching for theme changes
          });
        });

        console.log(`🎯 Applied playback speed: ${speed}x`);
      }
    };

    apply(); // run immediately

    // Also watch for YouTube dynamically inserting new video elements
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

// Entry point: starts everything
function init() {
  watchForVideoElement();
}

// Run immediately and again when navigating in YouTube’s single-page app system
init();
window.addEventListener("yt-navigate-finish", () => {
  console.log("🔁 Navigation detected");
  init();
});
