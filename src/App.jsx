import { useRef, useState } from 'react';

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
    const ctx = canvas.getContext('2d');
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
      setProcessedSrc(canvas.toDataURL('image/png'));
    };

    image.src = imageSrc;
  };

  // Download the processed image
  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = 'processed-image.png';
    link.href = processedSrc;
    link.click();
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        display: "flex",
        flexDirection: "column",
        padding: '20px',
        alignItems: "center",
        justifyContent: "start",
        // backgroundColor: '#f9f9f9',
        minHeight: '100vw',
        width: '100vw',
        overflowY: "hidden"

      }}
    >
      <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '20px' }}>
        Negative to Normal Photo Converter
      </h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{
          marginBottom: '20px',
          padding: '10px',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'start',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          {imageSrc && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <h3 style={{ fontSize: '1.2rem', color: '#555', marginBottom: '10px' }}>
                Original Image
              </h3>
              <img
                src={imageSrc}
                alt="Uploaded"
                style={{
                  objectFit: "contain",
                  maxWidth: '100%',
                  maxHeight: '300px',
                  marginBottom: '15px',
                  borderRadius: '10px',
                }}
              />
              <button
                onClick={processImage}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  fontSize: '1rem',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
              >
                Convert to Normal
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          {processedSrc && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <h3 style={{ fontSize: '1.2rem', color: '#555', marginBottom: '10px' }}>
                Processed Image
              </h3>
              <img
                src={processedSrc}
                alt="Processed"
                style={{
                  objectFit: "contain",
                  maxWidth: '100%',
                  maxHeight: '300px',
                  marginBottom: '15px',
                  borderRadius: '10px',
                }}
              />
              <button
                onClick={downloadImage}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  fontSize: '1rem',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
              >
                Download
              </button>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
      </div>
    </div>
  );
}

export default App;
