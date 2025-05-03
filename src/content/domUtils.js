// Utility function that waits for a DOM element to appear before continuing
export function waitForElement(selector, callback) {
  const el = document.querySelector(selector);
  if (el) return callback(el); // If it's already there, run the callback immediately

  // Otherwise, use MutationObserver to watch the DOM
  const observer = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) {
      observer.disconnect(); // Stop observing once it's found
      callback(el);
    }
  });

  observer.observe(document.body, {
    childList: true, // watch for new elements
    subtree: true, // also look in nested elements
  });
}

export function detectTheme() {
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeMeta) return "light";
  const color = themeMeta.content;
  return color.includes("255, 255, 255") ? "light" : "dark";
}

export function watchForThemeChanges(container) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;

  let last = detectTheme();

  const observer = new MutationObserver(() => {
    const current = detectTheme();
    if (current !== last) {
      container.classList.remove(`fln-${last}`);
      container.classList.add(`fln-${current}`);
      last = current;
      console.log(`🎨 Theme changed to ${current}`);
    }
  });

  observer.observe(document.head, { childList: true, subtree: true });
}
