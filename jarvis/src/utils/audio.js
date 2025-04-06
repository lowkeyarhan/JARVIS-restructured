/**
 * Plays a sound effect when a message is sent
 */
export function playMessageSentSound() {
  try {
    const audio = new Audio("/public/sounds/message-sent.mp3");
    audio.volume = 0.5;
    audio.currentTime = 0.03; // Start playing from 0.03 seconds
    audio.play().catch((error) => {
      console.log("Error playing sent sound:", error);
    });
  } catch (error) {
    console.log("Error creating audio:", error);
  }
}

export function playMessageReceivedSound() {
  try {
    const audio = new Audio("/public/sounds/message-recieved.mp3");
    audio.volume = 1;
    audio.currentTime = 0.03; // Start playing from 0.03 seconds
    audio.play().catch((error) => {
      console.log("Error playing received sound:", error);
    });
  } catch (error) {
    console.log("Error creating audio:", error);
  }
}

export function playCounterUpdateSound() {
  try {
    const audio = new Audio("/public/sounds/moan.mp3");
    audio.volume = 0.5;
    audio.currentTime = 0.13; // Start playing from 0.13 seconds
    audio.play().catch((error) => {
      console.log("Error playing counter update sound:", error);
    });
  } catch (error) {
    console.log("Error creating audio:", error);
  }
}
