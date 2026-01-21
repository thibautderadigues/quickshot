import React, { useState } from 'react';

const PreviewArea = ({ settings, image, onUpdateSettings, captureRef }) => {
  const [showRatioMenu, setShowRatioMenu] = useState(false);

  const ratios = [
    { label: 'Auto (Fit)', value: 'fit' },
    { label: '16:9 (Landscape)', value: '16/9' },
    { label: '4:3 (Standard)', value: '4/3' },
    { label: '1:1 (Square)', value: '1/1' },
    { label: '4:5 (Insta Portrait)', value: '4/5' },
    { label: '9:16 (Story)', value: '9/16' },
  ];

  const handleRatioChange = (value) => {
    onUpdateSettings({ ...settings, ratio: value });
    setShowRatioMenu(false);
  };

  const currentLabel = ratios.find(r => r.value === settings.ratio)?.label || 'Auto';
  const r = settings.ratio;

  // DÉTECTION
  const isTall = ['9/16', '4/5'].includes(r);
  const isWide = ['16/9', '4/3'].includes(r);
  const isSquare = r === '1/1';
  const isFit = r === 'fit';

  return (
    <div className="flex-1 bg-[#09090b] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Bouton Ratio */}
      <div className="absolute top-8 right-8 z-30">
        <button 
          onClick={() => setShowRatioMenu(!showRatioMenu)}
          className="flex items-center gap-2 bg-[#1f1f22] border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-[#2a2a2e] transition w-48 justify-between"
        >
          <span>{currentLabel}</span>
          <svg className={`w-4 h-4 transition-transform ${showRatioMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {showRatioMenu && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#1f1f22] border border-white/10 rounded-lg shadow-xl overflow-hidden flex flex-col z-40">
            {ratios.map((ratioItem) => (
              <button
                key={ratioItem.value}
                onClick={() => handleRatioChange(ratioItem.value)}
                className={`text-left px-4 py-3 text-sm hover:bg-[#2a2a2e] transition ${settings.ratio === ratioItem.value ? 'text-amber-500 font-medium' : 'text-gray-400'}`}
              >
                {ratioItem.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- LE CADRE (FRAME) --- */}
      <div 
        ref={captureRef}
        className="preview-container relative flex items-center justify-center"
        style={{
          boxSizing: 'border-box',
          background: settings.background,
          aspectRatio: isFit ? 'auto' : r,
          
          // --- DIMENSIONS AGRANDIES ---
          
          // TALL (Story/Portrait) : On pousse à 82% de la hauteur de l'écran
          ...(isTall && { height: '82vh', width: 'auto' }),
          
          // WIDE (Landscape) : On pousse à 60% de la largeur (c'est large !)
          ...(isWide && { width: '60vw', height: 'auto' }),
          
          // SQUARE / FIT : On monte à 75% de la hauteur
          ...((isSquare || isFit) && { height: '75vh', width: 'auto' }),

          // La limite absolue reste pour éviter le scroll, 
          // mais on la monte un tout petit peu
          maxWidth: '100%',
          maxHeight: '90vh',
          
          overflow: 'hidden', 
          borderRadius: '4px',
        }}
      >
        {image ? (
          <img 
            src={image} 
            alt="Preview" 
            className="block"
            style={{
              // 1. FIT PARFAIT
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain', 

              // 2. SCALE INSTANTANÉ
              transform: `scale(${settings.padding / 100})`,
              
              // Styles esthétiques
              borderRadius: `${settings.borderRadius}px`,
              filter: `drop-shadow(0px 20px 40px rgba(0, 0, 0, ${settings.shadow / 100}))`,
            }}
          />
        ) : (
          <div className="bg-black/40 border-2 border-dashed border-white/10 rounded-xl w-[300px] h-[300px] flex flex-col items-center justify-center text-gray-500 m-8">
             <div className="bg-[#1f1f22] p-4 rounded-full mb-4">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </div>
            <p className="font-medium">Upload image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewArea;