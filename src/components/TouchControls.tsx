import React, { useEffect, useRef, useState } from 'react';
import { Sword, Wind, Banana } from 'lucide-react';
import { ThreeGameEngine } from '../game/ThreeGame';

interface TouchControlsProps {
  engine: ThreeGameEngine | null;
  buttonSize?: 'small' | 'medium' | 'large';
}

export const TouchControls: React.FC<TouchControlsProps> = ({ engine, buttonSize = 'medium' }) => {
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [stickOffset, setStickOffset] = useState({ x: 0, y: 0 });
  const joystickTouchIdRef = useRef<number | null>(null);
  const cameraTouchIdRef = useRef<number | null>(null);
  const lastCameraTouchPos = useRef({ x: 0, y: 0 });

  // Keyboard controls for PC
  useEffect(() => {
    const keysPressed: Record<string, boolean> = {};

    const updateMovementFromKeys = () => {
      if (!engine) return;
      let x = 0;
      let y = 0;
      if (keysPressed['KeyW'] || keysPressed['ArrowUp']) y += 1;
      if (keysPressed['KeyS'] || keysPressed['ArrowDown']) y -= 1;
      if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) x -= 1;
      if (keysPressed['KeyD'] || keysPressed['ArrowRight']) x += 1;

      if (x !== 0 && y !== 0) {
        x *= 0.7071;
        y *= 0.7071;
      }
      engine.moveInput.x = x;
      engine.moveInput.y = y;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      keysPressed[e.code] = true;

      // Primary Attack / Combo on Space, F or Enter
      if (e.code === 'Space' || e.code === 'KeyF' || e.code === 'KeyJ') {
        e.preventDefault();
        engine?.attack();
      }
      // Dash / Evade on Shift or C
      else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyC') {
        engine?.slide();
      }
      // Banana Trap on B or E
      else if (e.code === 'KeyB' || e.code === 'KeyE') {
        engine?.dropBanana();
      }

      updateMovementFromKeys();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.code] = false;
      updateMovementFromKeys();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [engine]);

  // Touch joystick handling
  const handleTouchStart = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const screenWidth = window.innerWidth;

      if (touch.clientX < screenWidth * 0.45 && joystickTouchIdRef.current === null) {
        joystickTouchIdRef.current = touch.identifier;
        setJoystickPos({ x: touch.clientX, y: touch.clientY });
        setStickOffset({ x: 0, y: 0 });
        setJoystickActive(true);
      } else if (touch.clientX >= screenWidth * 0.45 && cameraTouchIdRef.current === null) {
        cameraTouchIdRef.current = touch.identifier;
        lastCameraTouchPos.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      if (touch.identifier === joystickTouchIdRef.current) {
        const dx = touch.clientX - joystickPos.x;
        const dy = touch.clientY - joystickPos.y;
        const maxDist = 48;
        const dist = Math.hypot(dx, dy);
        const clampedDist = Math.min(dist, maxDist);
        const angle = Math.atan2(dy, dx);

        const ox = Math.cos(angle) * clampedDist;
        const oy = Math.sin(angle) * clampedDist;
        setStickOffset({ x: ox, y: oy });

        if (engine) {
          engine.moveInput.x = ox / maxDist;
          // Dragging UP makes dy < 0, oy < 0 -> engine.moveInput.y becomes positive (moving forward)
          engine.moveInput.y = -oy / maxDist;
        }
      }

      if (touch.identifier === cameraTouchIdRef.current && engine) {
        const dx = touch.clientX - lastCameraTouchPos.current.x;
        const dy = touch.clientY - lastCameraTouchPos.current.y;
        lastCameraTouchPos.current = { x: touch.clientX, y: touch.clientY };

        const sens = engine.cameraSensitivity || 1.0;
        engine.cameraInput.x = -dx * 0.05 * sens;
        engine.cameraInput.y = dy * 0.04 * sens;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchIdRef.current) {
        joystickTouchIdRef.current = null;
        setJoystickActive(false);
        setStickOffset({ x: 0, y: 0 });
        if (engine) {
          engine.moveInput.x = 0;
          engine.moveInput.y = 0;
        }
      }
      if (touch.identifier === cameraTouchIdRef.current) {
        cameraTouchIdRef.current = null;
        if (engine) {
          engine.cameraInput.x = 0;
          engine.cameraInput.y = 0;
        }
      }
    }
  };

  const btnScale = buttonSize === 'large' ? 'w-20 h-20' : buttonSize === 'small' ? 'w-14 h-14' : 'w-16 h-16';

  return (
    <div
      className="absolute inset-0 select-none touch-none pointer-events-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Visual Virtual Joystick Indicator on touch */}
      {joystickActive && (
        <div
          className="absolute rounded-full border-2 border-white/40 bg-black/35 backdrop-blur-xs pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: joystickPos.x,
            top: joystickPos.y,
            width: 110,
            height: 110,
          }}
        >
          <div
            className="absolute rounded-full bg-linear-to-tr from-amber-400 to-rose-400 border border-white shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: 55 + stickOffset.x,
              top: 55 + stickOffset.y,
              width: 44,
              height: 44,
            }}
          />
        </div>
      )}

      {/* Helpful Key Helper Tip for PC */}
      <div className="absolute bottom-5 left-6 pointer-events-none text-white/50 text-xs flex flex-col items-start bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 hidden sm:flex">
        <span className="font-bold text-amber-300">🕹️ W A S D para caminar por la casa</span>
        <span className="text-[11px] text-zinc-300">Espacio / F: Atacar combo • Shift: Esquivar • B: Plátano</span>
      </div>

      {/* Action Buttons on bottom right */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          {/* Banana Trap Button */}
          <button
            type="button"
            onClick={() => engine?.dropBanana()}
            className={`${btnScale} rounded-full bg-amber-500/85 hover:bg-amber-400 active:scale-90 text-white font-bold flex flex-col items-center justify-center shadow-lg border-2 border-amber-300 transition-transform backdrop-blur-xs`}
            title="Soltar Cáscara de Plátano (B)"
          >
            <span className="text-xl">🍌</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Trampa</span>
          </button>

          {/* Dash / Evade Button */}
          <button
            type="button"
            onClick={() => engine?.slide()}
            className={`${btnScale} rounded-full bg-blue-600/85 hover:bg-blue-500 active:scale-90 text-white font-bold flex flex-col items-center justify-center shadow-lg border-2 border-blue-400 transition-transform backdrop-blur-xs`}
            title="Esquivar / Rodar (Shift)"
          >
            <Wind className="w-5 h-5 text-blue-200" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Esquivar</span>
          </button>
        </div>

        {/* Big Combat Attack Combo Button */}
        <button
          type="button"
          onClick={() => engine?.attack()}
          className="w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-tr from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 active:scale-90 text-white font-black flex flex-col items-center justify-center shadow-2xl border-4 border-white/90 transition-transform backdrop-blur-xs"
          title="Golpear / Combo de Combate (Espacio o F)"
        >
          <Sword className="w-7 h-7 text-white drop-shadow" />
          <span className="text-xs font-black uppercase tracking-wider mt-0.5">GOLPEAR</span>
          <span className="text-[8px] text-amber-200 font-semibold">Combo 1-2-3</span>
        </button>
      </div>
    </div>
  );
};
