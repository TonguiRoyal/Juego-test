import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, FileCode, Bot, Sparkles, ExternalLink } from 'lucide-react';
import { sounds } from '../game/audio';

interface CodeExportModalProps {
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ onClose }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyToClipboard = async (title: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      sounds.playVictory();
      setCopiedFile(title);
      setTimeout(() => setCopiedFile(null), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedFile(title);
      setTimeout(() => setCopiedFile(null), 2500);
    }
  };

  const chatGptPrompt = `Hola ChatGPT! Estoy desarrollando un juego 3D en React 19 + TypeScript + Three.js llamado "Romeo Parkour 3D - Secret Window Rush".
El juego cuenta con:
- Personajes con estética anatómica y zapatillas chunky estilo Fortnite con codos y rodillas articuladas que se flexionan proceduralmente en animatePlayer().
- Materiales MeshStandardMaterial con luz de contorno (Rim-Lighting) y shaders PBR.
- Mecánica cómica de sigilo: burlar a Papá y Mamá con la chancla voladora, derrotar monstruos domésticos (Roomba, Gnomo, Pelusa) y rescatar a 10 chicas anime en sus habitaciones personalizadas.
- 10 niveles progresivos con cartas de amor coleccionables, tienda de disfraces y armas cómicas.
- Controles de sensibilidad de cámara y movimiento configurables, además de monedas infinitas para pruebas.

¿Podrías analizar la arquitectura y sugerirme nuevas mecánicas divertidas, nuevos tipos de enemigos o mejoras de rendimiento 3D?`;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col p-4 sm:p-6 select-none overflow-y-auto">
      <div className="max-w-xl mx-auto w-full my-auto bg-zinc-900 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
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
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg sm:text-xl font-black text-white">Enviar Código a ChatGPT</h2>
          </div>
          <div className="w-14" />
        </div>

        {/* ChatGPT Prompt Card */}
        <div className="bg-linear-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 rounded-2xl p-4 border border-emerald-500/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Prompt Listo para ChatGPT</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('Prompt ChatGPT', chatGptPrompt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all shadow-md ${
                copiedFile === 'Prompt ChatGPT'
                  ? 'bg-emerald-400 text-black'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black'
              }`}
            >
              {copiedFile === 'Prompt ChatGPT' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'Prompt ChatGPT' ? '¡Copiado!' : 'Copiar Prompt'}</span>
            </button>
          </div>
          <p className="text-xs text-zinc-300 font-mono bg-zinc-950/60 p-3 rounded-xl border border-white/5 line-clamp-4">
            {chatGptPrompt}
          </p>
        </div>

        {/* Files explanation */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Archivos Clave del Juego para Compartir:
          </h3>

          <div className="space-y-2">
            {[
              {
                file: 'src/game/characterModeler.ts',
                title: 'Modelador 3D Fortnite & Shaders',
                desc: 'Geometría anatómica V-Taper, articulaciones de rodillas/codos, zapatillas chunky y texturas anime PBR'
              },
              {
                file: 'src/game/ThreeGame.ts',
                title: 'Motor 3D & Ciclo de Juego',
                desc: 'Físicas, animatePlayer con flexión articular, IA de padres y monstruos, cámara orbital y Rim-Light'
              },
              {
                file: 'src/game/levelsData.ts',
                title: 'Datos de los 10 Niveles y Chicas',
                desc: 'Configuración de cuartos, diálogos de las chicas, cartas de amor, skins y armas desbloqueables'
              },
              {
                file: 'src/App.tsx',
                title: 'UI de React & Gestión de Estado',
                desc: 'Monedas infinitas, persistencia en localStorage, HUD y control de sensibilidad'
              }
            ].map(item => (
              <div
                key={item.file}
                className="bg-zinc-950/60 rounded-2xl p-3.5 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-black text-white truncate">{item.title}</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5 truncate">{item.file}</div>
                  <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="p-3 bg-zinc-800/60 rounded-xl border border-white/5 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>💡 También puedes copiar el código directamente desde el chat o descargarlo en cualquier momento.</span>
        </div>
      </div>
    </div>
  );
};
