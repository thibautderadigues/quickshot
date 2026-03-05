import React, { useState, useEffect } from 'react';
import logo from '../../assets/Logo.webp'; 

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
};

const PreviewArea = ({ settings, image, onUpdateSettings, captureRef }) => {
  const [showRatioMenu, setShowRatioMenu] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [naturalSize, setNaturalSize] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (image) {
      const url = typeof image === 'string' ? image : URL.createObjectURL(image);
      setPreviewUrl(url);
      setNaturalSize(null);

      const imgEl = new window.Image();
      imgEl.onload = () => {
        setNaturalSize({ width: imgEl.naturalWidth, height: imgEl.naturalHeight });
      };
      imgEl.src = url;

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

  const isImageWide = isFit && naturalSize && (naturalSize.width / naturalSize.height) >= 1;
  const isImageTall = isFit && naturalSize && (naturalSize.width / naturalSize.height) < 1;

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
    // Padding ajusté pour mobile (p-4) et desktop (md:p-8)
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* LOGO: Caché sur mobile (hidden), affiché sur desktop (md:block) */}
      <div className="hidden md:block absolute top-4 left-4 md:top-8 md:left-8 z-30 opacity-80">
        <img src={logo} alt="Logo" className="h-5 md:h-6 w-auto" />
      </div>
      
      {/* RATIO MENU */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-30">
        <button 
          onClick={() => setShowRatioMenu(!showRatioMenu)}
          className="flex items-center gap-2 px-5 py-3.5 md:px-4 md:py-2 rounded-xl md:rounded-lg transition md:w-48 justify-between backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',  
          }}
        >
          <div className="text-lg md:text-[13px]" style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, color: '#FFFFFF' }}>
             <span>{currentRatio.name} </span>
             <span style={{ opacity: 0.4 }} className="md:inline">{currentRatio.sub}</span>
          </div>
          <svg className={`w-5 h-5 md:w-4 md:h-4 text-white transition-transform ${showRatioMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {showRatioMenu && (
          <div className="absolute top-full right-0 mt-2 w-56 md:w-48 bg-[#000000] border border-white/10 rounded-xl md:rounded-lg shadow-2xl overflow-y-auto max-h-[calc(45vh-90px)] md:max-h-none md:overflow-hidden flex flex-col z-40">
            {ratios.map((ratioItem) => (
              <button
                key={ratioItem.value}
                onClick={() => handleRatioChange(ratioItem.value)}
                className={`text-left px-5 md:px-4 py-4 md:py-3 text-lg md:text-sm hover:bg-white/5 transition flex items-center gap-2 md:gap-1 ${settings.ratio === ratioItem.value ? 'text-[#FFAA01]' : 'text-gray-400'}`}
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                <span className={settings.ratio === ratioItem.value ? 'font-medium' : ''}>{ratioItem.name}</span>
                <span className="opacity-50 text-sm md:text-xs">{ratioItem.sub}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- FRAME PRINCIPALE --- */}
      <div 
        id="export-frame"
        ref={captureRef}
        className="relative flex items-center justify-center"
        style={{
          boxSizing: 'border-box',
          ...backgroundStyle,
          borderRadius: '3px', 
          aspectRatio: isFit
            ? (naturalSize ? `${naturalSize.width} / ${naturalSize.height}` : '4 / 3')
            : r,
          height: isTall ? '75vh'
            : isSquare ? (isMobile ? undefined : '70vh')
            : (isFit && !isImageWide) ? '70vh'
            : undefined,
          width: (isWide || isImageWide || (isSquare && isMobile)) ? (isMobile ? '80vw' : '50vw') : undefined,
          maxWidth: '100%',
          maxHeight: '75vh',
          overflow: 'hidden', 
        }}
      >
        {previewUrl ? (
          <div 
             style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${settings.padding / 100})`,
                willChange: 'transform',
             }}
          >
              <img 
                src={previewUrl} 
                alt="Preview" 
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  borderRadius: `${settings.borderRadius}px`,
                  boxShadow: `0px 20px 40px rgba(0, 0, 0, ${settings.shadow / 100})`,
                }}
              />
          </div>
        ) : (
          <div className="text-white/20">No image loaded</div>
        )}
      </div>
    </div>
  );
};

export default PreviewArea;