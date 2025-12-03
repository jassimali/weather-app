import React, { useEffect, useRef, useState } from "react";

function ScratchCard({ message }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Re-draw scratch layer when message changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !message) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const width = 280;
    const height = 80;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    ctx.scale(dpr, dpr);

    // Draw the grey layer that will be scratched
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#b0b0b0";
    ctx.fillRect(0, 0, width, height);

    // Now set to erase on drawing
    ctx.globalCompositeOperation = "destination-out";
  }, [message]);

  const scratchAtEvent = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * (canvas.width / rect.width) / dpr;
    const y = (clientY - rect.top) * (canvas.height / rect.height) / dpr;

    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerDown = (e) => {
    setIsDrawing(true);
    scratchAtEvent(e);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    scratchAtEvent(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  if (!message) return null;

  return (
    <div className="scratch-container">
      <div className="scratch-message">{message}</div>
      <canvas
        ref={canvasRef}
        className="scratch-canvas"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={handlePointerDown}
        onTouchMove={(e) => {
          e.preventDefault();
          handlePointerMove(e);
        }}
        onTouchEnd={endDrawing}
      />
    </div>
  );
}

export default ScratchCard;
