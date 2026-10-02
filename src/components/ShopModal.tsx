import React, { useState } from 'react';
import { ArrowLeft, Coins, Check, Lock, Sparkles, Shield, Sword } from 'lucide-react';
import { SKINS_DATA, WEAPONS_DATA } from '../game/levelsData';
import { PlayerSkin, WeaponItem } from '../game/types';
import { sounds } from '../game/audio';

interface ShopModalProps {
  coins: number;
  unlockedSkins: string[];
  unlockedWeapons: string[];
  currentSkinId: string;
  currentWeaponId: string;
  onBuySkin: (skinId: string, cost: number) => void;
  onBuyWeapon: (weaponId: string, cost: number) => void;
  onEquipSkin: (skinId: string) => void;
  onEquipWeapon: (weaponId: string) => void;
  onAddInfiniteCoins?: () => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  unlockedSkins,
  unlockedWeapons,
  currentSkinId,
  currentWeaponId,
  onBuySkin,
  onBuyWeapon,
  onEquipSkin,
  onEquipWeapon,
  onAddInfiniteCoins,
  onClose
}) => {
  const [tab, setTab] = useState<'skins' | 'weapons'>('skins');

  const handleEquipSkin = (id: string) => {
    sounds.playCoin();
    onEquipSkin(id);
  };

  const handleEquipWeapon = (id: string) => {
    sounds.playCoin();
    onEquipWeapon(id);
  };

  const handleBuySkin = (skin: PlayerSkin) => {
    if (coins >= skin.cost) {
      sounds.playCoin();
      onBuySkin(skin.id, skin.cost);
    } else {
      sounds.playHurt();
    }
  };

  const handleBuyWeapon = (weapon: WeaponItem) => {
    if (coins >= weapon.cost) {
      sounds.playCoin();
      onBuyWeapon(weapon.id, weapon.cost);
    } else {
      sounds.playHurt();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col p-4 sm:p-6 select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full mb-4">
        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white flex items-center gap-2 border border-white/10 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold">Volver</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-rose-400">
            Tienda del Romeo
          </h2>
          <p className="text-[11px] text-zinc-400">Disfraces de sigilo y armas para repeler monstruos</p>
        </div>

        <div className="flex items-center gap-2">
          {onAddInfiniteCoins && (
            <button
              type="button"
              onClick={() => {
                sounds.playVictory();
                onAddInfiniteCoins();
              }}
              className="flex items-center gap-1.5 bg-linear-to-r from-amber-400 to-yellow-400 text-black px-3 py-1.5 rounded-full font-black text-xs hover:brightness-110 active:scale-95 shadow-md border border-amber-300"
              title="Obtener 999,999 monedas gratis"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>+999k 💰</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-yellow-500/20 px-3.5 py-1.5 rounded-full border border-yellow-500/40 text-yellow-300 font-black text-sm">
            <Coins className="w-5 h-5 fill-yellow-400 text-yellow-500" />
            <span>{coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto w-full flex justify-center mb-6">
        <div className="bg-zinc-900 p-1 rounded-2xl border border-white/10 flex gap-1">
          <button
            type="button"
            onClick={() => setTab('skins')}
            className={`py-2 px-6 rounded-xl font-black text-xs flex items-center gap-2 transition-all ${
              tab === 'skins'
                ? 'bg-amber-500 text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Disfraces ({SKINS_DATA.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('weapons')}
            className={`py-2 px-6 rounded-xl font-black text-xs flex items-center gap-2 transition-all ${
              tab === 'weapons'
                ? 'bg-amber-500 text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sword className="w-4 h-4" />
            <span>Armas Cómicas ({WEAPONS_DATA.length})</span>
          </button>
        </div>
      </div>

      {/* Item Grid */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
        {tab === 'skins'
          ? SKINS_DATA.map(skin => {
              const isUnlocked = unlockedSkins.includes(skin.id);
              const isEquipped = currentSkinId === skin.id;
              return (
                <div
                  key={skin.id}
                  className={`bg-zinc-900/80 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                    isEquipped ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/20 shrink-0"
                      style={{ backgroundColor: `#${skin.shirtColor.toString(16).padStart(6, '0')}` }}
                    >
                      {skin.headExtra === 'box'
                        ? '📦'
                        : skin.headExtra === 'bear_ears'
                        ? '🐻'
                        : skin.headExtra === 'ninja_mask'
                        ? '🥷'
                        : '👕'}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-white text-base">{skin.name}</h3>
                        {isEquipped && (
                          <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Equipado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{skin.desc}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400">
                      {isUnlocked ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Desbloqueado
                        </span>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 fill-yellow-400" />
                          <span>{skin.cost} Monedas</span>
                        </>
                      )}
                    </div>

                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => handleEquipSkin(skin.id)}
                        disabled={isEquipped}
                        className={`py-2 px-4 rounded-xl text-xs font-black transition-all ${
                          isEquipped
                            ? 'bg-zinc-800 text-zinc-500 cursor-default'
                            : 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95'
                        }`}
                      >
                        {isEquipped ? 'En uso' : 'Equipar'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBuySkin(skin)}
                        disabled={coins < skin.cost}
                        className={`py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                          coins >= skin.cost
                            ? 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95 shadow-lg'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Comprar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          : WEAPONS_DATA.map(weapon => {
              const isUnlocked = unlockedWeapons.includes(weapon.id);
              const isEquipped = currentWeaponId === weapon.id;
              return (
                <div
                  key={weapon.id}
                  className={`bg-zinc-900/80 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                    isEquipped ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl shadow-lg border border-white/20 shrink-0">
                      {weapon.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-white text-base">{weapon.name}</h3>
                        {isEquipped && (
                          <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Equipado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{weapon.desc}</p>
                      <div className="text-[11px] text-rose-400 font-bold mt-1">
                        Daño / Potencia: {'⭐'.repeat(weapon.damage)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400">
                      {isUnlocked ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Desbloqueado
                        </span>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 fill-yellow-400" />
                          <span>{weapon.cost} Monedas</span>
                        </>
                      )}
                    </div>

                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => handleEquipWeapon(weapon.id)}
                        disabled={isEquipped}
                        className={`py-2 px-4 rounded-xl text-xs font-black transition-all ${
                          isEquipped
                            ? 'bg-zinc-800 text-zinc-500 cursor-default'
                            : 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95'
                        }`}
                      >
                        {isEquipped ? 'En uso' : 'Equipar'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBuyWeapon(weapon)}
                        disabled={coins < weapon.cost}
                        className={`py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                          coins >= weapon.cost
                            ? 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95 shadow-lg'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Comprar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
