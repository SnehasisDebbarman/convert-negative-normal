import React, { useRef, useState } from "react";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [processedSrc, setProcessedSrc] = useState(null);
  const canvasRef = useRef(null);

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Process the negative to normal conversion
  const processImage = () => {
    if (!imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert negative to normal by inverting the RGB values
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedSrc(canvas.toDataURL("image/png"));
    };

    image.src = imageSrc;
  };

  // Download the processed image
  const downloadImage = () => {
    const link = document.createElement("a");
    link.download = "processed-image.png";
    link.href = processedSrc;
    link.click();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Negative to Normal Photo Converter</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <br />

      {imageSrc && (
        <div>
          <h3>Original Image</h3>
          <img
            src={imageSrc}
            alt="Uploaded"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              marginBottom: "20px",
            }}
          />
        </div>
      )}

      {imageSrc && (
        <div>
          <button onClick={processImage} style={{ marginRight: "10px" }}>
            Convert to Normal
          </button>
        </div>
      )}

      {processedSrc && (
        <div>
          <h3>Processed Image</h3>
          <img
            src={processedSrc}
            alt="Processed"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          />
          <button onClick={downloadImage}>Download</button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default App;
