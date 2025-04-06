// Import all required modules
import { initGreeting } from "./components/greeting.js";
import { sendMessage } from "./components/chatService.js";
import { convertImageToBase64 } from "./utils/imageHandler.js";
import { initializeSpeechRecognition } from "./utils/speechRecognition.js";
import {
  adjustTextareaHeight,
  setInputsDisabled,
  updateButtonText,
  updateImageCount,
} from "./utils/ui.js";

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  globalThis.isWaitingForResponse = false;
  const conversationHistory = [];
  const textarea = document.getElementById("typing");
  const sendBtn = document.getElementById("send-btn");
  const chatBox = document.getElementById("userchat");
  const micBtn = document.getElementById("microphone-btn");

  let isRecording = false;
  let recognition = null;

  if (!chatBox) {
    console.error("Chat box element not found");
    return;
  }

  // Initialize textarea height adjustment
  textarea.addEventListener("input", () => adjustTextareaHeight(textarea));
  adjustTextareaHeight(textarea);
  window.addEventListener("resize", () => adjustTextareaHeight(textarea));

  // Initialize image handling
  const photoBtn = document.querySelector("#photo");
  let selectedImage = null;
  let isUploading = false;
  let imageCount = 0;
  let selectedImages = [];

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  photoBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      isUploading = true;
      photoBtn.parentElement.classList.add("image-uploading");

      try {
        selectedImage = await convertImageToBase64(file);
        selectedImages.push(selectedImage); // Store the image
        imageCount++; // Increment count
        updateImageCount(imageCount, photoBtn);
        adjustTextareaHeight(textarea);
      } catch (error) {
        console.error("Error processing image:", error);
        alert("Failed to process image. Please try again.");
      } finally {
        isUploading = false;
        photoBtn.parentElement.classList.remove("image-uploading");
      }
    }
  });

  // Handle send button click
  sendBtn.addEventListener("click", () => {
    const userMessage = textarea.value.trim();
    sendMessage({
      userMessage,
      conversationHistory,
      textarea,
      setInputsDisabled: (disabled) =>
        setInputsDisabled(disabled, textarea, sendBtn),
      chatBox,
      selectedImage,
      selectedImages,
      imageCount,
      updateImageCount: (count) => updateImageCount(count, photoBtn),
      photoBtn,
    }).then((result) => {
      if (result) {
        // Update the conversation history with the returned value
        if (result.conversationHistory) {
          Object.assign(conversationHistory, result.conversationHistory);
        }

        // Update the image count with the returned value
        if (result.imageCount !== undefined) {
          imageCount = result.imageCount;
          updateImageCount(imageCount, photoBtn);
        }
      }
    });
  });

  // Handle Enter key press
  textarea.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const userMessage = textarea.value.trim();
      sendMessage({
        userMessage,
        conversationHistory,
        textarea,
        setInputsDisabled: (disabled) =>
          setInputsDisabled(disabled, textarea, sendBtn),
        chatBox,
        selectedImage,
        selectedImages,
        imageCount,
        updateImageCount: (count) => updateImageCount(count, photoBtn),
        photoBtn,
      }).then((result) => {
        if (result) {
          // Update the conversation history with the returned value
          if (result.conversationHistory) {
            Object.assign(conversationHistory, result.conversationHistory);
          }

          // Update the image count with the returned value
          if (result.imageCount !== undefined) {
            imageCount = result.imageCount;
            updateImageCount(imageCount, photoBtn);
          }
        }
      });
    }
  });

  // Start recording function
  function startRecording() {
    recognition = initializeSpeechRecognition();

    if (!recognition) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome."
      );
      return;
    }

    try {
      isRecording = true;
      micBtn.parentElement.classList.add("recording");
      textarea.value = "";
      recognition.onstart = () => {
        console.log("Speech recognition started");
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        textarea.value = transcript;
        textarea.dispatchEvent(new Event("input"));
      };

      recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
        switch (event.error) {
          case "network":
            setTimeout(() => {
              if (isRecording) {
                recognition.start();
              }
            }, 1000);
            break;
          case "not-allowed":
          case "service-not-allowed":
            alert("Please allow microphone access to use speech recognition.");
            stopRecording();
            break;
          default:
            if (isRecording) {
              recognition.start();
            }
        }
      };

      recognition.onend = () => {
        if (isRecording) {
          try {
            recognition.start();
          } catch (e) {
            console.error("Error restarting recognition:", e);
          }
        }
      };

      recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      stopRecording();
      alert("Failed to start speech recognition. Please try again.");
    }
  }

  // Stop recording function
  function stopRecording() {
    isRecording = false;
    micBtn.parentElement.classList.remove("recording");

    if (recognition) {
      recognition.stop();
      recognition = null;
    }
  }

  // Handle microphone button click
  micBtn.addEventListener("click", () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  updateButtonText();
  window.addEventListener("resize", updateButtonText);
  initGreeting();

  setTimeout(() => {
    const circuitBg = document.querySelector(".circuit-background");
    const reactorGlow = document.querySelector(".reactor-glow");

    if (!circuitBg || !circuitBg.childNodes.length) {
      console.log("Reloading background elements...");
      if (typeof createCircuitElements === "function") {
        createCircuitElements();
        createReactorGlow();
      }
    }
  }, 1000);

  const newChatBtn = document.querySelector(".newcht button");
  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      chatBox.innerHTML = "";
      conversationHistory.length = 0;
    });
  }

  window.addEventListener("beforeunload", () => {
    if (isRecording) {
      stopRecording();
    }
  });
});
