import { escapeHtml } from "../utils/codeHandler.js";
import { enhanceImages } from "../utils/imageHandler.js";
import { enhanceCodeBlocks } from "../utils/codeHandler.js";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked options for security and customization
marked.setOptions({
  gfm: true, // Enable GitHub Flavored Markdown
  breaks: true, // Add <br> on single line breaks
  headerIds: false, // Disable automatic header IDs
  mangle: false, // Disable mangling email addresses
  sanitize: false, // Let DOMPurify handle sanitization
  highlight: function (code, lang) {
    return code;
  },
});

/**
 * Add a message to the chat box
 * @param {string|Object} message - The message to add (text or object with image)
 * @param {string} sender - The sender of the message ('user' or 'bot')
 * @param {HTMLElement} tempDiv - Optional temporary div for the message
 */
export function addMessageToChatBox(message, sender, tempDiv) {
  const chatBox = document.getElementById("userchat");
  if (!chatBox) return;

  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);

  const formattedMessage = document.createElement("div");
  formattedMessage.classList.add("formatted-message");

  if (typeof message === "object" && message.image) {
    // Handle message with image
    const img = document.createElement("img");
    img.src = message.image;
    img.classList.add("chat-image");
    formattedMessage.appendChild(img); // Append image first

    if (message.text) {
      // Apply Markdown formatting to text
      const textHtml = DOMPurify.sanitize(marked.parse(message.text || ""));
      const textElement = document.createElement("div");
      textElement.className = "markdown-content";
      textElement.innerHTML = textHtml;
      formattedMessage.appendChild(textElement); // Append text below the image
    }
  } else {
    // Handle regular message
    let parsedAsJson = false;
    try {
      const parsed = JSON.parse(message);
      if (parsed && Array.isArray(parsed.blocks)) {
        parsedAsJson = true;
        let htmlContent = "";
        parsed.blocks.forEach((block, index, array) => {
          if (block.type === "text") {
            // Convert text content with markdown
            const markdownHtml = DOMPurify.sanitize(
              marked.parse(block.content || "")
            );
            htmlContent += `<div class="markdown-content">${markdownHtml}</div>`;
            if (sender === "bot" && index !== array.length - 1) {
              htmlContent += "<br>";
            }
          } else if (block.type === "code") {
            const safeCode = escapeHtml(block.content);
            const language = block.language || "plaintext";
            htmlContent += `
                  <div class="code-block">
                    <pre><code class="language-${language}">${safeCode}</code></pre>
                  </div>
                  <br>`; // Add <br> after code block
          } else if (block.type === "image") {
            htmlContent += `<img src="${block.url}" alt="${escapeHtml(
              block.alt || ""
            )}" />`;
          } else {
            const markdownHtml = DOMPurify.sanitize(
              marked.parse(block.content || "")
            );
            htmlContent += `<div class="markdown-content">${markdownHtml}</div>`;
          }
        });
        formattedMessage.innerHTML = htmlContent;
      }
    } catch (e) {
      parsedAsJson = false;
    }

    if (!parsedAsJson) {
      // Apply Markdown parsing to the entire message
      let htmlContent = DOMPurify.sanitize(marked.parse(message || ""));

      // Process code blocks - marked handles the basic parsing, but we need to enhance
      htmlContent = htmlContent.replace(
        /<pre><code( class="language-(\w+)")?>([^<]+)<\/code><\/pre>/g,
        (match, langClass, language = "plaintext", code) => {
          const decodedCode = code
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&");
          return `<div class="code-block"><span class="language-label">${
            language || "plaintext"
          }</span><button class="copy-btn" onclick="copyCode(this)">Copy</button><pre><code class="language-${
            language || "plaintext"
          }">${decodedCode}</code></pre></div>`;
        }
      );

      // Wrap the entire content in a markdown-content div
      formattedMessage.innerHTML = `<div class="markdown-content">${htmlContent}</div>`;
    }
  }

  messageElement.appendChild(formattedMessage);
  chatBox.appendChild(messageElement);

  setTimeout(checkContentHeight, 100);

  // Process math expressions
  if (window.katex) {
    document.querySelectorAll(".math").forEach((element) => {
      window.katex.render(element.textContent, element, {
        throwOnError: false,
        displayMode: false,
      });
    });
  }

  scrollChatToBottom();

  if (sender === "bot") {
    indicateNewMessage();
  }

  setTimeout(() => {
    enhanceImages();
    enhanceCodeBlocks();

    // Apply syntax highlighting to code blocks
    if (window.hljs) {
      document.querySelectorAll("pre code").forEach((block) => {
        window.hljs.highlightBlock(block);
      });
    }
  }, 100);
}

export function checkContentHeight() {
  const chatBox = document.getElementById("userchat");
  if (!chatBox) return;

  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth",
  });
}

export function scrollChatToBottom() {
  const chatBox = document.getElementById("userchat");
  if (!chatBox) return;

  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth",
  });
}

export function indicateNewMessage() {
  const chatBox = document.getElementById("userchat");
  const scrollBtn = document.getElementById("scrollBtn");

  if (
    scrollBtn &&
    chatBox &&
    chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight > 100
  ) {
    scrollBtn.classList.add("new-message");
  }
}

/**
 * Add a chat to the history sidebar
 * @param {string} userMessage - The user message to add to history
 */
export function addChatToHistory(userMessage) {
  const chatHistContainer = document.querySelector(".chathist");
  if (!chatHistContainer) return;

  const chatItem = document.createElement("div");
  chatItem.className = "chat-history-item";

  const truncatedMessage =
    userMessage.length > 25
      ? userMessage.substring(0, 25) + "..."
      : userMessage;

  chatItem.innerHTML = `
    <i class="fas fa-comment-dots"></i>
    <span>${truncatedMessage}</span>
  `;

  if (chatHistContainer.firstChild) {
    chatHistContainer.insertBefore(chatItem, chatHistContainer.firstChild);
  } else {
    chatHistContainer.appendChild(chatItem);
  }

  chatItem.addEventListener("click", () => {
    alert("Loading chat: " + userMessage);
  });
}

/**
 * Type a message with animation
 * @param {HTMLElement} element - The element to type the message into
 * @param {string} text - The text to type
 * @param {number} index - The current index in the text
 */
export function typeMessage(element, text, index = 0) {
  if (index < text.length) {
    element.innerHTML += text.charAt(index);
    setTimeout(() => typeMessage(element, text, index + 1), 20);
  }
}
