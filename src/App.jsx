import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import LandingPage from './components/home/LandingPage';
import PreviewArea from './components/layout/PreviewArea';

import imageSizeIcon from './assets/image_size.webp';
import borderRadiusIcon from './assets/border_radius.webp';
import shadowIcon from './assets/shadow.webp';

const bgModules = import.meta.glob('./assets/backgrounds/*.webp', { eager: true });
const thumbModules = import.meta.glob('./assets/thumbnails/*.webp', { eager: true });

const RangeSlider = ({ label, icon, value, min, max, onChange, unit = '' }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-6"> 
      <div className="flex justify-between items-center mb-[6px]">
        <div className="flex items-center gap-1.5 text-white/70">
          <div className="">{icon}</div>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: '16px' }}>{label}</span>
        </div>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }} className="text-white/60 text-[11px]">{value}{unit}</span>
      </div>
      <div className="relative w-full h-6 flex items-center cursor-pointer group">
        <div className="absolute w-full h-[2px] bg-white/10 rounded-full"></div>
        <div className="absolute h-[2px] bg-[#FFAA01] rounded-full" style={{ width: `${percentage}%` }}></div>
        <div className="absolute h-3.5 w-3.5 bg-[#FFAA01] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-transform group-hover:scale-110" style={{ left: `calc(${percentage}% - 7px)` }}></div>
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 margin-0" />
      </div>
    </div>
  );
};

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const captureRef = useRef(null);
  const backgrounds = Object.keys(bgModules)
    .sort()
    .map((bgPath) => {
      const filename = bgPath.split('/').pop();
      const thumbPath = `./assets/thumbnails/${filename}`;
      return {
        full: `url(${bgModules[bgPath].default})`,
        thumb: thumbModules[thumbPath]?.default,
      };
    })
    .filter(item => item.thumb);

  const [settings, setSettings] = useState({
    padding: 85,
    borderRadius: 20,
    shadow: 60,
    background: backgrounds[0].full,
    ratio: 'fit'
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedImage(file);
  };

  // --- EXPORT PIXEL PERFECT (Ta version qui marche) ---
  const handleExport = async () => {
    let element = captureRef.current;
    if (!element) {
        element = document.getElementById('export-frame');
    }

    if (!element) {
        alert("Erreur critique : Impossible de trouver le cadre à exporter.");
        return;
    }

    try {
        const exactWidth = element.clientWidth;
        const exactHeight = element.clientHeight;

        const dataUrl = await toPng(element, {
            cacheBust: false,
            skipFonts: true,
            pixelRatio: 4, 
            backgroundColor: null,
            width: exactWidth,
            height: exactHeight,
            style: { 
                borderRadius: '0px', 
                margin: '0', 
                padding: '0',
                transform: 'none', 
                width: '100%',
                height: '100%',
                minWidth: '100%', 
                minHeight: '100%',
                maxWidth: 'none',
                maxHeight: 'none',
            }
        });
        
        const link = document.createElement('a');
        link.download = 'quickshot.png';
        link.href = dataUrl;
        link.click();

    } catch (error) {
        console.error("Export failed:", error);
        alert("Erreur lors de l'export : " + (error.message || "Erreur inconnue"));
    }
  };

  if (!selectedImage) {
    return <LandingPage onImageUpload={handleImageUpload} />;
  }

  return (
    // LAYOUT RESPONSIVE & STICKY LOGIC
    // - min-h-screen : Permet le scroll sur mobile
    // - md:overflow-hidden : Bloque le scroll général sur desktop (app feel)
    <div className="min-h-screen md:h-screen w-full bg-[#000000] flex flex-col md:flex-row font-sans text-white md:overflow-hidden">
      
      {/* PREVIEW AREA (STICKY)
          - sticky top-0 z-0 : Colle en haut, en arrière-plan
          - h-[45vh] : Prend un peu moins de la moitié sur mobile pour inciter au scroll
          - md:relative md:h-full : Redevient normal sur desktop
      */}
      <div className="sticky top-0 z-0 w-full h-[45vh] md:relative md:h-full md:flex-1 bg-[#141414]" style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}>
         <PreviewArea settings={settings} image={selectedImage} onUpdateSettings={setSettings} captureRef={captureRef} />
      </div>

      {/* SIDEBAR (SCROLL OVER)
          - relative z-10 : Passe PAR-DESSUS la preview sticky
          - bg-[#000000] : Opaque pour cacher l'image en dessous
          - min-h-[55vh] : Taille min pour scroller
      */}
      <aside className="relative z-10 w-full md:w-[340px] bg-[#000000] border-t md:border-t-0 md:border-l border-white/20 flex flex-col shrink-0 min-h-[55vh] md:h-full">
          
          <div className="px-6 pt-8 pb-6 flex items-start justify-between">
              <div className="flex flex-col gap-[2px]">
                  <h2 style={{ fontFamily: '"Neue Regrade", sans-serif', fontWeight: 600, fontSize: '18px', color: '#FFFFFF' }}>General settings</h2>
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>Customize your shot</p>
              </div>
              <button onClick={() => setSelectedImage(null)} className="text-white/40 hover:text-white transition-colors p-2 -mr-2">
                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
          </div>

          <div className="flex-1 px-6 py-2 md:overflow-y-auto">
              <div>
                  <RangeSlider label="Image Size" value={settings.padding} min={40} max={100} unit="%" onChange={(val) => setSettings({...settings, padding: val})} icon={<img src={imageSizeIcon} alt="Size" className="w-[18px] h-[18px] object-contain opacity-70" />} />
                  <RangeSlider label="Border radius" value={settings.borderRadius} min={0} max={50} unit="px" onChange={(val) => setSettings({...settings, borderRadius: val})} icon={<img src={borderRadiusIcon} alt="Radius" className="w-[18px] h-[18px] object-contain opacity-70" />} />
                  <RangeSlider label="Shadow" value={settings.shadow} min={0} max={100} unit="%" onChange={(val) => setSettings({...settings, shadow: val})} icon={<img src={shadowIcon} alt="Shadow" className="w-[18px] h-[18px] object-contain opacity-70" />} />
              </div>
              
              <div className="mt-[40px]">
                <div className="mb-4 flex flex-col gap-[2px]">
                   <h3 style={{ fontFamily: '"Neue Regrade", sans-serif', fontWeight: 600, fontSize: '18px', color: '#FFFFFF' }}>Background style</h3>
                   <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>Choose the style</p>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {backgrounds.map((item, index) => {
                    const isSelected = settings.background === item.full;
                    return (
                      <button key={index} onClick={() => setSettings({...settings, background: item.full})} className="relative w-full aspect-square rounded-lg overflow-hidden group">
                        <img src={item.thumb} alt={`bg-${index}`} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 rounded-lg border-[2px] transition-all pointer-events-none ${isSelected ? 'border-[#FFAA01]' : 'border-transparent group-hover:border-white/30'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
          </div>
          
          <div className="p-6 bg-[#000000]"> 
            <button onClick={handleExport} className="w-full bg-[#FFAA01] hover:bg-[#ffb92e] text-black h-[48px] rounded-[9px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/20" style={{ fontFamily: '"Neue Regrade", sans-serif', fontWeight: 600, fontSize: '16px' }}>
              <span>Export design</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
          </div>
      </aside>
    </div>
  );
}

export default App;