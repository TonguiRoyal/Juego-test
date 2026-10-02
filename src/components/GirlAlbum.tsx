import React, { useState } from 'react';
import { ArrowLeft, Lock, Heart, Gift, MessageCircle, Sparkles } from 'lucide-react';
import { GIRLS_DATA } from '../game/levelsData';
import { LevelProgress } from '../game/types';
import { sounds } from '../game/audio';

interface GirlAlbumProps {
  progress: Record<number, LevelProgress>;
  onClose: () => void;
  onPlayLevel: (lvlId: number) => void;
}

export const GirlAlbum: React.FC<GirlAlbumProps> = ({ progress, onClose, onPlayLevel }) => {
  const [selectedGirlId, setSelectedGirlId] = useState<number>(1);
  const selectedGirl = GIRLS_DATA.find(g => g.id === selectedGirlId) || GIRLS_DATA[0];
  const isUnlocked = progress[selectedGirl.id]?.stars > 0;

  const handleSelect = (id: number) => {
    setSelectedGirlId(id);
    sounds.playCoin();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col p-4 sm:p-6 select-none overflow-y-auto">
      {/* Top Header */}
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
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-rose-400 via-pink-300 to-amber-300">
            Álbum de las 10 Chicas
          </h2>
          <p className="text-[11px] text-zinc-400">Colección de cartas y recuerdos de ventanas</p>
        </div>

        <div className="text-xs font-bold text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-500/20">
          {Object.values(progress).filter(p => p.stars > 0).length}/10 Desbloqueadas
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-5 pb-6">
        {/* Left: Thumbnail Grid of 10 Girls */}
        <div className="grid grid-cols-5 md:grid-cols-2 lg:grid-cols-5 gap-2.5 shrink-0 max-h-[520px] overflow-y-auto p-1">
          {GIRLS_DATA.map(girl => {
            const unlocked = progress[girl.id]?.stars > 0;
            const isSelected = girl.id === selectedGirlId;
            return (
              <button
                key={girl.id}
                type="button"
                onClick={() => handleSelect(girl.id)}
                className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all active:scale-95 ${
                  isSelected
                    ? 'border-amber-400 bg-zinc-800/90 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md border ${
                    unlocked ? 'border-white/30' : 'border-zinc-800 grayscale opacity-50'
                  }`}
                  style={{ backgroundColor: unlocked ? girl.color : '#27272a' }}
                >
                  {unlocked ? girl.avatarIcon : <Lock className="w-5 h-5 text-zinc-500" />}
                </div>

                <span className="text-xs font-bold text-white mt-1.5 truncate max-w-full">
                  {girl.name}
                </span>
                <span className="text-[9px] text-zinc-400">Nivel {girl.id}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Girl Profile Card */}
        <div className="flex-1 bg-zinc-900/90 border border-white/15 rounded-3xl p-5 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: selectedGirl.color }}
          />

          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl border-2 border-white/20"
                  style={{ backgroundColor: isUnlocked ? selectedGirl.color : '#3f3f46' }}
                >
                  {isUnlocked ? selectedGirl.avatarIcon : '🔒'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-white">{selectedGirl.name}</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300">
                      Nivel {selectedGirl.id}
                    </span>
                  </div>
                  <p className="text-xs text-amber-300 font-medium mt-0.5">{selectedGirl.tagline}</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-md">{selectedGirl.personality}</p>
                </div>
              </div>
            </div>

            {/* Unlocked / Locked details */}
            {isUnlocked ? (
              <div className="space-y-3.5 my-4">
                {/* Gift info */}
                <div className="bg-black/40 rounded-2xl p-3 border border-white/5 flex items-center gap-3">
                  <Gift className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider">Regalo Favorito</span>
                    <p className="text-xs text-white font-semibold">{selectedGirl.favGift}</p>
                  </div>
                </div>

                {/* Room & Window theme */}
                <div className="bg-black/40 rounded-2xl p-3 border border-white/5 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider">Temática del Balcón</span>
                    <p className="text-xs text-zinc-200">{selectedGirl.roomTheme}</p>
                  </div>
                </div>

                {/* Dialogue Samples */}
                <div className="bg-black/40 rounded-2xl p-3.5 border border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-rose-300 text-xs font-bold">
                    <MessageCircle className="w-4 h-4" />
                    <span>Líneas cómicas al llegar a su ventana:</span>
                  </div>
                  <div className="space-y-1.5">
                    {selectedGirl.dialogueSuccess.map((d, i) => (
                      <p key={i} className="text-xs text-zinc-300 italic pl-3 border-l-2 border-rose-500/40">
                        "{d}"
                      </p>
                    ))}
                  </div>
                </div>

                {/* Secret Trivia Fact */}
                <div className="bg-amber-950/30 rounded-2xl p-3.5 border border-amber-500/20">
                  <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider">Dato Secreto Curioso</span>
                  <p className="text-xs text-zinc-200 mt-0.5">{selectedGirl.secretFact}</p>
                </div>
              </div>
            ) : (
              <div className="my-8 text-center py-10 bg-black/40 rounded-2xl border border-white/5">
                <Lock className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
                <h4 className="text-base font-black text-zinc-300">Perfil Bloqueado</h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-1">
                  Completa el Nivel {selectedGirl.id} superando los obstáculos y escapando de los padres para desbloquear a {selectedGirl.name}.
                </p>
              </div>
            )}
          </div>

          {/* Action to Jump to Level */}
          <button
            type="button"
            onClick={() => onPlayLevel(selectedGirl.id)}
            className="w-full py-3.5 px-4 mt-2 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform"
          >
            <span>{isUnlocked ? `REPETIR NIVEL ${selectedGirl.id}` : `JUGAR NIVEL ${selectedGirl.id}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
