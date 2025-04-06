/**
 * Initialize speech recognition
 * @returns {SpeechRecognition|null} Speech recognition object or null if not supported
 */
export function initializeSpeechRecognition() {
  if (!("webkitSpeechRecognition" in window)) {
    return null;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  recognition.maxAlternatives = 1;

  return recognition;
}
