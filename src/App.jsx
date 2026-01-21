import React, { useState, useRef } from 'react';
import PreviewArea from './components/layout/PreviewArea';
import RangeSlider from './components/ui/RangeSlider';

function App() {
  const [image, setImage] = useState(null);
  const captureRef = useRef(null); 
  
  const [settings, setSettings] = useState({
    padding: 85, // Correspond maintenant à la TAILLE (Scale) en %
    borderRadius: 20,
    shadow: 60,
    background: 'linear-gradient(to right, #ffafbd, #ffc3a0)',
    ratio: 'fit'
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleExport = async () => {
    if (!captureRef.current || !image) return;
    try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(captureRef.current, {
            scale: 3, // Export haute qualité
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

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Zone de prévisualisation */}
      <PreviewArea 
        settings={settings} 
        image={image} 
        onUpdateSettings={setSettings}
        captureRef={captureRef}
      />

      {/* Barre latérale */}
      <aside className="w-[340px] bg-black border-l border-white/10 p-6 flex flex-col h-full z-20 overflow-y-auto">
        
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white">General Settings</h2>
          <p className="text-xs text-gray-500 mt-1">Set main settings of your screenshot</p>
        </div>

        <div className="space-y-8 flex-1">
          
          <div className="relative">
             <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10"/>
             <button className="w-full py-2 border border-dashed border-gray-600 text-gray-400 rounded hover:border-amber-500 hover:text-amber-500 transition text-sm">
                Change Image Source
             </button>
          </div>

          {/* SLIDER IMAGE SIZE (anciennement Padding) */}
          <RangeSlider 
            label={<> <span className="w-4 h-4 border border-gray-500 rounded sm:inline-block hidden mr-2"></span> Image Size </>}
            value={settings.padding} 
            min={40} // Minimum 40% pour ne pas que l'image disparaisse
            max={100} // Maximum 100% (remplit le cadre)
            unit="%"
            onChange={(e) => setSettings({...settings, padding: Number(e.target.value)})}
          />

          <RangeSlider 
            label={<> <span className="w-4 h-4 border border-gray-500 rounded-sm sm:inline-block hidden mr-2"></span> Radius </>}
            value={settings.borderRadius} min={0} max={50} unit="px"
            onChange={(e) => setSettings({...settings, borderRadius: Number(e.target.value)})}
          />

          <RangeSlider 
            label={<> <span className="w-4 h-4 border border-gray-500 border-dotted sm:inline-block hidden mr-2"></span> Shadow </>}
            value={settings.shadow} min={0} max={100} unit="%"
            onChange={(e) => setSettings({...settings, shadow: Number(e.target.value)})}
          />

          <div className="pt-4 border-t border-white/5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-300">Background style</h3>
              <p className="text-xs text-gray-600">Choose the style of the background</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {backgrounds.map((bg, index) => (
                <button 
                  key={index}
                  onClick={() => setSettings({...settings, background: bg})}
                  className={`w-full aspect-square rounded-lg border transition-all ${settings.background === bg ? 'border-amber-500 ring-1 ring-amber-500' : 'border-white/10 hover:border-white/30'}`}
                  style={{ background: bg }}
                />
              ))}
            </div>
          </div>

        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button 
            onClick={handleExport}
            disabled={!image}
            className={`w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${!image ? 'opacity-50 cursor-not-allowed' : ''}`}
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