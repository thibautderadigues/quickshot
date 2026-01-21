import React, { useState, useRef, useEffect } from 'react';

const RangeSlider = ({ label, value, min, max, onChange, unit = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [bubbleLeft, setBubbleLeft] = useState(0);
  const rangeRef = useRef(null);

  // Calcul de la position de la bulle en pourcentage
  useEffect(() => {
    const percentage = ((value - min) / (max - min)) * 100;
    setBubbleLeft(percentage);
  }, [value, min, max]);

  return (
    <div className="space-y-3 relative">
      {/* Label et Valeur statique (optionnel, on peut le garder ou l'enlever) */}
      <div className="flex justify-between items-center text-sm">
        <label className="text-gray-300 flex items-center gap-2">
          {label}
        </label>
        {/* On peut cacher ça si on veut que la bulle suffise, mais c'est bien de le garder pour la ref */}
        <span className="text-gray-500 text-xs">{value}{unit}</span>
      </div>

      <div className="relative w-full h-6 flex items-center">
        {/* BULLE FLOTTANTE (Visible uniquement au drag) */}
        {isDragging && (
          <div 
            className="absolute -top-8 transform -translate-x-1/2 bg-[#1f1f22] text-white text-xs font-bold px-2 py-1 rounded shadow-lg border border-white/10 z-10 transition-opacity duration-200"
            style={{ left: `${bubbleLeft}%` }}
          >
            {value}{unit}
            {/* Petite flèche en bas de la bulle */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#1f1f22] rotate-45 border-b border-r border-white/10"></div>
          </div>
        )}

        {/* L'INPUT RANGE */}
        <input 
          ref={rangeRef}
          type="range" 
          min={min} 
          max={max} 
          value={value}
          onChange={onChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)} // Pour mobile
          onTouchEnd={() => setIsDragging(false)}
          className="w-full accent-amber-500 relative z-0"
        />
      </div>
    </div>
  );
};

export default RangeSlider;