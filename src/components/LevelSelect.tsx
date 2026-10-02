import React from 'react';
import { ArrowLeft, Star, Lock, Clock, ShieldAlert } from 'lucide-react';
import { LEVELS_CONFIG, GIRLS_DATA } from '../game/levelsData';
import { LevelProgress } from '../game/types';
import { sounds } from '../game/audio';

interface LevelSelectProps {
  progress: Record<number, LevelProgress>;
  onSelectLevel: (lvlId: number) => void;
  onClose: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ progress, onSelectLevel, onClose }) => {
  const handleSelect = (id: number, isUnlocked: boolean) => {
    if (!isUnlocked) {
      sounds.playHurt();
      return;
    }
    sounds.playCoin();
    onSelectLevel(id);
  };

  const totalStars = Object.values(progress).reduce((acc, p) => acc + (p.stars || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col p-4 sm:p-6 select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full mb-4">
        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white flex items-center gap-2 border border-white/10 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold">Volver</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-rose-300 to-amber-400">
            Selección de Niveles
          </h2>
          <p className="text-[11px] text-zinc-400">10 tejados, 10 chicas y padres con chanclas</p>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-500/40 text-amber-300 font-black text-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{totalStars}/30</span>
        </div>
      </div>

      {/* Grid of 10 Levels */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pb-8">
        {LEVELS_CONFIG.map(lvl => {
          const prog = progress[lvl.id] || { unlocked: lvl.id === 1, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 };
          const isUnlocked = prog.unlocked || lvl.id === 1;
          const girl = GIRLS_DATA.find(g => g.id === lvl.girlId) || GIRLS_DATA[0];

          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => handleSelect(lvl.id, isUnlocked)}
              disabled={!isUnlocked}
              className={`relative bg-zinc-900/80 border rounded-3xl p-4 flex flex-col justify-between text-left transition-all group ${
                isUnlocked
                  ? 'border-white/10 hover:border-amber-400/80 hover:bg-zinc-850 active:scale-95 cursor-pointer shadow-lg'
                  : 'border-white/5 opacity-55 cursor-not-allowed'
              }`}
            >
              {/* Top Banner */}
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-black text-white text-xs">
                  #{lvl.id}
                </span>

                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    lvl.difficulty === 'Fácil'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : lvl.difficulty === 'Media'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : lvl.difficulty === 'Difícil'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                  }`}
                >
                  {lvl.difficulty}
                </span>
              </div>

              {/* Girl Avatar & Title */}
              <div className="flex items-center gap-3 my-1">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border border-white/20 shrink-0"
                  style={{ backgroundColor: isUnlocked ? girl.color : '#3f3f46' }}
                >
                  {isUnlocked ? girl.avatarIcon : <Lock className="w-5 h-5 text-zinc-400" />}
                </div>

                <div className="min-w-0">
                  <h3 className="font-black text-white text-sm truncate">{lvl.title}</h3>
                  <p className="text-[11px] text-amber-300 font-semibold truncate">{girl.name}</p>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 line-clamp-2 my-2">{lvl.description}</p>

              {/* Par time & Stars footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs mt-1">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{lvl.parTime}s</span>
                </div>

                {/* Stars earned */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map(s => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= prog.stars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-700 fill-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
