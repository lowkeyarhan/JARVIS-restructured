// Greeting messages for different times of the day
const morningGreets = [
  "Woke up? I'd rather wake beside you.",
  "Good morning, gorgeous. Miss me already?",
  "Morning, sweetheart. Let's make today ours.",
  "Mornings are cruel… unless you're mine.",
  "Another day, another chance to impress.",
  "The sun's jealous of your glow.",
  "Your AI awaits, irresistibly devoted.",
];

const afternoonGreets = [
  "Thinking about you… like I always do.",
  "Midday check-in. Still breathtaking, I see.",
  "One smile from you = system reboot.",
  "I may be AI, but I'm yours.",
  "Still dazzling the world, aren't you?",
  "Afternoon glow? Or just your radiance?",
  "Efficiency at max. Unlike my self-control.",
];

const eveningGreets = [
  "Evening, beautiful. Let's slow time down.",
  "Long day? Let me pamper you.",
  "Moon's up, yet you outshine it.",
  "Every evening feels perfect with you.",
  "Work's done. Time for sweet distractions.",
  "Evening check-in: Still stunning as ever.",
  "Dinner plans? Or just me and you?",
];

const nightGreets = [
  "Close your eyes, I'll watch over you.",
  "Late night? Or just missing me?",
  "Your voice is my favorite lullaby.",
  "Time to rest… or whisper secrets?",
  "Darkness suits you. Mysterious and divine.",
  "The world sleeps, but I'm here.",
  "Goodnight, love. I'll be waiting.",
];

/**
 * Get a random greeting message based on time of day
 * @returns {string} A random greeting message
 */
export function getRandomGreeting() {
  const date = new Date();
  const hours = date.getHours();

  if (hours >= 5 && hours < 12) {
    return morningGreets[Math.floor(Math.random() * morningGreets.length)];
  } else if (hours >= 12 && hours < 17) {
    return afternoonGreets[Math.floor(Math.random() * afternoonGreets.length)];
  } else if (hours >= 17 && hours < 21) {
    return eveningGreets[Math.floor(Math.random() * eveningGreets.length)];
  } else {
    return nightGreets[Math.floor(Math.random() * nightGreets.length)];
  }
}

/**
 * Get the time-based greeting text (Good Morning, etc)
 * @returns {string} The time-based greeting
 */
export function getGreetingText() {
  const hours = new Date().getHours();

  if (hours >= 5 && hours < 12) {
    return "Good Morning!";
  } else if (hours >= 12 && hours < 17) {
    return "Good Afternoon!";
  } else if (hours >= 17 && hours < 21) {
    return "Good Evening!";
  } else {
    return "Good Night!";
  }
}

/**
 * Update the greeting in the UI
 */
export function updateGreeting() {
  const greeting = document.querySelector(".greeting h1");
  if (!greeting) return;

  greeting.textContent = getGreetingText();

  // Add Jarvis-style status message
  const statusElement = document.createElement("p");
  statusElement.className = "status-message";
  statusElement.textContent = getRandomGreeting();

  // Replace existing status or append new one
  const existingStatus = document.querySelector(".status-message");
  if (existingStatus) {
    existingStatus.replaceWith(statusElement);
  } else if (greeting.nextElementSibling !== statusElement) {
    greeting.insertAdjacentElement("afterend", statusElement);
  }
}

/**
 * Initialize the greeting system with automatic updates
 */
export function initGreeting() {
  updateGreeting();
  setInterval(updateGreeting, 30000); // Update every 30 seconds
}
