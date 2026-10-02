import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Monitor, Sliders } from 'lucide-react';
import { sounds } from '../game/audio';
import { GraphicsQuality } from '../game/types';

interface PauseModalProps {
  onResume: () => void;
  onRetry: () => void;
  onMenu: () => void;
  quality: GraphicsQuality;
  onQualityChange: (q: GraphicsQuality) => void;
  cameraSensitivity?: number;
  onSensitivityChange?: (val: number) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRetry,
  onMenu,
  quality,
  onQualityChange,
  cameraSensitivity = 1.0,
  onSensitivityChange
}) => {
  const [muted, setMuted] = React.useState(!sounds.soundEnabled);

  const toggleSound = () => {
    sounds.soundEnabled = !sounds.soundEnabled;
    sounds.musicEnabled = !sounds.musicEnabled;
    setMuted(!sounds.soundEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-zinc-900 border border-white/20 rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-black text-center mb-1">JUEGO EN PAUSA</h2>
        <p className="text-zinc-400 text-xs text-center mb-4">Ajustes rápidos de combate e infiltración</p>

        {/* Sensitivity Quick Slider */}
        {onSensitivityChange && (
          <div className="bg-zinc-950/60 rounded-2xl p-3 border border-white/10 mb-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Sensibilidad de Giro 3D:</span>
              </div>
              <span className="text-cyan-400 font-mono font-black">{cameraSensitivity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.1"
              value={cameraSensitivity}
              onChange={e => onSensitivityChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>
        )}

        {/* Quality Selector */}
        <div className="bg-zinc-950/60 rounded-2xl p-3 border border-white/10 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 mb-2">
            <Monitor className="w-4 h-4 text-amber-400" />
            <span>Calidad Gráfica:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['low', 'medium', 'high'] as GraphicsQuality[]).map(q => (
              <button
                key={q}
                type="button"
                onClick={() => onQualityChange(q)}
                className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
                  quality === q
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {q === 'low' ? 'Baja (60fps)' : q === 'medium' ? 'Media' : 'Alta (HD)'}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className="w-full py-2.5 px-4 mb-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold flex items-center justify-between transition-colors"
        >
          <span>Efectos de Sonido y Música</span>
          {muted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3.5 px-4 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 active:scale-95 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform"
          >
            <Play className="w-5 h-5" />
            <span>CONTINUAR</span>
          </button>

          <button
            type="button"
            onClick={onRetry}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-transform"
          >
            <RotateCcw className="w-4 h-4 text-blue-400" />
            <span>REINICIAR NIVEL</span>
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-transform"
          >
            <Home className="w-4 h-4 text-zinc-400" />
            <span>SALIR AL MENÚ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
