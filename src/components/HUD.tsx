import React, { useEffect, useState } from 'react';
import { Heart, Mail, Coins, Pause, AlertTriangle, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { sounds } from '../game/audio';

interface HUDProps {
  health: number;
  maxHealth: number;
  suspicion: number;
  letters: number;
  totalLetters: number;
  coins: number;
  levelTitle: string;
  onPause: () => void;
  alertStatus: { isAlert: boolean; message: string };
}

export const HUD: React.FC<HUDProps> = ({
  health,
  maxHealth,
  suspicion,
  letters,
  totalLetters,
  coins,
  levelTitle,
  onPause,
  alertStatus
}) => {
  const [soundMuted, setSoundMuted] = useState(!sounds.soundEnabled);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    sounds.soundEnabled = !sounds.soundEnabled;
    sounds.musicEnabled = !sounds.musicEnabled;
    if (sounds.musicEnabled) {
      sounds.startMusic();
    } else {
      sounds.stopMusic();
    }
    setSoundMuted(!sounds.soundEnabled);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Suspicion color calculation
  const getSuspicionColor = () => {
    if (suspicion > 75) return 'bg-rose-500 shadow-rose-500/50';
    if (suspicion > 35) return 'bg-amber-400 shadow-amber-400/50';
    return 'bg-emerald-400 shadow-emerald-400/50';
  };

  return (
    <div className="absolute inset-0 pointer-events-none p-3 sm:p-5 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-2 w-full">
        {/* Left: Health & Level info */}
        <div className="flex flex-col gap-2">
          {/* Health Hearts */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
            {Array.from({ length: maxHealth }).map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 transition-all duration-300 ${
                  i < health
                    ? 'text-rose-500 fill-rose-500 scale-100 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'text-zinc-600 fill-zinc-800 scale-75 opacity-40'
                }`}
              />
            ))}
          </div>

          {/* Level name pill */}
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-semibold text-xs tracking-wide shadow flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="truncate max-w-[140px] sm:max-w-xs">{levelTitle}</span>
            <span className="text-zinc-400 font-mono text-[11px] ml-1">{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Center: Parent Suspicion / Radar Gauge */}
        <div className="flex flex-col items-center max-w-[200px] sm:max-w-xs w-full">
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-black uppercase tracking-wider text-white drop-shadow">
            {suspicion > 75 ? (
              <ShieldAlert className="w-4 h-4 text-rose-500 animate-bounce" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className={suspicion > 75 ? 'text-rose-400 animate-pulse' : 'text-zinc-200'}>
              {suspicion > 80 ? '¡ALERTA DE PADRES!' : suspicion > 30 ? 'Sospecha de Papá' : 'Sigilo Seguro'}
            </span>
          </div>

          <div className="w-full h-3 bg-zinc-950/80 rounded-full border border-white/20 p-0.5 overflow-hidden backdrop-blur-md shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-200 ${getSuspicionColor()} shadow-md`}
              style={{ width: `${Math.min(100, Math.max(0, suspicion))}%` }}
            />
          </div>
        </div>

        {/* Right: Letters, Coins & Pause */}
        <div className="flex items-center gap-2">
          {/* Letters count */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 text-amber-300 font-black text-xs shadow-lg">
            <Mail className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>
              {letters}/{totalLetters}
            </span>
          </div>

          {/* Coins count */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-yellow-500/30 text-yellow-300 font-black text-xs shadow-lg">
            <Coins className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span>{coins}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-lg active:scale-95 transition-transform"
            title="Silenciar sonido"
          >
            {soundMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Pause Button */}
          <button
            type="button"
            onClick={onPause}
            className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-lg active:scale-95 transition-transform"
            title="Pausa"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Middle: Alert Banner Popup */}
      {alertStatus.isAlert && (
        <div className="self-center bg-rose-600/90 border-2 border-white/80 text-white px-5 py-2 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce flex items-center gap-2.5 max-w-md text-center">
          <ShieldAlert className="w-6 h-6 text-yellow-300 shrink-0" />
          <span className="text-xs sm:text-sm font-black tracking-wide uppercase drop-shadow">
            {alertStatus.message}
          </span>
        </div>
      )}

      {/* Bottom spacer so HUD doesn't collide with controls */}
      <div className="h-20" />
    </div>
  );
};
