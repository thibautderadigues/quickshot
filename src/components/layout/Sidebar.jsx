import { Layers, Maximize, Square } from 'lucide-react';
import Slider from '../ui/Slider';
import { backgrounds } from '../../data/backgrounds'; // <--- Import des couleurs

const Sidebar = ({ settings, updateSetting }) => {
  return (
    <aside className="w-[360px] h-full bg-[#050505] border-l border-gray-800 p-6 flex flex-col text-white overflow-y-auto z-20">
      
      <div className="mb-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Edit your image
        </h2>
      </div>

      <div className="flex-1 space-y-8">
        {/* Section Sliders */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            General Settings
          </h3>
          <Slider label="Padding" icon={Maximize} value={settings.padding} onChange={(val) => updateSetting('padding', val)} max={120} unit="px" />
          <Slider label="Border Radius" icon={Square} value={settings.borderRadius} onChange={(val) => updateSetting('borderRadius', val)} max={50} unit="px" />
          <Slider label="Shadow" icon={Layers} value={settings.shadow} onChange={(val) => updateSetting('shadow', val)} max={100} unit="%" />
        </div>

        {/* NOUVELLE SECTION : Background Style */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Background Style
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {backgrounds.map((bg, index) => (
              <button
                key={index}
                onClick={() => updateSetting('background', bg.value)}
                className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                  settings.background === bg.value ? 'border-[#FFAC00]' : 'border-transparent'
                }`}
                style={{ background: bg.value }}
                title={bg.name}
              />
            ))}
          </div>
        </div>

      </div>

      <div className="pt-6 border-t border-gray-900 mt-auto">
        <button className="w-full bg-[#FFAC00] hover:bg-[#eebb00] text-black font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(255,172,0,0.2)] transition-transform active:scale-95">
          Export design ⚡️
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;