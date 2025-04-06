/**
 * Convert an image file to base64 string
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} Base64 encoded image
 */
export function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function enhanceImages() {
  const chatImages = document.querySelectorAll(".chat-image");

  chatImages.forEach((img) => {
    if (img.dataset.enhanced) return;

    const container = document.createElement("div");
    container.className = "image-container";
    img.parentNode.insertBefore(container, img);
    container.appendChild(img);

    // Add click to view full size functionality
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "image-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.zIndex = "9999";
      overlay.style.cursor = "zoom-out";
      overlay.style.backdropFilter = "blur(10px)";

      const fullImg = document.createElement("img");
      fullImg.src = img.src;
      fullImg.style.maxWidth = "90%";
      fullImg.style.maxHeight = "90%";
      fullImg.style.borderRadius = "5px";
      fullImg.style.boxShadow = "0 0 30px rgba(10, 132, 255, 0.3)";
      fullImg.style.border = "1px solid rgba(255, 255, 255, 0.1)";
      fullImg.style.animation =
        "imageZoomIn 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)";

      overlay.appendChild(fullImg);
      document.body.appendChild(overlay);

      overlay.addEventListener("click", () => {
        overlay.style.animation = "fadeOut 0.2s forwards";
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 200);
      });
    });
    img.dataset.enhanced = "true";
  });
}
