import React, { useState, useRef } from 'react';
import LandingPage from './components/home/LandingPage';
import PreviewArea from './components/layout/PreviewArea';

// --- IMPORTS DES ICONES ---
import imageSizeIcon from './assets/image_size.png';
import borderRadiusIcon from './assets/border_radius.png';
import shadowIcon from './assets/shadow.png';


// --- COMPOSANT SLIDER ---
const RangeSlider = ({ label, icon, value, min, max, onChange, unit = '' }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6"> 
      {/* HEADER : LABEL + VALEUR */}
      {/* MODIF ICI : mb passé de 9px à 6px (réduit de 3px) */}
      <div className="flex justify-between items-center mb-[6px]">
        
        {/* Label + Icone */}
        {/* MODIF ICI : gap passé de 3 à 1.5 (réduit de moitié) */}
        <div className="flex items-center gap-1.5 text-white/70">
          <div className="">{icon}</div>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: '16px' }}>
            {label}
          </span>
        </div>
        
        {/* Valeur */}
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }} className="text-white/60 text-[11px]">
          {value}{unit}
        </span>
      </div>

      {/* ZONE DU SLIDER */}
      <div className="relative w-full h-6 flex items-center cursor-pointer group">
        <div className="absolute w-full h-[2px] bg-white/10 rounded-full"></div>
        <div 
          className="absolute h-[2px] bg-[#FFAA01] rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
        <div 
          className="absolute h-3.5 w-3.5 bg-[#FFAA01] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-transform group-hover:scale-110"
          style={{ left: `calc(${percentage}% - 7px)` }} 
        ></div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 margin-0"
        />
      </div>
    </div>
  );
};

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const captureRef = useRef(null);

  const [settings, setSettings] = useState({
    padding: 85,
    borderRadius: 20,
    shadow: 60,
    background: 'linear-gradient(to right, #ffafbd, #ffc3a0)',
    ratio: 'fit'
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleExport = async () => {
    if (!captureRef.current) return;
    try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(captureRef.current, {
            scale: 3,
            backgroundColor: null,
            useCORS: true,
        });
        const link = document.createElement('a');
        link.download = 'quickshot.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error("Export failed:", error);
    }
  };

  const backgrounds = [
    'linear-gradient(to right, #ffafbd, #ffc3a0)',
    'linear-gradient(to right, #2193b0, #6dd5ed)',
    'linear-gradient(to right, #cc2b5e, #753a88)',
    '#1f1f22', 
    '#ffffff',
    'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
  ];

  if (!selectedImage) {
    return <LandingPage onImageUpload={handleImageUpload} />;
  }

  return (
    <div className="h-screen w-full bg-[#000000] flex font-sans text-white overflow-hidden">
      
      <PreviewArea 
        settings={settings}
        image={selectedImage}
        onUpdateSettings={setSettings}
        captureRef={captureRef}
      />

      <aside className="w-[340px] bg-[#000000] border-l border-white/20 flex flex-col z-20 shrink-0 h-full">
          
          {/* HEADER */}
          <div className="px-6 pt-8 pb-6 flex items-start justify-between">
              <div className="flex flex-col gap-[2px]">
                  <h2 style={{ fontFamily: '"Neue Regrade", sans-serif', fontWeight: 600, fontSize: '18px', color: '#FFFFFF' }}>
                    General settings
                  </h2>
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
                    Customize your shot
                  </p>
              </div>
              
              <button 
                onClick={() => setSelectedImage(null)} 
                className="text-white/40 hover:text-white transition-colors p-2 -mr-2"
                title="Close"
              >
                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-2">
              <div>
                  <RangeSlider 
                    label="Image Size"
                    value={settings.padding} 
                    min={40} max={100} unit="%"
                    onChange={(val) => setSettings({...settings, padding: val})}
                    icon={<img src={imageSizeIcon} alt="Size" className="w-[18px] h-[18px] object-contain opacity-70" />}
                  />

                  {/* MODIF ICI : Label changé en Border radius */}
                  <RangeSlider 
                    label="Border radius"
                    value={settings.borderRadius} 
                    min={0} max={50} unit="px"
                    onChange={(val) => setSettings({...settings, borderRadius: val})}
                    icon={<img src={borderRadiusIcon} alt="Radius" className="w-[18px] h-[18px] object-contain opacity-70" />}
                  />

                  <RangeSlider 
                    label="Shadow"
                    value={settings.shadow} 
                    min={0} max={100} unit="%"
                    onChange={(val) => setSettings({...settings, shadow: val})}
                    icon={<img src={shadowIcon} alt="Shadow" className="w-[18px] h-[18px] object-contain opacity-70" />}
                  />
              </div>

              <div className="mt-[40px]">
                <div className="mb-4 flex flex-col gap-[2px]">
                   <h3 style={{ fontFamily: '"Neue Regrade", sans-serif', fontWeight: 600, fontSize: '18px', color: '#FFFFFF' }}>
                     Background style
                   </h3>
                   <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
                     Choose the style of the background
                   </p>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {backgrounds.map((bg, index) => (
                    <button 
                      key={index}
                      onClick={() => setSettings({...settings, background: bg})}
                      className={`w-full aspect-square rounded-lg border transition-all ${settings.background === bg ? 'border-[#FFAA01] ring-1 ring-[#FFAA01]' : 'border-white/10 hover:border-white/30'}`}
                      style={{ background: bg }}
                    />
                  ))}
                </div>
              </div>
          </div>

          <div className="p-6 bg-[#000000]"> 
            <button 
                onClick={handleExport}
                className="w-full bg-[#FFAA01] hover:bg-[#ffb92e] text-black h-[48px] rounded-[9px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
                style={{ fontFamily: '"Neue Regrade", sans-serif', fontWeight: 600, fontSize: '16px' }}
            >
              <span>Export design</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
          </div>

      </aside>
    </div>
  );
}

export default App;