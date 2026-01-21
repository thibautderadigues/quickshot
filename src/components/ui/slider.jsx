const Slider = ({ label, icon: Icon, value, onChange, min = 0, max = 100, unit = "" }) => {
  return (
    <div className="mb-6">
      {/* Label + Valeur */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
          {Icon && <Icon size={18} className="text-gray-500" />}
          <span>{label}</span>
        </div>
        <span className="text-gray-400 text-sm font-mono">
          {value}{unit}
        </span>
      </div>

      {/* La barre du slider */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#FFAC00] hover:accent-[#ffb92e] transition-all"
      />
    </div>
  );
};

export default Slider;