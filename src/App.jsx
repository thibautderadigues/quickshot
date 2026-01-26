import React, { useState, useRef } from 'react';
import LandingPage from './components/home/LandingPage';
import PreviewArea from './components/layout/PreviewArea';

// --- IMPORTS DES ICONES UI ---
import imageSizeIcon from './assets/image_size.png';
import borderRadiusIcon from './assets/border_radius.png';
import shadowIcon from './assets/shadow.png';
import darkIcon from './assets/dark_icon.png';
import lightIcon from './assets/light_icon.png';

// --- IMPORTS DES BACKGROUNDS (1 à 9) ---
// DARK MODE
import bg1Dark from './assets/backgrounds/Background_1_Dark.png';
import bg2Dark from './assets/backgrounds/Background_2_Dark.png';
import bg3Dark from './assets/backgrounds/Background_3_Dark.png';
import bg4Dark from './assets/backgrounds/Background_4_Dark.png';
import bg5Dark from './assets/backgrounds/Background_5_Dark.png';
import bg6Dark from './assets/backgrounds/Background_6_Dark.png';
import bg7Dark from './assets/backgrounds/Background_7_Dark.png';
import bg8Dark from './assets/backgrounds/Background_8_Dark.png';
import bg9Dark from './assets/backgrounds/Background_9_Dark.png';

// LIGHT MODE
import bg1Light from './assets/backgrounds/Background_1_Light.png';
import bg2Light from './assets/backgrounds/Background_2_Light.png';
import bg3Light from './assets/backgrounds/Background_3_Light.png';
import bg4Light from './assets/backgrounds/Background_4_Light.png';
import bg5Light from './assets/backgrounds/Background_5_Light.png';
import bg6Light from './assets/backgrounds/Background_6_Light.png';
import bg7Light from './assets/backgrounds/Background_7_Light.png';
import bg8Light from './assets/backgrounds/Background_8_Light.png';
import bg9Light from './assets/backgrounds/Background_9_Light.png';

// --- COMPOSANT SLIDER (Inchangé) ---
const RangeSlider = ({ label, icon, value, min, max, onChange, unit = '' }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6"> 
      <div className="flex justify-between items-center mb-[6px]">
        <div className="flex items-center gap-1.5 text-white/70">
          <div className="">{icon}</div>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: '16px' }}>
            {label}
          </span>
        </div>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }} className="text-white/60 text-[11px]">
          {value}{unit}
        </span>
      </div>
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
  
  const [isDarkMode, setIsDarkMode] = useState(true);

  // LISTES DES BACKGROUNDS (9 items)
  const darkBackgrounds = [
    `url(${bg1Dark})`,
    `url(${bg2Dark})`,
    `url(${bg3Dark})`,
    `url(${bg4Dark})`,
    `url(${bg5Dark})`,
    `url(${bg6Dark})`,
    `url(${bg7Dark})`,
    `url(${bg8Dark})`,
    `url(${bg9Dark})`,
  ];

  const lightBackgrounds = [
    `url(${bg1Light})`,
    `url(${bg2Light})`,
    `url(${bg3Light})`,
    `url(${bg4Light})`,
    `url(${bg5Light})`,
    `url(${bg6Light})`,
    `url(${bg7Light})`,
    `url(${bg8Light})`,
    `url(${bg9Light})`,
  ];

  const [settings, setSettings] = useState({
    padding: 85,
    borderRadius: 20,
    shadow: 60,
    background: darkBackgrounds[0], 
    ratio: 'fit'
  });

  // FONCTION DE BASCULE THEME
  const setMode = (mode) => {
    if ((mode === 'dark' && isDarkMode) || (mode === 'light' && !isDarkMode)) return;

    const newIsDark = mode === 'dark';
    setIsDarkMode(newIsDark);
    
    const currentList = isDarkMode ? darkBackgrounds : lightBackgrounds;
    const targetList = newIsDark ? darkBackgrounds : lightBackgrounds;
    const currentIndex = currentList.indexOf(settings.background);

    if (currentIndex !== -1) {
      setSettings({ ...settings, background: targetList[currentIndex] });
    } else {
      setSettings({ ...settings, background: targetList[0] });
    }
  };

  const activeBackgrounds = isDarkMode ? darkBackgrounds : lightBackgrounds;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedImage(file);
  };

  // --- EXPORT FUNCTION ---
  const handleExport = async () => {
    if (!captureRef.current) return;

    const element = captureRef.current;
    const originalRadius = element.style.borderRadius;

    // Radius à 0 pour l'export (coins carrés)
    element.style.borderRadius = '0px';

    try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(element, {
            scale: 3,
            backgroundColor: null,
            useCORS: true,
            allowTaint: true, 
        });
        const link = document.createElement('a');
        link.download = 'quickshot.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error("Export failed:", error);
    } finally {
        element.style.borderRadius = originalRadius;
    }
  };

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
                     Choose the style
                   </p>
                </div>

                {/* --- TOGGLE --- */}
                <div className="mb-4 flex bg-white/5 p-1 rounded-lg border border-white/10">
                    <button 
                        onClick={() => setMode('light')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md transition-all ${
                            !isDarkMode 
                            ? 'bg-white/10 text-white shadow-sm' 
                            : 'text-white/40 hover:text-white/60'
                        }`}
                    >
                        <img src={lightIcon} alt="Light" className={`w-4 h-4 object-contain ${!isDarkMode ? 'opacity-100' : 'opacity-50'}`} />
                        <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '13px' }}>
                            Light
                        </span>
                    </button>

                    <button 
                        onClick={() => setMode('dark')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md transition-all ${
                            isDarkMode 
                            ? 'bg-white/10 text-white shadow-sm' 
                            : 'text-white/40 hover:text-white/60'
                        }`}
                    >
                        <img src={darkIcon} alt="Dark" className={`w-4 h-4 object-contain ${isDarkMode ? 'opacity-100' : 'opacity-50'}`} />
                        <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '13px' }}>
                            Dark
                        </span>
                    </button>
                </div>
                
                {/* --- GRILLE 5 colonnes --- */}
                <div className="grid grid-cols-5 gap-2">
                  {activeBackgrounds.map((bg, index) => {
                    const imgUrl = bg.match(/url\(([^)]+)\)/)?.[1]?.replace(/['"]/g, '');
                    const isSelected = settings.background === bg;

                    return (
                      <button 
                        key={index}
                        onClick={() => setSettings({...settings, background: bg})}
                        className="relative w-full aspect-square rounded-lg overflow-hidden group"
                      >
                        {imgUrl ? (
                           <img 
                             src={imgUrl} 
                             alt="bg" 
                             className="w-full h-full object-cover"
                           />
                        ) : (
                           <div className="w-full h-full" style={{ background: bg }}></div>
                        )}

                        <div 
                          className={`absolute inset-0 rounded-lg border-[2px] transition-all pointer-events-none ${
                            isSelected 
                              ? 'border-[#FFAA01]' 
                              : 'border-transparent group-hover:border-white/30'
                          }`}
                        />
                      </button>
                    );
                  })}
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