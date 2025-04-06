/**
 * Adjust the height of the textarea based on content
 * @param {HTMLElement} textarea - The textarea element
 */
// Store previous content length to check for significant changes
const prevContentLength = { value: 0 };
let debounceTimer = null;

export function adjustTextareaHeight(textarea) {
  if (!textarea) return;

  const defaultHeight = window.innerWidth <= 1000 ? "50px" : "40px";

  // Clear any pending debounce
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // If textarea is empty, set to default height immediately
  if (!textarea.value.trim()) {
    textarea.style.height = defaultHeight;
    prevContentLength.value = 0;
    return;
  }

  // Check if content length is significantly different than previous
  // or if content exceeds visible area significantly
  const currentLength = textarea.value.length;
  const contentChange = Math.abs(currentLength - prevContentLength.value);
  const hasNewlines = textarea.value.includes("\n");

  // If very short content (typing first few chars), don't resize yet
  if (currentLength < 5 && !hasNewlines) {
    return;
  }

  // Immediate resize for significant changes like new lines or paste operations
  if (
    hasNewlines ||
    contentChange > 10 ||
    textarea.scrollHeight > parseInt(textarea.style.height || defaultHeight)
  ) {
    // Reset the height first to recalculate scrollHeight correctly
    textarea.style.height = "auto";

    // Adjust height based on content, max 150px
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    prevContentLength.value = currentLength;
    return;
  }

  // For small changes, debounce the resize
  debounceTimer = setTimeout(() => {
    // Reset the height first to recalculate scrollHeight correctly
    textarea.style.height = "auto";

    // Adjust height based on content, max 150px
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    prevContentLength.value = currentLength;
  }, 300); // Wait 300ms before resizing for small changes
}

/**
 * Set inputs disabled/enabled state
 * @param {boolean} disabled - Whether to disable inputs
 * @param {HTMLElement} textarea - The textarea element
 * @param {HTMLElement} sendBtn - The send button element
 */
export function setInputsDisabled(disabled, textarea, sendBtn) {
  textarea.disabled = disabled;
  sendBtn.disabled = disabled;
  sendBtn.style.opacity = disabled ? "0.5" : "1";
  textarea.style.cursor = disabled ? "not-allowed" : "text";
  const allButtons = document.querySelectorAll(".txtarea .btns i");
  allButtons.forEach((button) => {
    button.style.opacity = disabled ? "0.5" : "1";
    button.style.cursor = disabled ? "not-allowed" : "pointer";
    button.style.pointerEvents = disabled ? "none" : "auto";
  });
}

export function updateButtonText() {
  const filesBtn = document.querySelector("#files");
  const microphoneBtn = document.querySelector("#microphone-btn");
  const photoBtn = document.querySelector("#photo");

  if (!filesBtn || !microphoneBtn || !photoBtn) return;

  const existingCount = photoBtn.querySelector(".image-count");
  const currentCount = existingCount ? existingCount.textContent : "";

  if (window.innerWidth <= 1000) {
    filesBtn.innerHTML = '<i class="fa-solid fa-paperclip"></i> Files';
    microphoneBtn.innerHTML =
      '<i class="fa-solid fa-microphone-lines"></i> Audio';
    photoBtn.innerHTML = '<i class="fa-solid fa-camera"></i> Image';
  } else {
    filesBtn.innerHTML = '<i class="fa-solid fa-paperclip"></i>';
    microphoneBtn.innerHTML = '<i class="fa-solid fa-microphone-lines"></i>';
    photoBtn.innerHTML = '<i class="fa-solid fa-camera"></i>';
  }

  // Restore the count if it existed
  if (currentCount) {
    const countElement = document.createElement("div");
    countElement.className = "image-count";
    countElement.textContent = currentCount;
    photoBtn.appendChild(countElement);
  }
}

/**
 * Update image count display
 * @param {number} imageCount - The number of images
 * @param {HTMLElement} photoBtn - The photo button element
 */
export function updateImageCount(imageCount, photoBtn) {
  const existingCount = photoBtn.querySelector(".image-count");
  if (imageCount > 0) {
    if (existingCount) {
      existingCount.textContent = imageCount;
      existingCount.style.animation = "none";
      setTimeout(() => {
        existingCount.style.animation =
          "countPulse 0.5s cubic-bezier(0.11, 0.44, 0.12, 1.29)";
      }, 10);
    } else {
      const counter = document.createElement("span");
      counter.className = "image-count";
      counter.textContent = imageCount;
      photoBtn.appendChild(counter);
    }
    photoBtn.classList.add("image-uploading");
  } else {
    if (existingCount) {
      photoBtn.removeChild(existingCount);
    }
    photoBtn.classList.remove("image-uploading");
  }
}
