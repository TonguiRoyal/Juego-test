import React, { useState } from 'react';
import { Play, Grid, BookOpen, ShoppingBag, Settings, HelpCircle, Star, Coins, Sparkles, Heart, Bot } from 'lucide-react';
import { sounds } from '../game/audio';
import { CodeExportModal } from './CodeExportModal';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenAlbum: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  totalStars: number;
  totalCoins: number;
  unlockedGirlsCount: number;
  highestUnlockedLevel: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenAlbum,
  onOpenShop,
  onOpenSettings,
  totalStars,
  totalCoins,
  unlockedGirlsCount,
  highestUnlockedLevel
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleAction = (cb: () => void) => {
    sounds.playCoin();
    cb();
  };

  return (
    <div className="fixed inset-0 z-40 bg-zinc-950 flex flex-col justify-between items-center p-4 sm:p-6 select-none overflow-y-auto">
      {/* Background Anime Aesthetic Lights */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Stats */}
      <div className="w-full max-w-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          {/* Stars */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/30 text-amber-300 font-black text-xs shadow-lg">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{totalStars}/30</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-yellow-500/30 text-yellow-300 font-black text-xs shadow-lg">
            <Coins className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span>{totalCoins}</span>
          </div>
        </div>

        {/* Girls Unlocked */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-500/30 text-rose-300 font-black text-xs shadow-lg">
          <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
          <span>{unlockedGirlsCount}/10 Chicas</span>
        </div>
      </div>

      {/* Hero Title Section */}
      <div className="text-center my-auto py-6 max-w-lg w-full z-10 flex flex-col items-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 bg-linear-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-500/40 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider text-amber-300 mb-3 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>ACCIÓN 3D • LLEGA A LA HABITACIÓN</span>
        </div>

        {/* Game Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-linear-to-b from-white via-amber-200 to-amber-400 drop-shadow-[0_4px_16px_rgba(251,191,36,0.35)]">
          ROMEO BRAWL 3D
        </h1>
        <div className="text-xl sm:text-2xl font-black text-rose-400 tracking-wider uppercase mt-1 drop-shadow">
          Misión: La Habitación de la Chica
        </div>

        <p className="text-zinc-400 text-xs sm:text-sm mt-3 max-w-md px-4 text-center">
          Entra a la casa, pelea contra los monstruos domésticos y esquiva a los padres con la chancla para llegar al dormitorio de la chica.
        </p>

        {/* Main Action Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs mt-8">
          {/* Play / Continue button */}
          <button
            type="button"
            onClick={() => handleAction(onStartGame)}
            className="w-full py-4 px-6 bg-linear-to-r from-amber-500 via-rose-500 to-amber-500 hover:from-amber-400 hover:to-rose-400 active:scale-95 text-white font-black text-base rounded-2xl shadow-xl border-2 border-white/50 flex items-center justify-center gap-3 transition-transform animate-pulse"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>{highestUnlockedLevel > 1 ? `CONTINUAR NIVEL ${highestUnlockedLevel}` : '¡EMPEZAR A JUGAR!'}</span>
          </button>

          {/* Level Select */}
          <button
            type="button"
            onClick={() => handleAction(onOpenLevelSelect)}
            className="w-full py-3 px-5 bg-zinc-900/90 hover:bg-zinc-800 active:scale-95 text-white font-bold text-sm rounded-xl border border-white/15 shadow-md flex items-center justify-center gap-2.5 transition-transform"
          >
            <Grid className="w-4 h-4 text-amber-400" />
            <span>Selección de Niveles (1 al 10)</span>
          </button>

          {/* Girls Album */}
          <button
            type="button"
            onClick={() => handleAction(onOpenAlbum)}
            className="w-full py-3 px-5 bg-zinc-900/90 hover:bg-zinc-800 active:scale-95 text-white font-bold text-sm rounded-xl border border-white/15 shadow-md flex items-center justify-center gap-2.5 transition-transform"
          >
            <BookOpen className="w-4 h-4 text-rose-400" />
            <span>Álbum de las 10 Chicas</span>
          </button>

          {/* Shop */}
          <button
            type="button"
            onClick={() => handleAction(onOpenShop)}
            className="w-full py-3 px-5 bg-zinc-900/90 hover:bg-zinc-800 active:scale-95 text-white font-bold text-sm rounded-xl border border-white/15 shadow-md flex items-center justify-center gap-2.5 transition-transform"
          >
            <ShoppingBag className="w-4 h-4 text-yellow-400" />
            <span>Tienda (Disfraces & Armas)</span>
          </button>
        </div>

        {/* Secondary options */}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => handleAction(onOpenSettings)}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 active:scale-95 transition-transform"
            title="Ajustes de calidad gráfica y audio"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playCoin();
              setShowCodeModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-transform"
            title="Enviar código a ChatGPT"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Código ChatGPT</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHowToPlay(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>¿Cómo Jugar?</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-xl text-center text-[10px] text-zinc-500 z-10">
        🎮 Compatible con Android (Gama Baja/Alta 60fps), iPhone y PC • Controles táctiles y teclado
      </div>

      {/* How to Play Dialog */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/20 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl">
            <h3 className="text-xl font-black text-amber-400 text-center mb-4">Guía de Infiltración y Combate</h3>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex items-start gap-3">
                <span className="text-2xl">🕹️</span>
                <div>
                  <strong className="text-white">Caminar hacia la Habitación:</strong>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Mueve el joystick hacia arriba (o W) para avanzar hacia el fondo de la casa en dirección a la habitación de la chica.
                  </p>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex items-start gap-3">
                <span className="text-2xl">⚔️</span>
                <div>
                  <strong className="text-white">Combate y Combo de Golpes:</strong>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Pulsa el botón grande de GOLPEAR (o Espacio / F en PC) para encadenar combos de 3 golpes, noquear a los robots y aturdir a Papá o Mamá.
                  </p>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex items-start gap-3">
                <span className="text-2xl">🍌</span>
                <div>
                  <strong className="text-white">Trampa de Plátano & Esquivar:</strong>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Usa el botón azul para esquivar rápidamente y suelta cáscaras de plátano para que Papá resbale y gire 720° aturdido.
                  </p>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex items-start gap-3">
                <span className="text-2xl">🚪</span>
                <div>
                  <strong className="text-white">Llega al Dormitorio:</strong>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Avanza por el salón y el pasillo hasta la puerta del dormitorio de la chica. La puerta se abrirá y ella te recibirá con su regalo especial.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHowToPlay(false)}
              className="w-full mt-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl transition-colors"
            >
              ¡ENTENDIDO, A PELEAR!
            </button>
          </div>
        </div>
      )}

      {showCodeModal && (
        <CodeExportModal onClose={() => setShowCodeModal(false)} />
      )}
    </div>
  );
};
