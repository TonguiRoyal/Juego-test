import * as THREE from 'three';
import { GirlProfile, PlayerSkin, GraphicsQuality } from './types';

// ==============================================================
// HIGH-RESOLUTION PROCEDURAL TEXTURES (CRISP ANIME / FORTNITE PBR)
// ==============================================================

/**
 * Generates a crystal-clear, high-res anime male hero face texture
 */
export function createAnimeMaleFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth porcelain skin with soft warm lighting
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#fff6ed');
  grad.addColorStop(0.65, '#fde3cc');
  grad.addColorStop(1, '#f6c79f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft jaw & cheekbone cel shadows
  ctx.fillStyle = 'rgba(217, 130, 80, 0.22)';
  ctx.beginPath();
  ctx.moveTo(120, 440);
  ctx.quadraticCurveTo(256, 500, 392, 440);
  ctx.quadraticCurveTo(256, 465, 120, 440);
  ctx.fill();

  // Subtle anime blush under eyes
  ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
  ctx.beginPath();
  ctx.ellipse(155, 295, 36, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(357, 295, 36, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw Hero Anime Eyes
  const drawHeroEye = (cx: number, cy: number, flip: boolean) => {
    ctx.save();
    ctx.translate(cx, cy);
    if (flip) ctx.scale(-1, 1);

    // Eyelid crease
    ctx.strokeStyle = 'rgba(40, 25, 20, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -32, 42, -2.4, -0.7);
    ctx.stroke();

    // Dark sharp upper anime eyeliner
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-54, -14);
    ctx.quadraticCurveTo(-5, -46, 56, -18);
    ctx.lineTo(46, -6);
    ctx.quadraticCurveTo(-5, -28, -44, -6);
    ctx.closePath();
    ctx.fill();

    // Eye white with soft upper shadow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(4, 6, 42, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.beginPath();
    ctx.ellipse(4, -6, 42, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vibrant Electric Blue / Cyan Iris
    const irisGrad = ctx.createLinearGradient(0, -28, 0, 40);
    irisGrad.addColorStop(0, '#0284c7');
    irisGrad.addColorStop(0.35, '#0ea5e9');
    irisGrad.addColorStop(0.7, '#38bdf8');
    irisGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(5, 7, 26, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner glowing ring
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(5, 7, 18, 22, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Pupil
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.ellipse(5, 7, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight sparkles
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(14, -6, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-5, 16, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Lower eye stroke
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(5, 10, 34, 0.45, 2.45);
    ctx.stroke();

    ctx.restore();
  };

  drawHeroEye(160, 230, false);
  drawHeroEye(352, 230, true);

  // Confident manga eyebrows
  const drawEyebrow = (startX: number, endX: number, y1: number, y2: number) => {
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(startX, y1);
    ctx.quadraticCurveTo((startX + endX) / 2, y1 - 10, endX, y2);
    ctx.quadraticCurveTo((startX + endX) / 2, y1 - 2, startX, y1 + 10);
    ctx.closePath();
    ctx.fill();
  };
  drawEyebrow(95, 225, 165, 188);
  drawEyebrow(417, 287, 165, 188);

  // Sculpted anime nose line
  ctx.strokeStyle = 'rgba(180, 83, 9, 0.75)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(254, 280);
  ctx.lineTo(256, 316);
  ctx.lineTo(265, 318);
  ctx.stroke();

  // Confident anime smirk
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(226, 372);
  ctx.quadraticCurveTo(256, 394, 290, 368);
  ctx.stroke();

  // Lip highlight
  ctx.strokeStyle = '#fda4af';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(246, 398);
  ctx.lineTo(266, 398);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * Generates high-res anime female face texture with blush and sparkling eyes
 */
export function createAnimeFemaleFaceTexture(girl?: GirlProfile): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth porcelain skin
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#fff8f6');
  grad.addColorStop(0.65, '#fdeae7');
  grad.addColorStop(1, '#fcd7d4');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft rosy cheeks
  ctx.fillStyle = 'rgba(251, 113, 133, 0.42)';
  ctx.beginPath();
  ctx.ellipse(145, 295, 46, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(367, 295, 46, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  // Manga blush hatching
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.65)';
  ctx.lineWidth = 2.5;
  for (let i = -16; i <= 16; i += 10) {
    ctx.beginPath();
    ctx.moveTo(145 + i - 6, 284);
    ctx.lineTo(145 + i + 6, 306);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(367 + i - 6, 284);
    ctx.lineTo(367 + i + 6, 306);
    ctx.stroke();
  }

  // Sparkling Anime Heroine Eyes
  const drawHeroineEye = (cx: number, cy: number, flip: boolean) => {
    ctx.save();
    ctx.translate(cx, cy);
    if (flip) ctx.scale(-1, 1);

    // Eyelid line
    ctx.strokeStyle = 'rgba(120, 50, 80, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -36, 44, -2.4, -0.7);
    ctx.stroke();

    // Curved upper anime eyelashes
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-54, -12);
    ctx.quadraticCurveTo(-4, -58, 58, -18);
    ctx.quadraticCurveTo(66, -8, 48, -4);
    ctx.quadraticCurveTo(-4, -36, -44, -4);
    ctx.closePath();
    ctx.fill();

    // Eye white
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(4, 8, 45, 46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
    ctx.beginPath();
    ctx.ellipse(4, -8, 45, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Large Sparkling Iris
    const irisColor = girl?.accentColor || '#ec4899';
    const irisGrad = ctx.createLinearGradient(0, -36, 0, 48);
    irisGrad.addColorStop(0, '#500724');
    irisGrad.addColorStop(0.3, irisColor);
    irisGrad.addColorStop(0.7, '#f472b6');
    irisGrad.addColorStop(1, '#fdf2f8');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(4, 9, 32, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deep pupil
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(4, 9, 16, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Multiple specular sparkles (anime signature sparkle)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(16, -8, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-8, 22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(18, 24, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Soft lower lash
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(4, 14, 38, 0.5, 2.4);
    ctx.stroke();

    ctx.restore();
  };

  drawHeroineEye(160, 235, false);
  drawHeroineEye(352, 235, true);

  // Soft gentle eyebrows
  ctx.strokeStyle = '#44403c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(160, 195, 62, -2.1, -1.05);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(352, 195, 62, -2.05, -1.0);
  ctx.stroke();

  // Cute tiny anime nose
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(256, 302, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Sweet smiling lips
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(256, 350, 25, 0.25, Math.PI - 0.25);
  ctx.stroke();

  // Lower lip gloss
  ctx.strokeStyle = '#fda4af';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(256, 362, 14, 0.4, Math.PI - 0.4);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * Procedural Back Bling / Hoodie Back Graphic Texture
 */
export function createHoodieBackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 0, 512, 512);

  // Stylized graffiti / street logo
  const grad = ctx.createLinearGradient(100, 100, 400, 400);
  grad.addColorStop(0, '#f59e0b');
  grad.addColorStop(0.5, '#ef4444');
  grad.addColorStop(1, '#ec4899');

  ctx.strokeStyle = grad;
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';

  // Heart-Wing emblem
  ctx.beginPath();
  ctx.moveTo(256, 320);
  ctx.bezierCurveTo(200, 240, 140, 180, 200, 140);
  ctx.bezierCurveTo(240, 110, 256, 170, 256, 180);
  ctx.bezierCurveTo(256, 170, 272, 110, 312, 140);
  ctx.bezierCurveTo(372, 180, 312, 240, 256, 320);
  ctx.stroke();

  // Cyber crosshairs / speed lines
  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ROMEO // 01', 256, 390);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/**
 * Dad furious face texture
 */
export function createDadFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#fde2cc';
  ctx.fillRect(0, 0, 512, 512);

  // Flushed red angry cheeks
  ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.beginPath();
  ctx.ellipse(140, 290, 50, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(372, 290, 50, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Furious bushy cartoon eyebrows
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.moveTo(90, 180);
  ctx.lineTo(240, 230);
  ctx.lineTo(235, 200);
  ctx.lineTo(90, 155);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(422, 180);
  ctx.lineTo(272, 230);
  ctx.lineTo(277, 200);
  ctx.lineTo(422, 155);
  ctx.fill();

  // Wide furious rolling cartoon eyes
  const drawDadEye = (cx: number, cy: number) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Bloodshot veins
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy);
    ctx.lineTo(cx - 15, cy - 8);
    ctx.stroke();

    // Pupil
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx + 4, cy, 14, 0, Math.PI * 2);
    ctx.fill();
  };
  drawDadEye(165, 235);
  drawDadEye(347, 235);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/**
 * Mom furious face texture
 */
export function createMomFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffdfba';
  ctx.fillRect(0, 0, 512, 512);

  // Sharp arched angry cat-eye brows
  ctx.strokeStyle = '#292524';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(110, 175);
  ctx.quadraticCurveTo(180, 140, 240, 210);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(402, 175);
  ctx.quadraticCurveTo(332, 140, 272, 210);
  ctx.stroke();

  // Screaming open mouth
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.ellipse(256, 370, 48, 36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Teeth
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(232, 344, 48, 14);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// ==============================================================
// FORTNITE HERO RIG INTERFACE
// ==============================================================

export interface FortniteHeroRig {
  group: THREE.Group;
  torsoGroup: THREE.Group;
  headGroup: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftElbow: THREE.Group;
  rightElbow: THREE.Group;
  leftKnee: THREE.Group;
  rightKnee: THREE.Group;
  hoodMesh?: THREE.Object3D;
  backpackMesh?: THREE.Object3D;
}

// ==============================================================
// BUILD FORTNITE ACTION HERO (ROMEO)
// Anatomical streetwear model with articulated knees and elbows
// ==============================================================

export function buildFortniteHero(
  skin: PlayerSkin,
  quality: GraphicsQuality
): FortniteHeroRig {
  const group = new THREE.Group();

  const faceTex = createAnimeMaleFaceTexture();
  const backLogoTex = createHoodieBackTexture();

  // Premium PBR Materials
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfde3cc,
    roughness: 0.38,
    metalness: 0.04
  });

  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTex,
    roughness: 0.36,
    metalness: 0.04
  });

  const hoodieMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skin.shirtColor),
    roughness: 0.45,
    metalness: 0.08
  });

  const backLogoMat = new THREE.MeshStandardMaterial({
    map: backLogoTex,
    roughness: 0.4,
    metalness: 0.1
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skin.pantsColor),
    roughness: 0.5,
    metalness: 0.06
  });

  const sneakerMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.3,
    metalness: 0.05
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.35,
    metalness: 0.2
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x27170c,
    roughness: 0.35,
    metalness: 0.12
  });

  // 1. TORSO: Athletic V-Taper, Streetwear Hoodie, Back Graphic & Tactical Pack
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.85, 0);

  // Anatomical V-Taper Torso with Lathe Geometry
  const torsoCurvePoints: THREE.Vector2[] = [
    new THREE.Vector2(0.18, 0.0),   // Waist
    new THREE.Vector2(0.21, 0.18),  // Lower rib
    new THREE.Vector2(0.26, 0.38),  // Mid chest
    new THREE.Vector2(0.28, 0.52),  // Broad shoulders / pecs
    new THREE.Vector2(0.22, 0.64),  // Clavicles
    new THREE.Vector2(0.09, 0.68)   // Neck base
  ];
  const torsoGeo = new THREE.LatheGeometry(torsoCurvePoints, 24);
  const torsoMesh = new THREE.Mesh(torsoGeo, hoodieMat);
  torsoMesh.scale.set(1.12, 1.0, 0.82); // Natural human chest depth
  torsoMesh.castShadow = quality !== 'low';
  torsoGroup.add(torsoMesh);

  // Streetwear Graphic Badge on the back of the hoodie (Iconic Fortnite element!)
  const backBadge = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.32), backLogoMat);
  backBadge.position.set(0, 0.38, -0.23);
  backBadge.rotation.y = Math.PI;
  torsoGroup.add(backBadge);

  // 3D Sculpted Hood draped on the back of the neck
  const hoodGroup = new THREE.Group();
  hoodGroup.position.set(0, 0.58, -0.12);

  const hoodRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.065, 10, 20, Math.PI * 1.3),
    hoodieMat
  );
  hoodRing.rotation.x = Math.PI * 0.4;
  hoodRing.rotation.z = Math.PI * 0.85;

  const hoodFold = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 12, 12, 0, Math.PI, 0, Math.PI * 0.85),
    hoodieMat
  );
  hoodFold.position.set(0, -0.06, -0.05);
  hoodFold.rotation.x = Math.PI * 0.6;
  hoodGroup.add(hoodRing, hoodFold);
  torsoGroup.add(hoodGroup);

  // White inner collar & front zipper seam
  const zipper = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.48, 8),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
  );
  zipper.position.set(0, 0.35, 0.23);
  torsoGroup.add(zipper);

  // Drawstrings hanging in front
  const stringL = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  stringL.position.set(-0.06, 0.42, 0.22);
  const stringR = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  stringR.position.set(0.06, 0.42, 0.22);
  torsoGroup.add(stringL, stringR);

  // Tactical Back Bling: Mini Cyber-Backpack on player's back
  const backpackMesh = new THREE.Group();
  backpackMesh.position.set(0, 0.32, -0.26);

  const packBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.12, 0.22, 10, 14),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.4 })
  );
  packBody.scale.set(1.15, 1.0, 0.6);

  const packStripe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.24, 8),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  packStripe.position.set(0, 0, -0.07);

  backpackMesh.add(packBody, packStripe);
  torsoGroup.add(backpackMesh);

  // Slender Anatomical Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.092, 0.18, 16), skinMat);
  neck.position.set(0, 0.72, 0);
  torsoGroup.add(neck);

  // Tactical Belt with Golden Buckle
  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.21, 0.06, 22),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 })
  );
  belt.position.set(0, 0.02, 0);

  const buckle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.03, 8),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 })
  );
  buckle.rotation.x = Math.PI / 2;
  buckle.position.set(0, 0.02, 0.21);
  torsoGroup.add(belt, buckle);

  group.add(torsoGroup);

  // 2. HEAD & FACE: Sculpted 3D Anime Head + Volumetric Swept Hair
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.68, 0);

  // Sculpted head base with tapered chin
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), skinMat);
  headMesh.scale.set(0.96, 1.15, 1.05);
  headMesh.castShadow = quality !== 'low';
  headGroup.add(headMesh);

  // Dedicated curved front face plane (Eliminates spherical texture stretching!)
  const facePlaneGeo = new THREE.CylinderGeometry(0.195, 0.195, 0.32, 16, 1, true, -Math.PI * 0.32, Math.PI * 0.64);
  const facePlane = new THREE.Mesh(facePlaneGeo, faceMat);
  facePlane.position.set(0, 0.02, 0.02);
  facePlane.scale.set(0.98, 1.12, 1.04);
  headGroup.add(facePlane);

  // Stylized 3D Ears with Gaming Earbud
  const earL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), skinMat);
  earL.position.set(-0.2, 0.02, -0.01);
  earL.scale.set(0.6, 1.2, 1.0);

  const earR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), skinMat);
  earR.position.set(0.2, 0.02, -0.01);
  earR.scale.set(0.6, 1.2, 1.0);

  const earbud = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  earbud.position.set(-0.21, 0.01, 0.02);
  headGroup.add(earL, earR, earbud);

  // Volumetric Multi-Layered 3D Hair (Fortnite hero hairstyle)
  const hairGroup = new THREE.Group();
  const hairCrown = new THREE.Mesh(new THREE.SphereGeometry(0.215, 20, 20), hairMat);
  hairCrown.position.set(0, 0.06, -0.02);
  hairCrown.scale.set(1.0, 1.1, 1.08);
  hairGroup.add(hairCrown);

  // Layered swept locks / bangs
  const createHairLock = (pos: [number, number, number], rot: [number, number, number], scale: [number, number, number]) => {
    const lock = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.32, 6), hairMat);
    lock.position.set(...pos);
    lock.rotation.set(...rot);
    lock.scale.set(...scale);
    return lock;
  };
  hairGroup.add(createHairLock([0, 0.22, 0.16], [-0.55, 0, 0], [1.1, 1.2, 1.1]));
  hairGroup.add(createHairLock([-0.11, 0.18, 0.15], [-0.4, 0.28, -0.3], [1.0, 1.1, 1.0]));
  hairGroup.add(createHairLock([0.11, 0.18, 0.15], [-0.4, -0.28, 0.3], [1.0, 1.1, 1.0]));
  hairGroup.add(createHairLock([-0.18, 0.12, 0.08], [-0.2, 0.6, -0.4], [0.95, 1.0, 0.95]));
  hairGroup.add(createHairLock([0.18, 0.12, 0.08], [-0.2, -0.6, 0.4], [0.95, 1.0, 0.95]));
  hairGroup.add(createHairLock([0, 0.25, -0.14], [0.6, 0, 0], [1.1, 1.1, 1.1]));
  headGroup.add(hairGroup);

  // Head accessories per skin
  if (skin.headExtra === 'ninja_mask') {
    const headband = new THREE.Mesh(
      new THREE.TorusGeometry(0.21, 0.035, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    headband.position.set(0, 0.11, 0);
    headband.rotation.x = Math.PI / 2;
    headGroup.add(headband);
  } else if (skin.headExtra === 'bear_ears') {
    const ear1 = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    ear1.position.set(-0.18, 0.26, 0);
    const ear2 = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    ear2.position.set(0.18, 0.26, 0);
    headGroup.add(ear1, ear2);
  }

  group.add(headGroup);

  // 3. ARTICULATED ARMS: Shoulder, Bicep, Elbow Joint, Forearm, Sculpted Hands
  const buildArticulatedArm = (side: number) => {
    const shoulderGroup = new THREE.Group();
    shoulderGroup.position.set(side * 0.36, 1.42, 0);

    // Deltoid muscle with hoodie sleeve
    const deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), hoodieMat);
    deltoid.scale.set(1.15, 1.25, 1.05);

    // Upper Arm (Bicep)
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.068, 0.26, 14), hoodieMat);
    upperArm.position.set(0, -0.16, 0);

    // Elbow Joint Group (Bends during animation!)
    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(0, -0.29, 0);

    // Forearm (Slightly rolled up sleeve with skin showing)
    const sleeveCuff = new THREE.Mesh(
      new THREE.TorusGeometry(0.07, 0.015, 6, 16),
      hoodieMat
    );
    sleeveCuff.rotation.x = Math.PI / 2;
    sleeveCuff.position.set(0, -0.04, 0);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.052, 0.24, 14), skinMat);
    forearm.position.set(0, -0.15, 0);

    // Tactical Smartwatch on left wrist
    if (side === -1) {
      const watch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.058, 0.058, 0.04, 14),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 })
      );
      watch.position.set(0, -0.22, 0);
      const screen = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      screen.position.set(0, -0.22, 0.05);
      elbowGroup.add(watch, screen);
    }

    // Sculpted Tactical Hand (ZERO BOXES!)
    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.29, 0);

    // Palm (Smooth rounded capsule)
    const palm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.045, 0.065, 8, 10),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 }) // Tactical fingerless glove
    );
    palm.scale.set(1.1, 1.0, 0.65);

    // Thumb
    const thumb = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.018, 0.05, 6, 6),
      skinMat
    );
    thumb.position.set(-side * 0.045, 0.01, 0.02);
    thumb.rotation.z = side * 0.5;

    // 4 Articulated fingers
    const fingersGroup = new THREE.Group();
    for (let f = 0; f < 4; f++) {
      const finger = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.014, 0.06, 6, 6),
        skinMat
      );
      finger.position.set((f - 1.5) * 0.026, -0.055, 0);
      fingersGroup.add(finger);
    }

    handGroup.add(palm, thumb, fingersGroup);
    elbowGroup.add(sleeveCuff, forearm, handGroup);
    shoulderGroup.add(deltoid, upperArm, elbowGroup);

    return { shoulderGroup, elbowGroup };
  };

  const leftArmData = buildArticulatedArm(-1);
  const rightArmData = buildArticulatedArm(1);
  group.add(leftArmData.shoulderGroup, rightArmData.shoulderGroup);

  // 4. ARTICULATED LEGS: Hip, Thigh, Knee Joint, Calf, High-Top Sneaker
  const buildArticulatedLeg = (side: number) => {
    const hipGroup = new THREE.Group();
    hipGroup.position.set(side * 0.15, 0.85, 0);

    // Athletic Thigh with Jogger fabric
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.076, 0.4, 16), pantsMat);
    thigh.position.set(0, -0.2, 0);

    // Side pocket on right leg
    if (side === 1) {
      const pocket = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.035, 0.1, 6, 8),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      pocket.position.set(0.09, -0.18, 0);
      hipGroup.add(pocket);
    }

    // Knee Joint Group (Bends backward naturally during run!)
    const kneeGroup = new THREE.Group();
    kneeGroup.position.set(0, -0.4, 0);

    // Defined knee cap
    const kneeCap = new THREE.Mesh(new THREE.SphereGeometry(0.072, 10, 10), pantsMat);
    kneeCap.position.set(0, 0, 0.02);

    // Tapered Calf with Jogger Ribbed Cuff
    const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.052, 0.38, 16), pantsMat);
    calf.position.set(0, -0.19, 0);

    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.054, 0.015, 6, 16), accentMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(0, -0.37, 0);

    // HIGH-TOP FORTNITE SNEAKER (Jordan/Yeezy Style - NO BOXES!)
    const sneakerGroup = new THREE.Group();
    sneakerGroup.position.set(0, -0.42, 0.06);

    // Aerodynamic Curved Rubber Sole
    const sole = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.075, 0.22, 10, 14),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
    );
    sole.rotation.x = Math.PI / 2;
    sole.scale.set(1.15, 0.45, 1.25);
    sole.position.set(0, 0.02, 0);

    // White Midsole cushion
    const midsole = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.072, 0.2, 8, 12),
      sneakerMat
    );
    midsole.rotation.x = Math.PI / 2;
    midsole.scale.set(1.1, 0.4, 1.2);
    midsole.position.set(0, 0.05, 0);

    // Colored Upper with Curved Toe Bumper
    const upper = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.065, 0.16, 8, 12),
      accentMat
    );
    upper.rotation.x = Math.PI / 2;
    upper.scale.set(1.05, 0.7, 1.1);
    upper.position.set(0, 0.1, 0.03);

    // Ankle Collar & Tongue
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.068, 0.1, 14),
      sneakerMat
    );
    collar.position.set(0, 0.14, -0.03);

    sneakerGroup.add(sole, midsole, upper, collar);
    kneeGroup.add(kneeCap, calf, cuff, sneakerGroup);
    hipGroup.add(thigh, kneeGroup);

    return { hipGroup, kneeGroup };
  };

  const leftLegData = buildArticulatedLeg(-1);
  const rightLegData = buildArticulatedLeg(1);
  group.add(leftLegData.hipGroup, rightLegData.hipGroup);

  return {
    group,
    torsoGroup,
    headGroup,
    leftArm: leftArmData.shoulderGroup,
    rightArm: rightArmData.shoulderGroup,
    leftLeg: leftLegData.hipGroup,
    rightLeg: rightLegData.hipGroup,
    leftElbow: leftArmData.elbowGroup,
    rightElbow: rightArmData.elbowGroup,
    leftKnee: leftLegData.kneeGroup,
    rightKnee: rightLegData.kneeGroup,
    hoodMesh: hoodGroup,
    backpackMesh
  };
}

// ==============================================================
// GORGEOUS FORTNITE-STYLE ANIME HEROINE (THE 10 GIRLS)
// Slender feminine silhouette, volumetric flowing hair & cute streetwear
// ==============================================================

export function buildFortniteHeroine(
  girl: GirlProfile,
  quality: GraphicsQuality
): {
  group: THREE.Group;
  wavingArm: THREE.Group;
  torsoGroup: THREE.Group;
  headGroup: THREE.Group;
  hairGroup: THREE.Group;
} {
  const group = new THREE.Group();

  const faceTex = createAnimeFemaleFaceTexture(girl);

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xffeae0,
    roughness: 0.35,
    metalness: 0.02
  });

  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTex,
    roughness: 0.34,
    metalness: 0.02
  });

  const outfitMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(girl.color),
    roughness: 0.42,
    metalness: 0.08
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(girl.accentColor),
    roughness: 0.35,
    metalness: 0.15
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(girl.accentColor),
    roughness: 0.32,
    metalness: 0.16
  });

  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.35
  });

  // 1. SLENDER FEMININE TORSO: Cropped Pastel Hoodie / Blouse
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.85, 0);

  // Graceful hourglass lathe curve
  const torsoPoints: THREE.Vector2[] = [
    new THREE.Vector2(0.14, 0.0),   // Slender waist
    new THREE.Vector2(0.16, 0.16),  // Mid torso
    new THREE.Vector2(0.19, 0.32),  // Bust curve
    new THREE.Vector2(0.20, 0.45),  // Upper chest / shoulders
    new THREE.Vector2(0.15, 0.54),  // Delicate clavicles
    new THREE.Vector2(0.065, 0.58)  // Slender neck base
  ];
  const torsoGeo = new THREE.LatheGeometry(torsoPoints, 24);
  const torsoMesh = new THREE.Mesh(torsoGeo, outfitMat);
  torsoMesh.scale.set(1.0, 1.0, 0.78);
  torsoMesh.castShadow = quality !== 'low';
  torsoGroup.add(torsoMesh);

  // Cute cropped hoodie hem & midriff
  const midriff = new THREE.Mesh(new THREE.CylinderGeometry(0.138, 0.142, 0.06, 20), skinMat);
  midriff.position.set(0, -0.02, 0);
  torsoGroup.add(midriff);

  // Pleated Flared Skirt with contrasting trim ribbon
  const skirtGroup = new THREE.Group();
  skirtGroup.position.set(0, -0.04, 0);

  const skirtCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.38, 0.32, 24),
    accentMat
  );
  skirtCone.position.set(0, -0.14, 0);

  const skirtTrim = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.02, 6, 24),
    whiteMat
  );
  skirtTrim.rotation.x = Math.PI / 2;
  skirtTrim.position.set(0, -0.3, 0);

  skirtGroup.add(skirtCone, skirtTrim);
  torsoGroup.add(skirtGroup);

  // Slender delicate neck & choker necklace
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.072, 0.16, 16), skinMat);
  neck.position.set(0, 0.62, 0);

  const choker = new THREE.Mesh(
    new THREE.TorusGeometry(0.066, 0.012, 6, 16),
    new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 })
  );
  choker.rotation.x = Math.PI / 2;
  choker.position.set(0, 0.6, 0);

  const heartCharm = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
  heartCharm.position.set(0, 0.6, 0.07);
  torsoGroup.add(neck, choker, heartCharm);

  group.add(torsoGroup);

  // 2. CUTE ANIME HEAD & VOLUMETRIC FLOWING HAIR
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.58, 0);

  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), skinMat);
  headMesh.scale.set(1.0, 1.1, 1.05);
  headMesh.castShadow = quality !== 'low';
  headGroup.add(headMesh);

  // Dedicated curved front face plane (Crisp, zero distortion!)
  const facePlaneGeo = new THREE.CylinderGeometry(0.198, 0.198, 0.32, 16, 1, true, -Math.PI * 0.32, Math.PI * 0.64);
  const facePlane = new THREE.Mesh(facePlaneGeo, faceMat);
  facePlane.position.set(0, 0.02, 0.02);
  facePlane.scale.set(1.0, 1.08, 1.04);
  headGroup.add(facePlane);

  // Volumetric Anime Hairstyle (Twin-Tails + Ahoge + Bangs)
  const hairGroup = new THREE.Group();
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.218, 20, 20), hairMat);
  hairCap.position.set(0, 0.05, -0.02);
  hairCap.scale.set(1.02, 1.08, 1.05);
  hairGroup.add(hairCap);

  // Soft Frontal Bangs
  for (let b = -2; b <= 2; b++) {
    const bang = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.22, 6), hairMat);
    bang.position.set(b * 0.07, 0.14, 0.16);
    bang.rotation.x = -0.4;
    bang.rotation.z = -b * 0.15;
    hairGroup.add(bang);
  }

  // Cute Ahoge (playful curved hair strand on top)
  const ahogeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.22, 0.04),
    new THREE.Vector3(0.04, 0.34, 0.08),
    new THREE.Vector3(0.1, 0.4, 0.02),
    new THREE.Vector3(0.06, 0.44, -0.04)
  ]);
  const ahoge = new THREE.Mesh(new THREE.TubeGeometry(ahogeCurve, 12, 0.018, 6, false), hairMat);
  hairGroup.add(ahoge);

  // Volumetric Flowing Twin-Tails
  const buildTwinTail = (side: number) => {
    const tailGroup = new THREE.Group();
    tailGroup.position.set(side * 0.22, 0.14, -0.06);

    // Cute ribbon scrunchie
    const scrunchie = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.02, 6, 12), whiteMat);
    tailGroup.add(scrunchie);

    // Curved flowing ponytail strand
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(side * 0.12, -0.15, -0.05),
      new THREE.Vector3(side * 0.2, -0.42, 0.04),
      new THREE.Vector3(side * 0.16, -0.68, -0.02)
    ]);
    const tailMesh = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 16, 0.065, 8, false), hairMat);
    tailGroup.add(tailMesh);

    return tailGroup;
  };
  hairGroup.add(buildTwinTail(-1), buildTwinTail(1));

  // Cat-Ear Gaming Headset (Gamer girl aesthetic!)
  const headset = new THREE.Group();
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.02, 6, 20, Math.PI), new THREE.MeshStandardMaterial({ color: 0x18181b }));
  band.rotation.z = Math.PI;
  band.position.set(0, 0.12, 0);

  const ear1 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 4), accentMat);
  ear1.position.set(-0.16, 0.32, 0);
  ear1.rotation.z = 0.25;

  const ear2 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 4), accentMat);
  ear2.position.set(0.16, 0.32, 0);
  ear2.rotation.z = -0.25;

  headset.add(band, ear1, ear2);
  headGroup.add(hairGroup, headset);
  group.add(headGroup);

  // 3. SLENDER FEMININE ARMS (With Gentle Waving Animation)
  const armL = new THREE.Group();
  armL.position.set(-0.28, 1.35, 0);
  const armMeshL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.042, 0.46, 14), skinMat);
  armMeshL.position.set(0, -0.22, 0);
  const bracelet = new THREE.Mesh(new THREE.TorusGeometry(0.046, 0.012, 6, 12), accentMat);
  bracelet.rotation.x = Math.PI / 2;
  bracelet.position.set(0, -0.38, 0);
  armL.add(armMeshL, bracelet);

  // Right Waving Arm
  const wavingArm = new THREE.Group();
  wavingArm.position.set(0.28, 1.35, 0);
  wavingArm.name = 'wavingArm';

  const armMeshR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.042, 0.46, 14), skinMat);
  armMeshR.position.set(0, 0.2, 0);
  wavingArm.rotation.z = -Math.PI / 3.8;

  // Slender cute hand waving
  const handR = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.06, 6, 8), skinMat);
  handR.position.set(0, 0.44, 0);
  wavingArm.add(armMeshR, handR);

  group.add(armL, wavingArm);

  // 4. ELEGANT SCULPTED LEGS with Thigh-High Socks & Platform Sneakers
  const buildHeroineLeg = (side: number) => {
    const legGrp = new THREE.Group();
    legGrp.position.set(side * 0.12, 0.82, 0);

    // Thigh with smooth anime curvature
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.062, 0.4, 16), skinMat);
    thigh.position.set(0, -0.2, 0);

    // Thigh-High Sock with athletic stripes
    const sock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.048, 0.42, 16),
      whiteMat
    );
    sock.position.set(0, -0.48, 0);

    const stripe = new THREE.Mesh(
      new THREE.TorusGeometry(0.069, 0.012, 6, 16),
      accentMat
    );
    stripe.rotation.x = Math.PI / 2;
    stripe.position.set(0, -0.36, 0);

    // Platform Chunky Streetwear Sneaker (Cute pastel style!)
    const sneakerGrp = new THREE.Group();
    sneakerGrp.position.set(0, -0.72, 0.04);

    const sole = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.065, 0.18, 8, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    sole.rotation.x = Math.PI / 2;
    sole.scale.set(1.1, 0.55, 1.15);
    sole.position.set(0, 0.03, 0);

    const upper = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.058, 0.14, 8, 10),
      accentMat
    );
    upper.rotation.x = Math.PI / 2;
    upper.scale.set(1.05, 0.65, 1.1);
    upper.position.set(0, 0.08, 0.02);

    sneakerGrp.add(sole, upper);
    legGrp.add(thigh, sock, stripe, sneakerGrp);
    return legGrp;
  };

  group.add(buildHeroineLeg(-1), buildHeroineLeg(1));

  return { group, wavingArm, torsoGroup, headGroup, hairGroup };
}

// ==============================================================
// COMEDIC ANIMATED PAPÁ (FORTNITE / PIXAR STYLE)
// Funny stout dad, animated eyes, bouncy mustache & Chancla
// ==============================================================

export function buildStylizedDad(
  isMega: boolean,
  quality: GraphicsQuality
): THREE.Group {
  const dadGrp = new THREE.Group();

  const faceTex = createDadFaceTexture();

  const poloMat = new THREE.MeshStandardMaterial({
    color: isMega ? 0xb91c1c : 0x0284c7,
    roughness: 0.45,
    metalness: 0.05
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfde2cc,
    roughness: 0.42
  });

  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTex,
    roughness: 0.4
  });

  const jeansMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.6
  });

  // Plump rounded dad body
  const torsoPoints: THREE.Vector2[] = [
    new THREE.Vector2(0.34, 0.0),
    new THREE.Vector2(0.44, 0.22),
    new THREE.Vector2(0.40, 0.45),
    new THREE.Vector2(0.33, 0.65),
    new THREE.Vector2(0.14, 0.72)
  ];
  const torso = new THREE.Mesh(new THREE.LatheGeometry(torsoPoints, 22), poloMat);
  torso.position.y = 0.72;
  torso.scale.set(1.18, 1.0, 1.12);
  torso.castShadow = quality !== 'low';
  dadGrp.add(torso);

  // Polo collar & 2 white buttons
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 6, 16), poloMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 1.42, 0);

  const button1 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  button1.rotation.x = Math.PI / 2;
  button1.position.set(0, 1.34, 0.42);

  const button2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  button2.rotation.x = Math.PI / 2;
  button2.position.set(0, 1.25, 0.43);
  dadGrp.add(collar, button1, button2);

  // Head with Dad Face Plane
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.62, 0);

  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20), skinMat);
  headGroup.add(headMesh);

  // Front face plane
  const facePlaneGeo = new THREE.CylinderGeometry(0.258, 0.258, 0.38, 16, 1, true, -Math.PI * 0.32, Math.PI * 0.64);
  const facePlane = new THREE.Mesh(facePlaneGeo, faceMat);
  facePlane.position.set(0, 0.02, 0.02);
  headGroup.add(facePlane);

  // Combed balding hair strands
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.6 });
  const hairSideL = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.16, 6, 8), hairMat);
  hairSideL.position.set(-0.25, 0.08, -0.05);
  const hairSideR = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.16, 6, 8), hairMat);
  hairSideR.position.set(0.25, 0.08, -0.05);
  headGroup.add(hairSideL, hairSideR);

  // Bushy Handlebar 3D Mustache (Bounces comically!)
  const stacheCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.18, 0, 0),
    new THREE.Vector3(-0.09, 0.04, 0.04),
    new THREE.Vector3(0, 0.02, 0.06),
    new THREE.Vector3(0.09, 0.04, 0.04),
    new THREE.Vector3(0.18, 0, 0)
  ]);
  const stache = new THREE.Mesh(new THREE.TubeGeometry(stacheCurve, 14, 0.045, 8, false), hairMat);
  stache.position.set(0, -0.06, 0.25);
  stache.name = 'dadMustache';
  headGroup.add(stache);

  // Glasses
  const glassesMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
  const lensL = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.016, 6, 16), glassesMat);
  lensL.position.set(-0.11, 0.04, 0.26);
  const lensR = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.016, 6, 16), glassesMat);
  lensR.position.set(0.11, 0.04, 0.26);
  headGroup.add(lensL, lensR);

  dadGrp.add(headGroup);

  // Arms: Right arm holding the legendary Aerodynamic Chancla
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.46, 14), poloMat);
  armL.position.set(-0.52, 1.25, 0);

  const armR = new THREE.Group();
  armR.position.set(0.52, 1.25, 0);
  const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.46, 14), poloMat);
  armRMesh.position.y = -0.16;

  // AERODYNAMIC CHANCLA (Curved Sandal - NO FLAT BOX!)
  const chanclaGrp = new THREE.Group();
  chanclaGrp.position.set(0, -0.42, 0.16);

  const chanclaSole = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.11, 0.32, 8, 12),
    new THREE.MeshStandardMaterial({
      color: isMega ? 0xfacc15 : 0xdc2626,
      roughness: 0.3,
      metalness: 0.1
    })
  );
  chanclaSole.rotation.x = Math.PI / 2;
  chanclaSole.scale.set(1.1, 0.3, 1.0);

  const chanclaStrap = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.035, 6, 12, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  chanclaStrap.rotation.x = -Math.PI / 2;
  chanclaStrap.position.set(0, 0.05, 0.04);
  chanclaGrp.add(chanclaSole, chanclaStrap);

  armR.add(armRMesh, chanclaGrp);
  dadGrp.add(armL, armR);

  // Legs with socks and dad sandals
  const buildDadLeg = (side: number) => {
    const legGrp = new THREE.Group();
    legGrp.position.set(side * 0.18, 0.65, 0);

    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.088, 0.46, 14), jeansMat);
    leg.position.set(0, -0.23, 0);

    const shoe = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.09, 0.26, 8, 10),
      new THREE.MeshStandardMaterial({ color: 0x475569 })
    );
    shoe.rotation.x = Math.PI / 2;
    shoe.scale.set(1.1, 0.45, 1.0);
    shoe.position.set(0, -0.48, 0.06);

    legGrp.add(leg, shoe);
    return legGrp;
  };

  dadGrp.add(buildDadLeg(-1), buildDadLeg(1));

  return dadGrp;
}

// ==============================================================
// COMEDIC ANIMATED MAMÁ (FORTNITE / PIXAR STYLE)
// Expressive mom, apron, hair curlers & wooden rolling pin
// ==============================================================

export function buildStylizedMom(quality: GraphicsQuality): THREE.Group {
  const momGrp = new THREE.Group();

  const faceTex = createMomFaceTexture();

  const dressMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.45 });
  const apronMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfba, roughness: 0.4 });
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.4 });

  // Curvaceous mom dress
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.54, 12, 16), dressMat);
  torso.position.y = 0.96;
  torso.scale.set(1.15, 1.0, 1.0);
  torso.castShadow = quality !== 'low';

  // White apron
  const apron = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.44, 8, 12), apronMat);
  apron.position.set(0, 0.94, 0.2);
  apron.scale.set(1.05, 1.0, 0.35);

  // Head with Face Plane
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.58, 0);

  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), skinMat);
  headGroup.add(headMesh);

  const facePlaneGeo = new THREE.CylinderGeometry(0.278, 0.278, 0.4, 16, 1, true, -Math.PI * 0.32, Math.PI * 0.64);
  const facePlane = new THREE.Mesh(facePlaneGeo, faceMat);
  facePlane.position.set(0, 0.02, 0.02);
  headGroup.add(facePlane);

  // Voluminous hair with 4 pastel pink hair curlers
  const hairBase = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 14, 14),
    new THREE.MeshStandardMaterial({ color: 0x4c1d95, roughness: 0.6 })
  );
  hairBase.position.set(0, 0.08, -0.06);
  headGroup.add(hairBase);

  const curlerMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });
  for (let c = 0; c < 4; c++) {
    const curler = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.18, 10), curlerMat);
    curler.position.set(Math.sin(c * 1.5) * 0.26, 0.28, Math.cos(c * 1.5) * 0.18);
    curler.rotation.z = Math.PI / 2;
    headGroup.add(curler);
  }

  momGrp.add(torso, apron, headGroup);

  // Right arm wielding the Polished Wooden Rolling Pin
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.45, 12), dressMat);
  armL.position.set(-0.52, 1.2, 0);

  const armR = new THREE.Group();
  armR.position.set(0.52, 1.2, 0);
  const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.45, 12), dressMat);
  armRMesh.position.y = -0.16;

  // Turned Wooden Rolling Pin
  const pinGrp = new THREE.Group();
  pinGrp.position.set(0, -0.38, 0.22);
  pinGrp.rotation.z = Math.PI / 4;

  const pinBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 0.65, 12),
    new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35 })
  );
  const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
  handleL.position.y = -0.4;
  const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
  handleR.position.y = 0.4;
  pinGrp.add(pinBody, handleL, handleR);

  armR.add(armRMesh, pinGrp);
  momGrp.add(armL, armR);

  // Legs with slippers
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.42, 12), skinMat);
  legL.position.set(-0.16, 0.44, 0);
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.42, 12), skinMat);
  legR.position.set(0.16, 0.44, 0);
  momGrp.add(legL, legR);

  return momGrp;
}

// ==============================================================
// STYLIZED HOUSE MONSTERS (SLEEK 3D MODELS - NO PRIMITIVE BOXES)
// ==============================================================

export function buildStylizedMonster(type: string): THREE.Group {
  const grp = new THREE.Group();

  if (type === 'vacuum_robot') {
    // High-Tech Sleek Cyber Vacuum with glowing neon and scanning laser eye
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.54, 0.22, 24),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.7 })
    );

    const neonRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.04, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = 0.09;

    // Dome sensor turret
    const turret = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.2, 0.14, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 })
    );
    turret.position.set(0, 0.18, 0);

    const laserEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    laserEye.position.set(0, 0.18, 0.18);

    grp.add(base, neonRing, turret, laserEye);
  } else if (type === 'gnome') {
    // Whimsical Sculpted 3D Garden Gnome with Curved Drooping Hat & Flowing Beard
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const beardMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });

    // Round belly
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), bodyMat);
    belly.position.y = 0.34;

    // Curved Drooping Gnome Hat
    const hatCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.58, 0),
      new THREE.Vector3(0, 0.8, -0.04),
      new THREE.Vector3(0.08, 0.98, -0.14),
      new THREE.Vector3(0.04, 1.05, -0.22)
    ]);
    const hat = new THREE.Mesh(new THREE.TubeGeometry(hatCurve, 14, 0.18, 12, false), hatMat);

    // Sculpted Flowing Beard Clumps
    const beardGroup = new THREE.Group();
    beardGroup.position.set(0, 0.42, 0.2);

    const beardCenter = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.44, 10), beardMat);
    beardCenter.rotation.x = Math.PI;
    const beardL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 8), beardMat);
    beardL.position.set(-0.12, 0.05, -0.04);
    beardL.rotation.x = Math.PI;
    const beardR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 8), beardMat);
    beardR.position.set(0.12, 0.05, -0.04);
    beardR.rotation.x = Math.PI;
    beardGroup.add(beardCenter, beardL, beardR);

    // Bulbous nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), new THREE.MeshStandardMaterial({ color: 0xfca5a5 }));
    nose.position.set(0, 0.52, 0.28);

    // Sculpted boots
    const bootL = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.14, 6, 8), bootMat);
    bootL.rotation.x = Math.PI / 2;
    bootL.position.set(-0.14, 0.08, 0.08);
    const bootR = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.14, 6, 8), bootMat);
    bootR.rotation.x = Math.PI / 2;
    bootR.position.set(0.14, 0.08, 0.08);

    grp.add(belly, hat, beardGroup, nose, bootL, bootR);
  } else {
    // Ultra-Cute Fluffy Dust Bunny with multiple cloud tufts & floppy ears
    const fluffMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, roughness: 0.6 });
    const earMat = new THREE.MeshStandardMaterial({ color: 0xe879f9, roughness: 0.5 });

    // Main cloud puff
    const mainPuff = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), fluffMat);
    mainPuff.position.y = 0.35;

    // Surrounding cloud tufts
    for (let p = 0; p < 6; p++) {
      const angle = (p / 6) * Math.PI * 2;
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), fluffMat);
      puff.position.set(Math.cos(angle) * 0.22, 0.3 + Math.sin(angle * 2) * 0.08, Math.sin(angle) * 0.22);
      grp.add(puff);
    }

    // Floppy bunny ears with inner pink
    const earCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 0.52, 0),
      new THREE.Vector3(-0.28, 0.72, 0.04),
      new THREE.Vector3(-0.35, 0.64, 0.08)
    ]);
    const earL = new THREE.Mesh(new THREE.TubeGeometry(earCurveL, 10, 0.065, 8, false), earMat);

    const earCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.16, 0.52, 0),
      new THREE.Vector3(0.28, 0.72, 0.04),
      new THREE.Vector3(0.35, 0.64, 0.08)
    ]);
    const earR = new THREE.Mesh(new THREE.TubeGeometry(earCurveR, 10, 0.065, 8, false), earMat);

    // Glowing cute anime eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    eyeL.position.set(-0.14, 0.42, 0.3);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    eyeR.position.set(0.14, 0.42, 0.3);

    grp.add(mainPuff, earL, earR, eyeL, eyeR);
  }

  return grp;
}
