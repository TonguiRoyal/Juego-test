import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Clock, Mail, Coins, ShieldCheck, ArrowRight, RotateCcw, Home, BookOpen } from 'lucide-react';
import { GIRLS_DATA } from '../game/levelsData';
import { LevelConfig } from '../game/types';

interface VictoryModalProps {
  level: LevelConfig;
  stats: {
    time: number;
    letters: number;
    coins: number;
    undetected: boolean;
  };
  onNextLevel: () => void;
  onRetry: () => void;
  onMenu: () => void;
  onOpenAlbum: () => void;
  hasNextLevel: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  level,
  stats,
  onNextLevel,
  onRetry,
  onMenu,
  onOpenAlbum,
  hasNextLevel
}) => {
  const girl = GIRLS_DATA.find(g => g.id === level.girlId) || GIRLS_DATA[0];

  // Calculate stars
  let stars = 1; // Completed
  if (stats.time <= level.parTime) stars++;
  if (stats.letters === 3 || stats.undetected) stars++;

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);
      return () => clearTimeout(timer);
    } catch {
      // Ignore if unavailable
    }
  }, []);

  const randomDialogue = girl.dialogueSuccess[Math.floor(Math.random() * girl.dialogueSuccess.length)];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-linear-to-b from-zinc-900 to-zinc-950 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 max-w-lg w-full text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Decorative Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-44 bg-amber-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-widest font-black text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-600/30">
            ¡MISIÓN CUMPLIDA!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1 text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-rose-300 to-amber-200">
            ¡Llegaste a su Habitación!
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">{level.title}</p>
        </div>

        {/* Stars */}
        <div className="flex justify-center items-center gap-3 my-3">
          {[1, 2, 3].map(s => (
            <Star
              key={s}
              className={`w-10 h-10 transition-transform ${
                s <= stars
                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse'
                  : 'text-zinc-700 fill-zinc-800 scale-90'
              }`}
            />
          ))}
        </div>

        {/* Anime Girl Encounter Card */}
        <div className="my-4 bg-zinc-800/60 rounded-2xl p-3.5 border border-white/10 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/20 shrink-0"
            style={{ backgroundColor: girl.color }}
          >
            {girl.avatarIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white text-base truncate">{girl.name}</h3>
              <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-white/5">
                {girl.tagline}
              </span>
            </div>
            <p className="text-xs text-amber-200/90 mt-1 italic font-medium">"{randomDialogue}"</p>
            <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
              <span>🎁 Regalo entregado:</span>
              <span className="text-zinc-200 font-semibold">{girl.favGift}</span>
            </p>
          </div>
        </div>

        {/* Level Stats Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center my-4">
          <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
            <Clock className="w-4 h-4 mx-auto text-blue-400 mb-1" />
            <div className="text-[10px] text-zinc-400">Tiempo</div>
            <div className="font-black text-sm text-white">{stats.time}s</div>
            <div className="text-[9px] text-zinc-500">Par: {level.parTime}s</div>
          </div>

          <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
            <Mail className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <div className="text-[10px] text-zinc-400">Cartas</div>
            <div className="font-black text-sm text-amber-300">{stats.letters}/3</div>
            <div className="text-[9px] text-zinc-500">+Bonus estrellas</div>
          </div>

          <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
            <Coins className="w-4 h-4 mx-auto text-yellow-400 mb-1" />
            <div className="text-[10px] text-zinc-400">Monedas</div>
            <div className="font-black text-sm text-yellow-300">+{stats.coins}</div>
            <div className="text-[9px] text-zinc-500">Para la tienda</div>
          </div>

          <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
            <ShieldCheck className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <div className="text-[10px] text-zinc-400">Sigilo</div>
            <div className="font-black text-sm text-emerald-300">
              {stats.undetected ? '100% Ninja' : 'Detectado'}
            </div>
            <div className="text-[9px] text-zinc-500">{stats.undetected ? '+Honor' : 'Papá alertado'}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-5">
          {hasNextLevel ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full py-3.5 px-4 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 active:scale-95 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform"
            >
              <span>SIGUIENTE NIVEL</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="p-3 bg-amber-500/20 border border-amber-500 rounded-xl text-center text-amber-300 font-black text-sm">
              🏆 ¡HAS COMPLETADO LOS 10 NIVELES Y CONQUISTADO TODAS LAS VENTANAS! 🏆
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={onOpenAlbum}
              className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-transform"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Álbum</span>
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-transform"
            >
              <RotateCcw className="w-4 h-4 text-blue-400" />
              <span>Reintentar</span>
            </button>
            <button
              type="button"
              onClick={onMenu}
              className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-transform"
            >
              <Home className="w-4 h-4 text-zinc-400" />
              <span>Menú</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
