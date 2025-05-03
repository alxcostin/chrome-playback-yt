import { highlightActiveSpeed } from "./ui.js";

export let currentSpeed = 1; // This holds the current speed state

// Sets the speed on the video and updates everything else
export function setPlaybackSpeed(speed) {
  const video = document.querySelector("video");
  if (video) {
    video.defaultPlaybackRate = speed; // ensures YouTube doesn't override it
    video.playbackRate = speed; // actually sets the current speed
    currentSpeed = speed; // update our internal state
    highlightActiveSpeed(speed); // highlight the correct button
    chrome.storage.sync.set({ preferredSpeed: speed }); // persist it
    console.log(`✅ Set speed to ${speed}x`);
  }
}

// Keeps the UI in sync if the user changes speed via YouTube controls or keyboard
export function monitorSpeedChanges() {
  const video = document.querySelector("video");
  if (!video || video.__flnRateListenerAttached) return; // avoid duplicate listeners

  const updateUI = () => {
    const newSpeed = video.playbackRate;
    currentSpeed = newSpeed;
    highlightActiveSpeed(newSpeed);
    console.log(`🎧 Playback speed changed to ${newSpeed}x`);
  };

  video.addEventListener("ratechange", updateUI); // listen for changes
  video.__flnRateListenerAttached = true; // prevent duplicates
  updateUI(); // run once immediately
}
