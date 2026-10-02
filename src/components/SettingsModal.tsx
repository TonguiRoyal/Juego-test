import React, { useState } from 'react';
import { ArrowLeft, Monitor, Volume2, VolumeX, Smartphone, RotateCcw, Sliders, Sparkles, Coins, Eye, Check } from 'lucide-react';
import { GameSettings, GraphicsQuality } from '../game/types';
import { sounds } from '../game/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
  onAddInfiniteCoins: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onAddInfiniteCoins,
  onClose
}) => {
  const [cheatTriggered, setCheatTriggered] = useState(false);

  const handleQuality = (q: GraphicsQuality) => {
    sounds.playCoin();
    onUpdateSettings({ quality: q });
  };

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    sounds.soundEnabled = next;
    onUpdateSettings({ soundEnabled: next });
    if (next) sounds.playCoin();
  };

  const toggleMusic = () => {
    const next = !settings.musicEnabled;
    sounds.musicEnabled = next;
    onUpdateSettings({ musicEnabled: next });
    if (next) sounds.startMusic();
    else sounds.stopMusic();
  };

  const handleJoystickSize = (size: GameSettings['joystickSize']) => {
    sounds.playCoin();
    onUpdateSettings({ joystickSize: size });
  };

  const handleCameraSens = (val: number) => {
    onUpdateSettings({ cameraSensitivity: Math.round(val * 10) / 10 });
  };

  const handleMoveSens = (val: number) => {
    onUpdateSettings({ moveSensitivity: Math.round(val * 10) / 10 });
  };

  const toggleInvertY = () => {
    sounds.playCoin();
    onUpdateSettings({ invertY: !settings.invertY });
  };

  const handleCheatCoins = () => {
    sounds.playVictory();
    onAddInfiniteCoins();
    setCheatTriggered(true);
    setTimeout(() => setCheatTriggered(false), 2500);
  };

  const currentCamSens = settings.cameraSensitivity ?? 1.0;
  const currentMoveSens = settings.moveSensitivity ?? 1.0;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col p-4 sm:p-6 select-none overflow-y-auto">
      <div className="max-w-md mx-auto w-full my-auto bg-zinc-900 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          <h2 className="text-xl font-black text-white">Configuración</h2>
          <div className="w-14" />
        </div>

        {/* CHEAT BUTTON: MONEDAS INFINITAS */}
        <div className="bg-linear-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-2xl p-4 border border-amber-500/50 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 uppercase tracking-wider">
                <Coins className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>Monedas Infinitas</span>
              </div>
              <p className="text-[11px] text-zinc-300 mt-0.5">
                Desbloquea al instante todas las skins y armas
              </p>
            </div>

            <button
              type="button"
              onClick={handleCheatCoins}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all shadow-md ${
                cheatTriggered
                  ? 'bg-emerald-500 text-black'
                  : 'bg-linear-to-r from-amber-400 to-yellow-400 text-black hover:brightness-110'
              }`}
            >
              {cheatTriggered ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Activado!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>+999,999 💰</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AJUSTES DE SENSIBILIDAD */}
        <div className="bg-zinc-950/60 rounded-2xl p-4 border border-white/10 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-black text-cyan-300 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>Sensibilidad de Control</span>
            </div>
            <span className="text-[10px] text-zinc-400 lowercase font-normal">Giro 3D y carrera</span>
          </div>

          {/* Sensibilidad de Cámara */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-200 mb-1.5">
              <span>Sensibilidad de Cámara (Giro 3D):</span>
              <span className="text-cyan-400 font-mono font-black">{currentCamSens.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.1"
              value={currentCamSens}
              onChange={e => handleCameraSens(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            {/* Presets de sensibilidad */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {[
                { label: 'Lenta', val: 0.6 },
                { label: 'Media', val: 1.0 },
                { label: 'Rápida', val: 1.6 },
                { label: 'Ultra', val: 2.4 }
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    sounds.playCoin();
                    handleCameraSens(p.val);
                  }}
                  className={`py-1 text-[10px] rounded-lg font-bold border transition-colors ${
                    Math.abs(currentCamSens - p.val) < 0.15
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sensibilidad de Movimiento / Joystick */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-200 mb-1.5">
              <span>Velocidad de Movimiento:</span>
              <span className="text-amber-400 font-mono font-black">{currentMoveSens.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.8"
              step="0.1"
              value={currentMoveSens}
              onChange={e => handleMoveSens(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>

          {/* Invertir Eje Vertical (Y) */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-zinc-200 block">Invertir Eje Y (Arriba/Abajo)</span>
              <span className="text-[10px] text-zinc-500">Para estilo simulador de vuelo</span>
            </div>
            <button
              type="button"
              onClick={toggleInvertY}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                settings.invertY
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-zinc-900 border-white/10 text-zinc-400'
              }`}
            >
              {settings.invertY ? 'Invertido' : 'Normal'}
            </button>
          </div>
        </div>

        {/* Graphics Quality */}
        <div className="bg-zinc-950/60 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
            <Monitor className="w-4 h-4" />
            <span>Calidad Gráfica (Android / iOS / PC)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'low', label: 'Baja', sub: 'Android básico' },
              { id: 'medium', label: 'Media', sub: 'Equilibrada' },
              { id: 'high', label: 'Alta', sub: 'Gama Alta / PC' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleQuality(opt.id as GraphicsQuality)}
                className={`p-2 rounded-xl text-center border transition-all ${
                  settings.quality === opt.id
                    ? 'border-amber-400 bg-amber-500/20 text-white font-black'
                    : 'border-white/5 bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="text-xs">{opt.label}</div>
                <div className="text-[9px] text-zinc-500 mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Toggles */}
        <div className="bg-zinc-950/60 rounded-2xl p-4 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200">Efectos de Sonido</span>
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                settings.soundEnabled
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-zinc-800 border-white/10 text-zinc-500'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs font-bold text-zinc-200">Música de Fondo Cómica</span>
            <button
              type="button"
              onClick={toggleMusic}
              className={`p-2 rounded-xl border transition-colors ${
                settings.musicEnabled
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-zinc-800 border-white/10 text-zinc-500'
              }`}
            >
              {settings.musicEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Touch Button Size */}
        <div className="bg-zinc-950/60 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 text-xs font-black text-blue-300 uppercase tracking-wider mb-2">
            <Smartphone className="w-4 h-4" />
            <span>Tamaño Botones Táctiles</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['small', 'medium', 'large'] as GameSettings['joystickSize'][]).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => handleJoystickSize(s)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  settings.joystickSize === s
                    ? 'border-blue-400 bg-blue-500/20 text-white font-black'
                    : 'border-white/5 bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {s === 'small' ? 'Pequeño' : s === 'medium' ? 'Normal' : 'Grande'}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Progress */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Deseas reiniciar todo tu progreso, estrellas y monedas?')) {
              onResetProgress();
            }
          }}
          className="w-full py-2.5 px-4 bg-zinc-800/80 hover:bg-rose-950/40 hover:border-rose-600/40 text-zinc-400 hover:text-rose-300 border border-white/5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restablecer Progreso</span>
        </button>
      </div>
    </div>
  );
};
