export function enhanceCodeBlocks() {
  document
    .querySelectorAll("pre code:not([data-enhanced])")
    .forEach((codeBlock) => {
      const pre = codeBlock.parentElement;

      const languageClass = codeBlock.className.match(/language-(\w+)/);
      const language = languageClass ? languageClass[1] : "plaintext";

      if (language) {
        pre.setAttribute("data-language", language);

        if (!pre.parentElement.querySelector(".copy-btn")) {
          const copyBtn = document.createElement("button");
          copyBtn.className = "copy-btn";
          copyBtn.textContent = "Copy";
          copyBtn.addEventListener("click", () => {
            copyCodeToClipboard(codeBlock.textContent, pre);
          });
          pre.parentElement.insertBefore(copyBtn, pre);
        }

        pre.addEventListener("click", (event) => {
          const rect = pre.getBoundingClientRect();
          const clickX = event.clientX - rect.left;
          const clickY = event.clientY - rect.top;
          if (clickY < 36 && rect.width - clickX < 100) {
            copyCodeToClipboard(codeBlock.textContent, pre, false);

            const originalLanguage = pre.getAttribute("data-language");
            pre.setAttribute("data-original-language", originalLanguage);
            pre.setAttribute("data-language", "Copied!");

            setTimeout(() => {
              if (pre.getAttribute("data-original-language")) {
                pre.setAttribute(
                  "data-language",
                  pre.getAttribute("data-original-language")
                );
                pre.removeAttribute("data-original-language");
              }
            }, 2000);
          }
        });
      }
      codeBlock.dataset.enhanced = "true";
    });
}

/**
 * Copy code to clipboard and show feedback
 * @param {string} text - The text to copy
 * @param {HTMLElement} preElement - The pre element containing the code
 * @param {boolean} showPopup - Whether to show the popup feedback (default: true)
 */
export function copyCodeToClipboard(text, preElement, showPopup = true) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (showPopup) {
          showCopyFeedback(preElement);
        }
      })
      .catch((err) => {
        console.error("Clipboard API error:", err);
        fallbackCopyText(text, preElement, showPopup);
      });
  } else {
    fallbackCopyText(text, preElement, showPopup);
  }
}

/**
 * Show feedback when code is copied
 * @param {HTMLElement} preElement - The pre element containing the code
 */
export function showCopyFeedback(preElement) {
  // Create a feedback popup
  const feedback = document.createElement("div");
  feedback.className = "copy-feedback";
  feedback.textContent = "Copied!";
  feedback.style.position = "absolute";
  feedback.style.top = "8px";
  feedback.style.right = "10px";
  feedback.style.background = "rgba(76, 175, 80, 0.9)";
  feedback.style.color = "white";
  feedback.style.padding = "2px 8px";
  feedback.style.borderRadius = "4px";
  feedback.style.fontSize = "12px";
  feedback.style.fontFamily = "'Comfortaa', sans-serif";
  feedback.style.zIndex = "100";
  feedback.style.animation = "fadeInOut 1.5s forwards";

  // Add to the pre element
  preElement.style.position = "relative";
  preElement.appendChild(feedback);

  // Remove after animation completes
  setTimeout(() => {
    if (preElement.contains(feedback)) {
      preElement.removeChild(feedback);
    }
  }, 1500);
}

/**
 * Fallback for copying text to clipboard when Clipboard API is not available
 * @param {string} text - The text to copy
 * @param {HTMLElement} preElement - The element to show feedback on
 * @param {boolean} showPopup - Whether to show the popup feedback
 */
export function fallbackCopyText(text, preElement, showPopup = true) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful && showPopup) {
      showCopyFeedback(preElement);
    } else if (!successful) {
      console.error("Fallback: Copy command was unsuccessful");
    }
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - The string to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;"); // Added escaping for single quotes
}
