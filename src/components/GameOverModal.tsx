import React from 'react';
import { RotateCcw, Home, ShieldAlert } from 'lucide-react';
import { GIRLS_DATA } from '../game/levelsData';
import { LevelConfig } from '../game/types';

interface GameOverModalProps {
  level: LevelConfig;
  reason: string;
  onRetry: () => void;
  onMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ level, reason, onRetry, onMenu }) => {
  const girl = GIRLS_DATA.find(g => g.id === level.girlId) || GIRLS_DATA[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-linear-to-b from-zinc-900 to-zinc-950 border-2 border-rose-600/60 rounded-3xl p-6 sm:p-7 max-w-md w-full text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Red Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-36 bg-rose-600/30 blur-3xl pointer-events-none rounded-full" />

        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-rose-600/20 border-2 border-rose-500 mx-auto flex items-center justify-center mb-2 shadow-lg animate-pulse">
            <span className="text-3xl">🩴</span>
          </div>
          <span className="text-xs uppercase tracking-widest font-black text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-600/30">
            ¡TE ATRAPARON!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1.5 text-white">¡Ataque de Chancla!</h2>
          <p className="text-rose-300 text-xs mt-1 font-medium">{reason || 'Los padres protegieron la casa'}</p>
        </div>

        {/* Funny quote from the Girl */}
        <div className="bg-zinc-800/60 rounded-2xl p-4 border border-white/10 my-4 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: girl.color }}
          >
            {girl.avatarIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xs text-white truncate">{girl.name} desde la ventana:</div>
            <p className="text-[11px] text-zinc-300 italic mt-0.5">"{girl.dialogueCaught}"</p>
          </div>
        </div>

        {/* Tip for player */}
        <div className="bg-black/40 rounded-xl p-3 border border-white/5 text-[11px] text-zinc-400 text-center mb-5">
          💡 <span className="font-bold text-zinc-200">Consejo Ninja:</span> Deslízate con el botón azul para agacharte y pasar desapercibido, o suelta cáscaras de plátano para hacer resbalar a los padres.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onRetry}
            className="w-full py-3.5 px-4 bg-linear-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform"
          >
            <RotateCcw className="w-5 h-5" />
            <span>REINTENTAR NIVEL</span>
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-transform"
          >
            <Home className="w-4 h-4 text-zinc-400" />
            <span>VOLVER AL MENÚ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
