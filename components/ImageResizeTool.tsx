"use client";
import React, { useRef, useState } from "react";

const ImageResizeTool: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(300);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setResizedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleResize = () => {
    if (!originalImage) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        setResizedImage(canvas.toDataURL("image/png"));
      }
    };
    img.src = originalImage;
  };

  const handleDownload = () => {
    if (!resizedImage) return;
    const link = document.createElement("a");
    link.href = resizedImage;
    link.download = "resized-image.png";
    link.click();
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
      <h2>Image Resize Tool</h2>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ marginBottom: 16 }}
      />
      {originalImage && (
        <div style={{ marginBottom: 16 }}>
          <img src={originalImage} alt="Original" style={{ maxWidth: "100%", maxHeight: 200, display: "block", marginBottom: 8 }} />
          <div>
            <label>
              Width:{" "}
              <input
                type="number"
                value={width}
                min={1}
                max={2000}
                onChange={(e) => setWidth(Number(e.target.value))}
                style={{ width: 80, marginRight: 8 }}
              />
            </label>
            <label>
              Height:{" "}
              <input
                type="number"
                value={height}
                min={1}
                max={2000}
                onChange={(e) => setHeight(Number(e.target.value))}
                style={{ width: 80 }}
              />
            </label>
            <button onClick={handleResize} style={{ marginLeft: 16, padding: "4px 12px" }}>
              Resize
            </button>
          </div>
        </div>
      )}
      {resizedImage && (
        <div style={{ marginBottom: 16 }}>
          <h4>Resized Image Preview:</h4>
          <img src={resizedImage} alt="Resized" style={{ maxWidth: "100%", maxHeight: 200, display: "block", marginBottom: 8 }} />
          <button onClick={handleDownload} style={{ padding: "4px 12px" }}>
            Download Resized Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageResizeTool;
