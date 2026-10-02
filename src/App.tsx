import React, { useEffect, useRef, useState } from 'react';
import { ThreeGameEngine } from './game/ThreeGame';
import { LEVELS_CONFIG } from './game/levelsData';
import { GameSettings, GraphicsQuality, LevelProgress } from './game/types';
import { sounds } from './game/audio';

import { TouchControls } from './components/TouchControls';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { GirlAlbum } from './components/GirlAlbum';
import { ShopModal } from './components/ShopModal';
import { SettingsModal } from './components/SettingsModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';

const DEFAULT_SETTINGS: GameSettings = {
  quality: 'medium',
  soundEnabled: true,
  musicEnabled: true,
  joystickSize: 'medium',
  invertY: false,
  cameraSensitivity: 1.0,
  moveSensitivity: 1.0
};

const DEFAULT_PROGRESS: Record<number, LevelProgress> = {
  1: { unlocked: true, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 },
  2: { unlocked: false, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 },
  3: { unlocked: false, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 },
  4: { unlocked: false, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 },
  5: { unlocked: false, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 },
  6: { unlocked: false, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 },
  7: { unlocked: false, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 },
  8: { unlocked: false, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 },
  9: { unlocked: false, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 },
  10: { unlocked: false, stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 },
};

export default function App() {
  // Screen router: 'menu' | 'playing' | 'level_select' | 'album' | 'shop' | 'settings'
  const [screen, setScreen] = useState<'menu' | 'playing' | 'level_select' | 'album' | 'shop' | 'settings'>('menu');

  // Persistence State
  const [progress, setProgress] = useState<Record<number, LevelProgress>>(() => {
    try {
      const saved = localStorage.getItem('romeo_parkour_progress');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROGRESS;
  });

  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('romeo_parkour_coins');
      if (saved) {
        const val = parseInt(saved, 10);
        return Math.max(val, 999999);
      }
    } catch {}
    return 999999; // Monedas infinitas por defecto
  });

  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('romeo_parkour_skins');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['default'];
  });

  const [unlockedWeapons, setUnlockedWeapons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('romeo_parkour_weapons');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['pillow'];
  });

  const [currentSkinId, setCurrentSkinId] = useState<string>('default');
  const [currentWeaponId, setCurrentWeaponId] = useState<string>('pillow');

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('romeo_parkour_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Active Game State
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [engine, setEngine] = useState<ThreeGameEngine | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // HUD and In-game feedback
  const [hudHealth, setHudHealth] = useState({ hp: 3, maxHp: 3 });
  const [hudSuspicion, setHudSuspicion] = useState(0);
  const [hudLetters, setHudLetters] = useState({ collected: 0, total: 3 });
  const [hudCoins, setHudCoins] = useState(0);
  const [alertStatus, setAlertStatus] = useState({ isAlert: false, message: '' });

  // Modals in-game
  const [isPaused, setIsPaused] = useState(false);
  const [victoryStats, setVictoryStats] = useState<{
    time: number;
    letters: number;
    coins: number;
    undetected: boolean;
  } | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('romeo_parkour_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('romeo_parkour_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('romeo_parkour_skins', JSON.stringify(unlockedSkins));
  }, [unlockedSkins]);

  useEffect(() => {
    localStorage.setItem('romeo_parkour_weapons', JSON.stringify(unlockedWeapons));
  }, [unlockedWeapons]);

  useEffect(() => {
    localStorage.setItem('romeo_parkour_settings', JSON.stringify(settings));
    sounds.soundEnabled = settings.soundEnabled;
    sounds.musicEnabled = settings.musicEnabled;
  }, [settings]);

  // Engine Lifecycle when entering 'playing' screen
  useEffect(() => {
    if (screen !== 'playing' || !containerRef.current) return;

    // Destroy existing engine if any
    if (engine) {
      engine.destroy();
    }

    setIsPaused(false);
    setVictoryStats(null);
    setGameOverReason(null);
    setAlertStatus({ isAlert: false, message: '' });

    const newEngine = new ThreeGameEngine(
      containerRef.current,
      currentLevelId,
      settings.quality,
      currentSkinId,
      currentWeaponId,
      {
        onHealthChange: (hp, maxHp) => setHudHealth({ hp, maxHp }),
        onSuspicionChange: pct => setHudSuspicion(pct),
        onLettersChange: (collected, total) => setHudLetters({ collected, total }),
        onCoinsChange: earned => setHudCoins(earned),
        onAlertStatus: (isAlert, message) => setAlertStatus({ isAlert, message }),
        onWin: stats => {
          setVictoryStats(stats);
          handleLevelCompleted(currentLevelId, stats);
        },
        onGameOver: reason => {
          setGameOverReason(reason);
        }
      }
    );

    newEngine.updateSettings(settings);
    newEngine.start();
    setEngine(newEngine);

    return () => {
      newEngine.destroy();
    };
  }, [screen, currentLevelId, currentSkinId, currentWeaponId]);

  // Sync real-time settings (sensitivity, inversion, quality) to active engine
  useEffect(() => {
    if (engine) {
      engine.updateSettings(settings);
    }
  }, [engine, settings]);

  const handleAddInfiniteCoins = () => {
    setCoins(prev => Math.max(prev + 999999, 999999));
    sounds.playVictory();
  };

  // Handle victory completion, unlock next level & give coins
  const handleLevelCompleted = (
    lvlId: number,
    stats: { time: number; letters: number; coins: number; undetected: boolean }
  ) => {
    const lvl = LEVELS_CONFIG.find(l => l.id === lvlId) || LEVELS_CONFIG[0];
    let starsEarned = 1;
    if (stats.time <= lvl.parTime) starsEarned++;
    if (stats.letters === 3 || stats.undetected) starsEarned++;

    setProgress(prev => {
      const currentProg = prev[lvlId] || { unlocked: true, stars: 0, highScore: 0, bestTime: 999, lettersCollected: 0 };
      const newStars = Math.max(currentProg.stars, starsEarned);
      const newBestTime = currentProg.bestTime === 0 ? stats.time : Math.min(currentProg.bestTime, stats.time);

      const nextId = lvlId + 1;
      const updated: Record<number, LevelProgress> = {
        ...prev,
        [lvlId]: {
          unlocked: true,
          stars: newStars,
          highScore: Math.max(currentProg.highScore, stats.coins * 10),
          bestTime: newBestTime,
          lettersCollected: Math.max(currentProg.lettersCollected, stats.letters)
        }
      };

      if (nextId <= 10) {
        updated[nextId] = {
          ...(updated[nextId] || { stars: 0, highScore: 0, bestTime: 0, lettersCollected: 0 }),
          unlocked: true
        };
      }

      return updated;
    });

    // Add coins earned in level
    setCoins(c => c + stats.coins + starsEarned * 15);
  };

  // Actions
  const handleStartGame = () => {
    // Start at highest unlocked level
    const highest = Math.max(
      ...Object.entries(progress)
        .filter(([, p]) => p.unlocked)
        .map(([id]) => parseInt(id, 10)),
      1
    );
    setCurrentLevelId(highest);
    setScreen('playing');
  };

  const handleSelectLevel = (id: number) => {
    setCurrentLevelId(id);
    setScreen('playing');
  };

  const handleNextLevel = () => {
    if (currentLevelId < 10) {
      setCurrentLevelId(c => c + 1);
      setVictoryStats(null);
    } else {
      setScreen('level_select');
    }
  };

  const handleRetry = () => {
    setVictoryStats(null);
    setGameOverReason(null);
    setIsPaused(false);
    if (engine) {
      engine.destroy();
      setEngine(null);
      // Re-trigger by toggling currentLevelId or reloading
      setCurrentLevelId(id => id);
    }
    // Force re-render game screen
    setScreen('menu');
    setTimeout(() => setScreen('playing'), 50);
  };

  const handlePause = () => {
    if (!isPaused && engine) {
      engine.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (isPaused && engine) {
      engine.resume();
      setIsPaused(false);
    }
  };

  const handleQualityChange = (q: GraphicsQuality) => {
    setSettings(s => ({ ...s, quality: q }));
    if (engine) {
      engine.setQuality(q);
    }
  };

  const handleBuySkin = (skinId: string, cost: number) => {
    if (coins >= cost) {
      setCoins(c => c - cost);
      setUnlockedSkins(s => [...s, skinId]);
      setCurrentSkinId(skinId);
    }
  };

  const handleBuyWeapon = (weaponId: string, cost: number) => {
    if (coins >= cost) {
      setCoins(c => c - cost);
      setUnlockedWeapons(w => [...w, weaponId]);
      setCurrentWeaponId(weaponId);
    }
  };

  const handleResetProgress = () => {
    localStorage.removeItem('romeo_parkour_progress');
    localStorage.removeItem('romeo_parkour_coins');
    localStorage.removeItem('romeo_parkour_skins');
    localStorage.removeItem('romeo_parkour_weapons');
    setProgress(DEFAULT_PROGRESS);
    setCoins(60);
    setUnlockedSkins(['default']);
    setUnlockedWeapons(['pillow']);
    setCurrentSkinId('default');
    setCurrentWeaponId('pillow');
    sounds.playCoin();
  };

  const totalStars = Object.values(progress).reduce((acc, p) => acc + (p.stars || 0), 0);
  const unlockedGirlsCount = Object.values(progress).filter(p => p.stars > 0).length;
  const highestUnlockedLevel = Math.max(
    ...Object.entries(progress)
      .filter(([, p]) => p.unlocked)
      .map(([id]) => parseInt(id, 10)),
    1
  );

  const currentLevelConfig = LEVELS_CONFIG.find(l => l.id === currentLevelId) || LEVELS_CONFIG[0];

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-950 font-sans select-none">
      {/* 3D Game Canvas Layer (Active when playing) */}
      <div
        ref={containerRef}
        className={`absolute inset-0 w-full h-full ${screen === 'playing' ? 'block' : 'hidden'}`}
      />

      {/* Screen: In-Game Active UI */}
      {screen === 'playing' && (
        <>
          {/* Virtual Touch Joystick & Action Buttons */}
          <TouchControls engine={engine} buttonSize={settings.joystickSize} />

          {/* Floating Game HUD */}
          <HUD
            health={hudHealth.hp}
            maxHealth={hudHealth.maxHp}
            suspicion={hudSuspicion}
            letters={hudLetters.collected}
            totalLetters={hudLetters.total}
            coins={hudCoins}
            levelTitle={currentLevelConfig.title}
            onPause={handlePause}
            alertStatus={alertStatus}
          />

          {/* Victory Modal */}
          {victoryStats && (
            <VictoryModal
              level={currentLevelConfig}
              stats={victoryStats}
              onNextLevel={handleNextLevel}
              onRetry={handleRetry}
              onMenu={() => setScreen('menu')}
              onOpenAlbum={() => setScreen('album')}
              hasNextLevel={currentLevelId < 10}
            />
          )}

          {/* Game Over Modal */}
          {gameOverReason && !victoryStats && (
            <GameOverModal
              level={currentLevelConfig}
              reason={gameOverReason}
              onRetry={handleRetry}
              onMenu={() => setScreen('menu')}
            />
          )}

          {/* Pause Modal */}
          {isPaused && !victoryStats && !gameOverReason && (
            <PauseModal
              onResume={handleResume}
              onRetry={handleRetry}
              onMenu={() => setScreen('menu')}
              quality={settings.quality}
              onQualityChange={handleQualityChange}
              cameraSensitivity={settings.cameraSensitivity ?? 1.0}
              onSensitivityChange={val => setSettings(s => ({ ...s, cameraSensitivity: val }))}
            />
          )}
        </>
      )}

      {/* Screen: Main Menu */}
      {screen === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onOpenLevelSelect={() => setScreen('level_select')}
          onOpenAlbum={() => setScreen('album')}
          onOpenShop={() => setScreen('shop')}
          onOpenSettings={() => setScreen('settings')}
          totalStars={totalStars}
          totalCoins={coins}
          unlockedGirlsCount={unlockedGirlsCount}
          highestUnlockedLevel={highestUnlockedLevel}
        />
      )}

      {/* Screen: Level Select (10 Levels) */}
      {screen === 'level_select' && (
        <LevelSelect
          progress={progress}
          onSelectLevel={handleSelectLevel}
          onClose={() => setScreen('menu')}
        />
      )}

      {/* Screen: 10 Girls Album */}
      {screen === 'album' && (
        <GirlAlbum
          progress={progress}
          onClose={() => setScreen('menu')}
          onPlayLevel={handleSelectLevel}
        />
      )}

      {/* Screen: Shop (Skins & Weapons) */}
      {screen === 'shop' && (
        <ShopModal
          coins={coins}
          unlockedSkins={unlockedSkins}
          unlockedWeapons={unlockedWeapons}
          currentSkinId={currentSkinId}
          currentWeaponId={currentWeaponId}
          onBuySkin={handleBuySkin}
          onBuyWeapon={handleBuyWeapon}
          onEquipSkin={setCurrentSkinId}
          onEquipWeapon={setCurrentWeaponId}
          onAddInfiniteCoins={handleAddInfiniteCoins}
          onClose={() => setScreen('menu')}
        />
      )}

      {/* Screen: Settings */}
      {screen === 'settings' && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={newS => setSettings(s => ({ ...s, ...newS }))}
          onResetProgress={handleResetProgress}
          onAddInfiniteCoins={handleAddInfiniteCoins}
          onClose={() => setScreen('menu')}
        />
      )}
    </div>
  );
}
