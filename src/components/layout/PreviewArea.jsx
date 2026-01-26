import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';

const PreviewArea = ({ settings, image, onUpdateSettings, captureRef }) => {
  const [showRatioMenu, setShowRatioMenu] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (image) {
      const url = typeof image === 'string' ? image : URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => {
        if (typeof image !== 'string') URL.revokeObjectURL(url);
      };
    }
  }, [image]);

  const ratios = [
    { name: 'Auto', sub: '(Fit)', value: 'fit' },
    { name: 'Landscape', sub: '(16:9)', value: '16/9' },
    { name: 'Standard', sub: '(4:3)', value: '4/3' },
    { name: 'Square', sub: '(1:1)', value: '1/1' },
    { name: 'Portrait', sub: '(4:5)', value: '4/5' },
    { name: 'Story', sub: '(9:16)', value: '9/16' },
  ];

  const handleRatioChange = (value) => {
    onUpdateSettings({ ...settings, ratio: value });
    setShowRatioMenu(false);
  };

  const currentRatio = ratios.find(r => r.value === settings.ratio) || ratios[0];
  const r = settings.ratio;
  const isTall = ['9/16', '4/5'].includes(r);
  const isWide = ['16/9', '4/3'].includes(r);
  const isSquare = r === '1/1';
  const isFit = r === 'fit';

  // --- LOGIQUE BACKGROUND ---
  const isImageOrGradient = settings.background.includes('url') || settings.background.includes('gradient');

  const backgroundStyle = isImageOrGradient 
    ? { 
        backgroundImage: settings.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : { 
        background: settings.background 
      };

  return (
    <div className="flex-1 bg-[#141414] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* LOGO */}
      <div className="absolute top-8 left-8 z-30 opacity-80">
        <img src={logo} alt="Logo" className="h-6 w-auto" />
      </div>
      
      {/* RATIO MENU */}
      <div className="absolute top-8 right-8 z-30">
        <button 
          onClick={() => setShowRatioMenu(!showRatioMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition w-48 justify-between backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',  
          }}
        >
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '14px', color: '#FFFFFF' }}>
             <span>{currentRatio.name} </span>
             <span style={{ opacity: 0.4 }}>{currentRatio.sub}</span>
          </div>
          <svg className={`w-4 h-4 text-white transition-transform ${showRatioMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {showRatioMenu && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#000000] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col z-40">
            {ratios.map((ratioItem) => (
              <button
                key={ratioItem.value}
                onClick={() => handleRatioChange(ratioItem.value)}
                className={`text-left px-4 py-3 text-sm hover:bg-white/5 transition flex items-center gap-1 ${settings.ratio === ratioItem.value ? 'text-[#FFAA01]' : 'text-gray-400'}`}
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                <span className={settings.ratio === ratioItem.value ? 'font-medium' : ''}>{ratioItem.name}</span>
                <span className="opacity-50 text-xs">{ratioItem.sub}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- FRAME (CADRE) --- */}
      <div 
        ref={captureRef}
        className="relative flex items-center justify-center"
        style={{
          boxSizing: 'border-box',
          
          ...backgroundStyle,
          
          // MODIFICATION ICI : 12px au lieu de 16px
          borderRadius: '12px', 

          aspectRatio: isFit ? 'auto' : r,
          height: isTall ? '75vh' : (isSquare || isFit ? '70vh' : 'auto'),
          width: isWide ? '50vw' : 'auto',
          maxWidth: '90%',
          maxHeight: '75vh',
          overflow: 'hidden', 
        }}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="block"
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain', 
              transform: `scale(${settings.padding / 100})`,
              borderRadius: `${settings.borderRadius}px`,
              filter: `drop-shadow(0px 20px 40px rgba(0, 0, 0, ${settings.shadow / 100}))`,
            }}
          />
        ) : (
          <div className="text-white/20">No image loaded</div>
        )}
      </div>
    </div>
  );
};

export default PreviewArea;