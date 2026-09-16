import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, Move, MoveVertical } from 'lucide-react';

export default function CropModal({ item, onClose, onSave }) {
  const [cropY, setCropY] = useState(item.cropY ?? 50);
  const [cropX, setCropX] = useState(item.cropX ?? 50);
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef(null);
  const imgRef = useRef(null);
  const dragStartRef = useRef({ y: 0, x: 0, startCropY: 50, startCropX: 50 });
  const rafIdRef = useRef(null);

  // Handle Mouse / Touch Dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = {
      y: clientY,
      x: clientX,
      startCropY: cropY,
      startCropX: cropX
    };
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !viewportRef.current || !imgRef.current) return;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    const deltaY = clientY - dragStartRef.current.y;
    const deltaX = clientX - dragStartRef.current.x;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      const vpHeight = viewportRef.current?.offsetHeight || 300;
      const vpWidth = viewportRef.current?.offsetWidth || 533;
      const imgHeight = imgRef.current?.offsetHeight || vpHeight;
      const imgWidth = imgRef.current?.offsetWidth || vpWidth;

      const extraY = Math.max(1, imgHeight - vpHeight);
      const extraX = Math.max(1, imgWidth - vpWidth);

      // 1:1 natural pixel drag ratio
      const cropYDelta = -(deltaY / extraY) * 100;
      const cropXDelta = -(deltaX / extraX) * 100;

      const newCropY = Math.min(100, Math.max(0, dragStartRef.current.startCropY + cropYDelta));
      const newCropX = Math.min(100, Math.max(0, dragStartRef.current.startCropX + cropXDelta));

      setCropY(Math.round(newCropY * 10) / 10);
      setCropX(Math.round(newCropX * 10) / 10);
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: true });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleApply = () => {
    onSave(item.id, Math.round(cropY), Math.round(cropX));
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <MoveVertical size={20} color="var(--primary-glow)" />
            <span>Adjust 16:9 Picture Position</span>
          </div>
          <button className="btn-icon-close" onClick={onClose} title="Close modal">
            <X size={20} />
          </button>
        </div>

        <p className="modal-instruction">
          Click and <strong>drag the picture up or down</strong> to position the exact part of the image inside the 16:9 crop frame.
        </p>

        {/* 16:9 Viewport Box */}
        <div
          ref={viewportRef}
          className={`crop-viewport ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <img
            ref={imgRef}
            src={item.originalUrl}
            alt="Original Crop Target"
            className="crop-target-img"
            style={{
              top: `${cropY}%`,
              left: `${cropX}%`,
              transform: `translate(-${cropX}%, -${cropY}%)`
            }}
          />
          <div className="viewport-overlay-grid" />
          <div className="viewport-badge">16:9 Widescreen Frame (1200x675)</div>
          <div className="drag-hint">
            <Move size={16} /> Drag Image to Reposition
          </div>
        </div>

        {/* Preset Quick Buttons & Slider */}
        <div className="modal-controls">
          <div className="modal-presets">
            <span className="preset-lbl">Quick Presets:</span>
            <button className={`btn-pos ${Math.round(cropY) === 0 ? 'active' : ''}`} onClick={() => setCropY(0)}>
              Top (0%)
            </button>
            <button className={`btn-pos ${Math.round(cropY) === 50 ? 'active' : ''}`} onClick={() => setCropY(50)}>
              Center (50%)
            </button>
            <button className={`btn-pos ${Math.round(cropY) === 100 ? 'active' : ''}`} onClick={() => setCropY(100)}>
              Bottom (100%)
            </button>
          </div>

          <div className="modal-slider-row">
            <span className="slider-lbl">Vertical Alignment ({Math.round(cropY)}%):</span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(cropY)}
              onChange={(e) => setCropY(Number(e.target.value))}
              className="modal-range-slider"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleApply}>
            <Check size={18} /> Apply Position
          </button>
        </div>
      </div>
    </div>
  );
}
