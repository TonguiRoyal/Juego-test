// Updated character generation methods for ThreeGame.ts
// Replaces boxy meshes with smooth, rounded, stylized Fortnite-inspired humanoid characters!
import * as THREE from 'three';
import { GIRLS_DATA, LEVELS_CONFIG, SKINS_DATA, WEAPONS_DATA } from './levelsData';
import { GameSettings, GraphicsQuality, LevelConfig, PlayerSkin, WeaponItem } from './types';
import { sounds } from './audio';
import {
  buildFortniteHero,
  buildFortniteHeroine,
  buildStylizedDad,
  buildStylizedMom,
  buildStylizedMonster,
  FortniteHeroRig
} from './characterModeler';

export interface GameCallbacks {
  onHealthChange: (hp: number, maxHp: number) => void;
  onSuspicionChange: (pct: number) => void;
  onLettersChange: (collected: number, total: number) => void;
  onCoinsChange: (coins: number) => void;
  onWin: (stats: { time: number; letters: number; coins: number; undetected: boolean }) => void;
  onGameOver: (reason: string) => void;
  onAlertStatus: (isAlert: boolean, parentName: string) => void;
}

export class ThreeGameEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private callbacks: GameCallbacks;

  // Level & Config
  private quality: GraphicsQuality = 'medium';
  private levelConfig: LevelConfig;
  private currentSkin: PlayerSkin;
  private currentWeapon: WeaponItem;

  // Loop & Time
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private clock: THREE.Clock;
  private animationFrameId: number | null = null;
  private levelTime: number = 0;
  private everDetected: boolean = false;

  // Player Entity (Fortnite-styled rounded model with articulated joints)
  private playerGroup: THREE.Group;
  private playerTorsoMesh!: THREE.Group;
  private playerHeadMesh!: THREE.Group;
  private playerLeftArm!: THREE.Group;
  private playerRightArm!: THREE.Group;
  private playerLeftLeg!: THREE.Group;
  private playerRightLeg!: THREE.Group;
  private playerElbowL!: THREE.Group;
  private playerElbowR!: THREE.Group;
  private playerKneeL!: THREE.Group;
  private playerKneeR!: THREE.Group;
  private weaponMesh: THREE.Group | null = null;
  private slashArcMesh: THREE.Mesh | null = null;

  // Player Physics & Combat
  private playerPos = new THREE.Vector3(0, 0, 14);
  private playerVel = new THREE.Vector3();
  private isDashing: boolean = false;
  private dashTimer: number = 0;
  private comboStep: number = 0;
  private comboTimer: number = 0;
  private attackCooldown: number = 0;
  private isInvulnerable: boolean = false;
  private invulnTimer: number = 0;

  // Stats
  private maxHealth = 3;
  private health = 3;
  private coinsCollected = 0;
  private lettersCollected = 0;
  private readonly totalLetters = 3;
  private suspicion = 0;
  private isAlert = false;

  // Inputs
  public moveInput = { x: 0, y: 0 };
  public cameraInput = { x: 0, y: 0 };
  public cameraSensitivity: number = 1.0;
  public moveSensitivity: number = 1.0;
  public invertY: boolean = false;
  private cameraYaw = 0;
  private cameraPitch = 0.42;
  private cameraDist = 6.2;

  // House Architecture & Colliders
  private colliders: THREE.Box3[] = [];
  private furnitureMeshes: THREE.Object3D[] = [];
  private bedroomDoorMesh: THREE.Group | null = null;
  private isBedroomDoorOpen = false;
  private girlGoalBox: THREE.Box3 = new THREE.Box3();
  private girlMeshGroup!: THREE.Group;

  // Collectibles
  private collectibleLetters: { mesh: THREE.Group; box: THREE.Box3; collected: boolean }[] = [];
  private collectibleCoins: { mesh: THREE.Group; box: THREE.Box3; collected: boolean }[] = [];
  private collectibleHearts: { mesh: THREE.Group; box: THREE.Box3; collected: boolean }[] = [];
  private bananaPeels: { mesh: THREE.Group; box: THREE.Box3; active: boolean }[] = [];
  private flyingSlippers: { mesh: THREE.Group; pos: THREE.Vector3; vel: THREE.Vector3; life: number }[] = [];

  // Enemies
  private enemies: {
    group: THREE.Group;
    type: string;
    pos: THREE.Vector3;
    startPos: THREE.Vector3;
    dir: number;
    speed: number;
    range: number;
    alive: boolean;
    hp: number;
    maxHp: number;
    hitFlashTimer: number;
    mesh: THREE.Mesh | THREE.Group;
  }[] = [];

  // Parents
  private parents: {
    group: THREE.Group;
    name: string;
    pos: THREE.Vector3;
    startPos: THREE.Vector3;
    speed: number;
    patrolAngle: number;
    radius: number;
    visionCone: THREE.Mesh;
    stunTimer: number;
    throwTimer: number;
  }[] = [];

  // Hit Spark Particles
  private particles: {
    positions: Float32Array;
    velocities: THREE.Vector3[];
    lifespans: number[];
    mesh: THREE.Points;
    geometry: THREE.BufferGeometry;
  } | null = null;

  constructor(container: HTMLElement, levelId: number, quality: GraphicsQuality, skinId: string, weaponId: string, callbacks: GameCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.quality = quality;
    this.clock = new THREE.Clock();

    const lvl = LEVELS_CONFIG.find(l => l.id === levelId) || LEVELS_CONFIG[0];
    this.levelConfig = lvl;
    this.currentSkin = SKINS_DATA.find(s => s.id === skinId) || SKINS_DATA[0];
    this.currentWeapon = WEAPONS_DATA.find(w => w.id === weaponId) || WEAPONS_DATA[0];

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0a09);

    // Camera setup
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    this.camera.position.set(0, 5, 20);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: quality !== 'low',
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    this.applyQualitySettings();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Lighting setup
    this.setupLighting();

    // Create Stylized 3D Player Character (Fortnite style)
    this.playerGroup = new THREE.Group();
    this.createPlayerMesh();
    this.scene.add(this.playerGroup);

    // Build the detailed 3D House
    this.buildHouse();

    // Place Collectibles & Enemies
    this.placeHouseEntities();

    // Setup Particles
    this.setupParticles();

    // Window resize listener
    window.addEventListener('resize', this.onResize);

    // Init HUD
    this.callbacks.onHealthChange(this.health, this.maxHealth);
    this.callbacks.onLettersChange(0, this.totalLetters);
    this.callbacks.onCoinsChange(0);
    this.callbacks.onSuspicionChange(0);
  }

  private applyQualitySettings() {
    if (this.quality === 'low') {
      this.renderer.setPixelRatio(1.0);
      this.renderer.shadowMap.enabled = false;
    } else if (this.quality === 'medium') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
    } else {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.85);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.25);
    sunLight.position.set(12, 16, 8);
    if (this.quality !== 'low') {
      sunLight.castShadow = true;
      const res = this.quality === 'high' ? 2048 : 1024;
      sunLight.shadow.mapSize.width = res;
      sunLight.shadow.mapSize.height = res;
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 45;
      const d = 18;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
    }
    this.scene.add(sunLight);

    // Heroic Fortnite Rim Light (Backlight giving sharp glowing silhouette to character)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(-6, 8, 20);
    this.scene.add(rimLight);

    const livingRoomLamp = new THREE.PointLight(this.levelConfig.accentLightColor, 2.2, 15);
    livingRoomLamp.position.set(-3.5, 3.2, 2.0);
    this.scene.add(livingRoomLamp);

    const bedroomLight = new THREE.PointLight(0xfbbf24, 2.8, 18);
    bedroomLight.position.set(0, 3.5, -22);
    this.scene.add(bedroomLight);
  }

  // ==========================================
  // FORTNITE-STYLE STYLIZED PLAYER CHARACTER
  // ==========================================
  private createPlayerMesh() {
    const hero = buildFortniteHero(this.currentSkin, this.quality);
    this.playerGroup.add(hero.group);
    this.playerTorsoMesh = hero.torsoGroup;
    this.playerHeadMesh = hero.headGroup;
    this.playerLeftArm = hero.leftArm;
    this.playerRightArm = hero.rightArm;
    this.playerLeftLeg = hero.leftLeg;
    this.playerRightLeg = hero.rightLeg;
    this.playerElbowL = hero.leftElbow;
    this.playerElbowR = hero.rightElbow;
    this.playerKneeL = hero.leftKnee;
    this.playerKneeR = hero.rightKnee;

    // Equip Weapon
    this.weaponMesh = this.createWeaponMesh(this.currentWeapon);
    this.weaponMesh.position.set(0, -0.42, 0.18);
    this.playerRightArm.add(this.weaponMesh);

    // Slash Arc effect
    const arcGeo = new THREE.TorusGeometry(1.25, 0.09, 6, 16, Math.PI * 0.85);
    const arcMat = new THREE.MeshBasicMaterial({
      color: this.currentWeapon.glowColor,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.slashArcMesh = new THREE.Mesh(arcGeo, arcMat);
    this.slashArcMesh.rotation.x = Math.PI / 2;
    this.slashArcMesh.position.set(0, 0.9, 0.6);
    this.playerGroup.add(this.slashArcMesh);
  }

  // ==========================================
  // STYLIZED FORTNITE-STYLE WEAPONS
  // ==========================================
  private createWeaponMesh(weapon: WeaponItem): THREE.Group {
    const grp = new THREE.Group();

    if (weapon.modelType === 'pillow') {
      // Fluffy rounded cloud pillow
      const pillowBody = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.26, 0.32, 10, 14),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      pillowBody.scale.set(1.1, 0.7, 0.9);
      pillowBody.rotation.z = Math.PI / 6;

      // Cute ribbon bow
      const ribbon = new THREE.Mesh(
        new THREE.TorusGeometry(0.12, 0.035, 6, 12),
        new THREE.MeshLambertMaterial({ color: 0xf43f5e })
      );
      ribbon.position.set(0, 0.18, 0.12);

      grp.add(pillowBody, ribbon);
    } else if (weapon.modelType === 'rose') {
      // Elegant Rose Whip
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.03, 0.85, 8),
        new THREE.MeshLambertMaterial({ color: 0x16a34a })
      );
      stem.position.y = 0.35;

      // Layered flower petals
      const rosePetals = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 10, 10),
        new THREE.MeshLambertMaterial({ color: 0xef4444 })
      );
      rosePetals.scale.set(1.1, 0.9, 1.1);
      rosePetals.position.set(0, 0.75, 0);

      grp.add(stem, rosePetals);
    } else if (weapon.modelType === 'water_gun') {
      // Fortnite-style Neon Super Soaker Blaster
      const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.12, 0.45, 8, 12),
        new THREE.MeshLambertMaterial({ color: 0x06b6d4 })
      );
      body.rotation.x = Math.PI / 2;

      // Pressurized neon tank
      const tank = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.11, 0.28, 8, 10),
        new THREE.MeshLambertMaterial({ color: 0xfacc15 })
      );
      tank.position.set(0, 0.16, -0.1);
      tank.rotation.x = Math.PI / 2;

      // Glowing nozzle
      const nozzle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.07, 0.18, 10),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      nozzle.position.set(0, 0, 0.34);
      nozzle.rotation.x = Math.PI / 2;

      grp.add(body, tank, nozzle);
    } else {
      // Golden Legendary Chancla (curved aerodynamic sandal with golden aura)
      const sole = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.16, 0.36, 8, 12),
        new THREE.MeshLambertMaterial({ color: 0xfacc15 })
      );
      sole.scale.set(1.0, 0.25, 1.0);
      sole.rotation.x = Math.PI / 2;

      const strap = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.045, 6, 12, Math.PI),
        new THREE.MeshLambertMaterial({ color: 0xf97316 })
      );
      strap.position.set(0, 0.08, 0.06);
      strap.rotation.x = -Math.PI / 2;

      grp.add(sole, strap);
    }
    return grp;
  }

  // ==========================================
  // STYLIZED PARENTS (PAPÁ & MAMÁ)
  // ==========================================
  private placeParents(lvl: LevelConfig) {
    const parentType = lvl.parentType;

    // Papá: Stout round funny dad with big mustache & chancla (Fortnite stylized)
    if (parentType === 'dad_slipper' || parentType === 'both' || parentType === 'mega_dad') {
      const startPos = new THREE.Vector3(0, 0, -3.5);
      const dadGrp = buildStylizedDad(parentType === 'mega_dad', this.quality);
      dadGrp.position.copy(startPos);

      // 3D Flashlight Sight Cone
      const coneGeo = new THREE.ConeGeometry(3.8, 8.5, 16);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const visionCone = new THREE.Mesh(coneGeo, coneMat);
      visionCone.rotation.x = Math.PI / 2;
      visionCone.position.set(0, 0.15, 4.5);
      dadGrp.add(visionCone);

      this.scene.add(dadGrp);

      this.parents.push({
        group: dadGrp,
        name: parentType === 'mega_dad' ? 'Mega-Papá con Chancla Titán' : 'Papá Furioso',
        pos: dadGrp.position,
        startPos: startPos.clone(),
        speed: lvl.parentSpeed,
        patrolAngle: 0,
        radius: lvl.parentPatrolRadius,
        visionCone,
        stunTimer: 0,
        throwTimer: 0
      });
    }

    // Mamá: Stylized cartoon mom with curlers and wooden rolling pin
    if (parentType === 'mom_pin' || parentType === 'both') {
      const startPos = new THREE.Vector3(0, 0, -11.0);
      const momGrp = buildStylizedMom(this.quality);
      momGrp.position.copy(startPos);

      const coneGeo = new THREE.ConeGeometry(3.8, 8.5, 16);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const visionCone = new THREE.Mesh(coneGeo, coneMat);
      visionCone.rotation.x = Math.PI / 2;
      visionCone.position.set(0, 0.15, 4.5);
      momGrp.add(visionCone);

      this.scene.add(momGrp);

      this.parents.push({
        group: momGrp,
        name: 'Mamá con Rodillo',
        pos: momGrp.position,
        startPos: startPos.clone(),
        speed: lvl.parentSpeed * 1.05,
        patrolAngle: Math.PI,
        radius: lvl.parentPatrolRadius * 0.8,
        visionCone,
        stunTimer: 0,
        throwTimer: 0
      });
    }
  }

  // ==========================================
  // STYLIZED HOUSE MONSTERS
  // ==========================================
  private placeHouseMonsters(lvl: LevelConfig) {
    const types = lvl.enemyTypes;
    for (let i = 0; i < lvl.enemyCount; i++) {
      const type = types[i % types.length];
      const z = 7 - i * (22 / lvl.enemyCount);
      const x = (i % 2 === 0 ? 3.0 : -3.0);

      const grp = buildStylizedMonster(type);
      grp.position.set(x, 0, z);

      this.scene.add(grp);
      this.enemies.push({
        group: grp,
        type,
        pos: grp.position,
        startPos: grp.position.clone(),
        dir: 1,
        speed: 2.2 + Math.random() * 0.6,
        range: 3.2,
        alive: true,
        hp: 2,
        maxHp: 2,
        hitFlashTimer: 0,
        mesh: grp
      });
    }
  }

  // ==========================================
  // HOUSE ARCHITECTURE & INTERIOR
  // ==========================================
  private buildHouse() {
    const lvl = this.levelConfig;

    const floorMat = new THREE.MeshStandardMaterial({
      color: lvl.floorColor,
      roughness: 0.38,
      metalness: 0.08
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: lvl.wallColor,
      roughness: 0.65,
      metalness: 0.04
    });
    const carpetMat = new THREE.MeshStandardMaterial({
      color: lvl.carpetColor,
      roughness: 0.75,
      metalness: 0.02
    });

    // Main House Floor (Length = 50, Width = 16)
    const floor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.5, 48), floorMat);
    floor.position.set(0, -0.25, -6);
    floor.receiveShadow = this.quality !== 'low';
    this.scene.add(floor);

    // Decorative Carpets
    const carpetLiving = new THREE.Mesh(new THREE.BoxGeometry(10, 0.05, 12), carpetMat);
    carpetLiving.position.set(0, 0.02, 3);
    carpetLiving.receiveShadow = this.quality !== 'low';

    const carpetBed = new THREE.Mesh(
      new THREE.BoxGeometry(11, 0.05, 12),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7 })
    );
    carpetBed.position.set(0, 0.02, -22);
    carpetBed.receiveShadow = this.quality !== 'low';
    this.scene.add(carpetLiving, carpetBed);

    // Outer Boundary House Walls
    this.addWall(0, 2.25, 18, 16, 4.5, 0.8, wallMat);
    this.addWall(-8, 2.25, -6, 0.8, 4.5, 48, wallMat);
    this.addWall(8, 2.25, -6, 0.8, 4.5, 48, wallMat);
    this.addWall(0, 2.25, -30, 16, 4.5, 0.8, wallMat);

    // Interior Partition Walls
    this.addWall(-5.0, 2.25, -7, 6.0, 4.5, 0.6, wallMat);
    this.addWall(5.0, 2.25, -7, 6.0, 4.5, 0.6, wallMat);
    this.addWall(-5.0, 2.25, -16, 6.0, 4.5, 0.6, wallMat);
    this.addWall(5.0, 2.25, -16, 6.0, 4.5, 0.6, wallMat);

    // The Bedroom Door
    this.bedroomDoorMesh = new THREE.Group();
    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.8, 0.15), new THREE.MeshLambertMaterial({ color: 0x78350f }));
    doorLeaf.position.set(1.8, 1.9, 0);
    doorLeaf.castShadow = this.quality !== 'low';
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
    knob.position.set(3.2, 1.8, 0.12);
    this.bedroomDoorMesh.position.set(-1.8, 0, -16);
    this.bedroomDoorMesh.add(doorLeaf, knob);
    this.scene.add(this.bedroomDoorMesh);

    // Furniture in Living Room
    this.buildLivingRoomFurniture(lvl);

    // Bedroom Decor
    this.buildGirlBedroom(lvl);
  }

  private addWall(x: number, y: number, z: number, w: number, h: number, d: number, mat: THREE.Material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = this.quality !== 'low';
    mesh.receiveShadow = this.quality !== 'low';
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.colliders.push(box);
  }

  private addObstacleBox(x: number, y: number, z: number, w: number, h: number, d: number, obj: THREE.Object3D) {
    obj.position.set(x, y, z);
    this.scene.add(obj);
    this.furnitureMeshes.push(obj);

    const box = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, y + h / 2, z), new THREE.Vector3(w, h, d));
    this.colliders.push(box);
  }

  private buildLivingRoomFurniture(lvl: LevelConfig) {
    const sofaMat = new THREE.MeshLambertMaterial({ color: 0x1e3a8a });
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x573a21 });
    const plantMat = new THREE.MeshLambertMaterial({ color: 0x15803d });
    const potMat = new THREE.MeshLambertMaterial({ color: 0xc2410c });

    // Sectional Sofa
    const sofaGrp = new THREE.Group();
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.7, 1.8), sofaMat);
    sofaBase.position.y = 0.35;
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 0.5), sofaMat);
    sofaBack.position.set(0, 0.9, -0.65);
    const cushion1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.6), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
    cushion1.position.set(-1.2, 0.8, -0.3);
    const cushion2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.6), new THREE.MeshLambertMaterial({ color: 0xf43f5e }));
    cushion2.position.set(1.2, 0.8, -0.3);
    sofaGrp.add(sofaBase, sofaBack, cushion1, cushion2);
    this.addObstacleBox(-4.5, 0, 5, 4.2, 1.5, 1.8, sofaGrp);

    // Coffee Table
    const tableGrp = new THREE.Group();
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.4), woodMat);
    tableTop.position.y = 0.65;
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 8), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    mug.position.set(0.4, 0.8, 0.2);
    tableGrp.add(tableTop, mug);
    this.addObstacleBox(-4.5, 0, 2.5, 2.6, 0.8, 1.4, tableGrp);

    // Media Console with TV
    const tvGrp = new THREE.Group();
    const consoleTable = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.8, 1.2), woodMat);
    consoleTable.position.y = 0.4;
    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.15), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
    tvScreen.position.set(0, 2.0, 0);
    tvGrp.add(consoleTable, tvScreen);
    this.addObstacleBox(5.0, 0, 4, 4.5, 3.0, 1.2, tvGrp);

    // Bookshelf
    const shelfGrp = new THREE.Group();
    const shelfCase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.6, 0.8), woodMat);
    shelfCase.position.y = 1.8;
    shelfGrp.add(shelfCase);
    this.addObstacleBox(6.2, 0, -3, 2.4, 3.6, 0.8, shelfGrp);

    // Floor Lamp
    const lampGrp = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.0), new THREE.MeshLambertMaterial({ color: 0x1f2937 }));
    pole.position.y = 1.5;
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.5, 8), new THREE.MeshLambertMaterial({ color: 0xfef08a }));
    shade.position.y = 2.9;
    lampGrp.add(pole, shade);
    this.addObstacleBox(-6.5, 0, 0, 1.0, 3.0, 1.0, lampGrp);

    // Plants
    const plant1 = this.createPottedPlant(potMat, plantMat);
    this.addObstacleBox(-6.5, 0, 11, 1.2, 1.8, 1.2, plant1);
    const plant2 = this.createPottedPlant(potMat, plantMat);
    this.addObstacleBox(6.5, 0, 11, 1.2, 1.8, 1.2, plant2);
  }

  private createPottedPlant(potMat: THREE.Material, plantMat: THREE.Material): THREE.Group {
    const grp = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.6, 8), potMat);
    pot.position.y = 0.3;
    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 1), plantMat);
    foliage.position.y = 0.95;
    grp.add(pot, foliage);
    return grp;
  }

  private buildGirlBedroom(lvl: LevelConfig) {
    const girl = GIRLS_DATA.find(g => g.id === lvl.girlId) || GIRLS_DATA[0];
    const girlColor = new THREE.Color(girl.color);

    // Bed
    const bedGrp = new THREE.Group();
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.6, 4.4), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    bedFrame.position.y = 0.3;
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.4, 4.2), new THREE.MeshLambertMaterial({ color: girlColor }));
    mattress.position.y = 0.7;
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, 0.4), new THREE.MeshLambertMaterial({ color: 0x78350f }));
    headboard.position.set(0, 1.1, -2.1);
    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.8), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    pillow1.position.set(-0.8, 0.95, -1.5);
    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.8), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    pillow2.position.set(0.8, 0.95, -1.5);
    bedGrp.add(bedFrame, mattress, headboard, pillow1, pillow2);
    this.addObstacleBox(-4.5, 0, -25, 3.6, 1.8, 4.4, bedGrp);

    // Study Desk with Laptop
    const deskGrp = new THREE.Group();
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 1.5), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
    desk.position.y = 0.6;
    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.6), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    laptop.position.set(0, 1.25, 0);
    deskGrp.add(desk, laptop);
    this.addObstacleBox(4.5, 0, -25, 3.2, 1.6, 1.5, deskGrp);

    // Wardrobe
    const closet = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.8, 1.6), new THREE.MeshLambertMaterial({ color: 0x451a03 }));
    closet.position.y = 1.9;
    const closetGrp = new THREE.Group();
    closetGrp.add(closet);
    this.addObstacleBox(5.5, 0, -19, 2.4, 3.8, 1.6, closetGrp);

    // Stylized Anime Girl Model (Fortnite style)
    const heroine = buildFortniteHeroine(girl, this.quality);
    this.girlMeshGroup = heroine.group;
    this.girlMeshGroup.position.set(0, 0, -24.5);
    this.scene.add(this.girlMeshGroup);

    // Heart aura above head
    const heartGeo = new THREE.TorusGeometry(0.7, 0.15, 8, 16);
    const heartMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const heartAura = new THREE.Mesh(heartGeo, heartMat);
    heartAura.position.set(0, 2.7, 0);
    heartAura.rotation.x = Math.PI / 2;
    this.girlMeshGroup.add(heartAura);

    // Goal Trigger Box
    this.girlGoalBox = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(0, 1.5, -24.5),
      new THREE.Vector3(4.0, 3.0, 4.0)
    );
  }

  private placeHouseEntities() {
    const lvl = this.levelConfig;

    // 3 Golden Letters
    const letterPositions = [
      new THREE.Vector3(-3.5, 1.0, 2.5),
      new THREE.Vector3(4.5, 0.9, -11.0),
      new THREE.Vector3(-4.0, 1.1, -21.0)
    ];

    letterPositions.forEach(pos => {
      const grp = new THREE.Group();
      grp.position.copy(pos);

      const env = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.08), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
      const seal = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      seal.position.set(0, 0, 0.06);
      grp.add(env, seal);
      this.scene.add(grp);

      const box = new THREE.Box3().setFromCenterAndSize(pos, new THREE.Vector3(1.2, 1.2, 1.2));
      this.collectibleLetters.push({ mesh: grp, box, collected: false });
    });

    // Coins
    for (let i = 0; i < 10; i++) {
      const grp = new THREE.Group();
      const z = 10 - i * 3.4;
      const x = (Math.sin(i * 1.7) * 4.2);
      grp.position.set(x, 0.4, z);

      const coinMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 10), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
      coinMesh.rotation.x = Math.PI / 2;
      grp.add(coinMesh);
      this.scene.add(grp);

      const box = new THREE.Box3().setFromCenterAndSize(grp.position, new THREE.Vector3(1.2, 1.0, 1.2));
      this.collectibleCoins.push({ mesh: grp, box, collected: false });
    }

    // Health Recovery Hearts
    [new THREE.Vector3(5.0, 0.6, -1.0), new THREE.Vector3(-5.0, 0.6, -13.0)].forEach(pos => {
      const grp = new THREE.Group();
      grp.position.copy(pos);
      const heart = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35, 0), new THREE.MeshLambertMaterial({ color: 0xf43f5e }));
      grp.add(heart);
      this.scene.add(grp);
      const box = new THREE.Box3().setFromCenterAndSize(pos, new THREE.Vector3(1.2, 1.2, 1.2));
      this.collectibleHearts.push({ mesh: grp, box, collected: false });
    });

    // Monsters & Parents
    this.placeHouseMonsters(lvl);
    this.placeParents(lvl);
  }

  private setupParticles() {
    const count = this.quality === 'low' ? 30 : 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities: THREE.Vector3[] = [];
    const lifespans: number[] = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -100;
      positions[i * 3 + 2] = 0;
      velocities.push(new THREE.Vector3());
      lifespans.push(0);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xfacc15,
      size: 0.3,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Points(geometry, mat);
    this.scene.add(mesh);

    this.particles = { positions, velocities, lifespans, mesh, geometry };
  }

  public emitHitSparks(pos: THREE.Vector3, color: number = 0xfacc15, count: number = 12) {
    if (!this.particles) return;
    const p = this.particles;
    let spawned = 0;

    for (let i = 0; i < p.positions.length / 3 && spawned < count; i++) {
      if (p.lifespans[i] <= 0) {
        p.positions[i * 3] = pos.x;
        p.positions[i * 3 + 1] = pos.y + 0.5;
        p.positions[i * 3 + 2] = pos.z;

        p.velocities[i].set(
          (Math.random() - 0.5) * 5,
          Math.random() * 4 + 1.5,
          (Math.random() - 0.5) * 5
        );
        p.lifespans[i] = 0.5;
        spawned++;
      }
    }
    p.geometry.attributes.position.needsUpdate = true;
  }

  // Combat: 3-Hit Combo Attack
  public attack() {
    if (this.isPaused || !this.isRunning || this.attackCooldown > 0) return;

    this.comboStep = (this.comboStep % 3) + 1;
    this.comboTimer = 0.6;
    this.attackCooldown = 0.25;

    sounds.playAttack(this.comboStep);

    if (this.slashArcMesh) {
      (this.slashArcMesh.material as THREE.MeshBasicMaterial).opacity = 0.85;
      this.slashArcMesh.rotation.z = (this.comboStep - 1) * Math.PI * 0.5;
    }

    const attackRange = this.currentWeapon.modelType === 'rose' ? 2.8 : 2.2;
    const isHeavy = this.comboStep === 3;
    const damage = this.currentWeapon.damage * (isHeavy ? 2 : 1);

    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      const d = this.playerPos.distanceTo(enemy.pos);
      if (d < attackRange) {
        enemy.hp -= damage;
        sounds.playHit(isHeavy);
        this.emitHitSparks(enemy.pos, isHeavy ? 0xef4444 : 0xfacc15, isHeavy ? 20 : 10);

        const knockDir = new THREE.Vector3().subVectors(enemy.pos, this.playerPos).normalize();
        enemy.pos.addScaledVector(knockDir, isHeavy ? 1.5 : 0.8);

        if (enemy.hp <= 0) {
          enemy.alive = false;
          sounds.playEnemyDefeat();
          this.scene.remove(enemy.group);
          this.coinsCollected += 8;
          this.callbacks.onCoinsChange(this.coinsCollected);
        }
      }
    });

    this.parents.forEach(parent => {
      const d = this.playerPos.distanceTo(parent.pos);
      if (d < attackRange + 0.6) {
        parent.stunTimer = 4.0;
        sounds.playHit(true);
        sounds.playSlip();
        this.emitHitSparks(parent.pos, 0xfacc15, 25);
        this.callbacks.onAlertStatus(true, `¡${parent.name} ATURDIDO POR LA ALMOHADA!`);
      }
    });
  }

  // Dash / Evade
  public slide() {
    if (this.isPaused || !this.isRunning || this.isDashing) return;
    this.isDashing = true;
    this.dashTimer = 0.45;
    sounds.playSlide();

    const forward = new THREE.Vector3(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw));
    this.playerVel.x += forward.x * 12;
    this.playerVel.z += forward.z * 12;
    this.emitHitSparks(this.playerPos, 0xffffff, 8);
  }

  public jump() {
    this.slide();
  }

  // Banana Trap
  public dropBanana() {
    if (this.isPaused || !this.isRunning) return;
    sounds.playSlip();

    const grp = new THREE.Group();
    grp.position.set(this.playerPos.x, 0.08, this.playerPos.z);

    const peel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.4), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
    grp.add(peel);
    this.scene.add(grp);

    const box = new THREE.Box3().setFromCenterAndSize(grp.position, new THREE.Vector3(1.2, 0.6, 1.2));
    this.bananaPeels.push({ mesh: grp, box, active: true });
  }

  private update(dt: number) {
    if (this.isPaused || !this.isRunning) return;

    this.levelTime += dt;

    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.comboStep = 0;
    }
    if (this.slashArcMesh) {
      const mat = this.slashArcMesh.material as THREE.MeshBasicMaterial;
      if (mat.opacity > 0) mat.opacity = Math.max(0, mat.opacity - dt * 4);
    }
    if (this.isDashing) {
      this.dashTimer -= dt;
      if (this.dashTimer <= 0) this.isDashing = false;
    }
    if (this.isInvulnerable) {
      this.invulnTimer -= dt;
      if (this.invulnTimer <= 0) {
        this.isInvulnerable = false;
        this.playerGroup.visible = true;
      } else {
        this.playerGroup.visible = Math.floor(this.invulnTimer * 14) % 2 === 0;
      }
    }

    // Camera Input Handling with Custom Sensitivity & Inversion
    this.cameraYaw += this.cameraInput.x * dt * 2.5 * this.cameraSensitivity;
    const pitchFactor = this.invertY ? -1 : 1;
    this.cameraPitch = Math.max(0.2, Math.min(0.9, this.cameraPitch + this.cameraInput.y * dt * 2.0 * this.cameraSensitivity * pitchFactor));

    // Movement: Move Forward when moveInput.y > 0 (Up / W)
    const moveX = this.moveInput.x;
    const moveY = this.moveInput.y;
    const speed = (this.isDashing ? 12.0 : 7.0) * this.moveSensitivity;

    if (Math.abs(moveX) > 0.05 || Math.abs(moveY) > 0.05) {
      const forward = new THREE.Vector3(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw));
      const right = new THREE.Vector3(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw));

      const moveDir = new THREE.Vector3()
        .addScaledVector(right, moveX)
        .addScaledVector(forward, moveY)
        .normalize();

      this.playerVel.x = THREE.MathUtils.lerp(this.playerVel.x, moveDir.x * speed, dt * 12);
      this.playerVel.z = THREE.MathUtils.lerp(this.playerVel.z, moveDir.z * speed, dt * 12);

      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      this.playerGroup.rotation.y = THREE.MathUtils.lerp(this.playerGroup.rotation.y, targetAngle, dt * 14);

      sounds.playFootstep();
    } else {
      this.playerVel.x = THREE.MathUtils.lerp(this.playerVel.x, 0, dt * 14);
      this.playerVel.z = THREE.MathUtils.lerp(this.playerVel.z, 0, dt * 14);
    }

    this.movePlayerWithCollision(dt);
    this.playerPos.y = 0;

    this.checkBedroomDoor();
    this.animatePlayer(dt);
    this.updateEnemies(dt);
    this.updateParents(dt);
    this.updateTrapsAndProjectiles(dt);
    this.checkCollectibles();
    this.checkGirlGoal();
    this.updateParticles(dt);
    this.updateCamera(dt);
  }

  private movePlayerWithCollision(dt: number) {
    const nextPos = this.playerPos.clone();
    const pRadius = 0.45;

    nextPos.x += this.playerVel.x * dt;
    let collideX = false;
    const testBoxX = new THREE.Box3(
      new THREE.Vector3(nextPos.x - pRadius, 0.2, this.playerPos.z - pRadius),
      new THREE.Vector3(nextPos.x + pRadius, 1.8, this.playerPos.z + pRadius)
    );
    for (const col of this.colliders) {
      if (testBoxX.intersectsBox(col)) {
        collideX = true;
        break;
      }
    }
    if (!collideX) this.playerPos.x = nextPos.x;

    nextPos.z += this.playerVel.z * dt;
    let collideZ = false;
    const testBoxZ = new THREE.Box3(
      new THREE.Vector3(this.playerPos.x - pRadius, 0.2, nextPos.z - pRadius),
      new THREE.Vector3(this.playerPos.x + pRadius, 1.8, nextPos.z + pRadius)
    );
    for (const col of this.colliders) {
      if (testBoxZ.intersectsBox(col)) {
        collideZ = true;
        break;
      }
    }
    if (!collideZ) this.playerPos.z = nextPos.z;
  }

  private checkBedroomDoor() {
    if (this.playerPos.z < -13.5 && !this.isBedroomDoorOpen && this.bedroomDoorMesh) {
      this.isBedroomDoorOpen = true;
      sounds.playDoorOpen();
    }
    if (this.isBedroomDoorOpen && this.bedroomDoorMesh) {
      this.bedroomDoorMesh.rotation.y = THREE.MathUtils.lerp(this.bedroomDoorMesh.rotation.y, -Math.PI * 0.45, 0.1);
    }
  }

  private animatePlayer(dt: number) {
    const isMoving = Math.abs(this.playerVel.x) > 0.4 || Math.abs(this.playerVel.z) > 0.4;
    const walkCycle = this.clock.getElapsedTime() * 12;

    if (this.isDashing) {
      this.playerTorsoMesh.scale.set(1.15, 0.72, 1.15);
      this.playerTorsoMesh.position.y = 0.55;
      this.playerHeadMesh.position.y = 1.35;
      this.playerTorsoMesh.rotation.x = 0.38;
      if (this.playerElbowL) this.playerElbowL.rotation.x = -Math.PI / 2.5;
      if (this.playerElbowR) this.playerElbowR.rotation.x = -Math.PI / 2.5;
    } else {
      this.playerTorsoMesh.scale.set(1, 1, 1);
      this.playerTorsoMesh.rotation.x = 0;
      this.playerHeadMesh.position.y = 1.68;

      if (isMoving) {
        // Natural athletic hip sway & bounce
        this.playerTorsoMesh.position.y = 0.85 + Math.abs(Math.sin(walkCycle * 2)) * 0.05;
        this.playerTorsoMesh.rotation.y = Math.sin(walkCycle) * 0.1;
        this.playerTorsoMesh.rotation.z = Math.cos(walkCycle) * 0.03;

        // Shoulder & Arm Swing with Natural Elbow Flex
        this.playerLeftArm.rotation.x = Math.sin(walkCycle) * 0.7;
        this.playerRightArm.rotation.x = -Math.sin(walkCycle) * 0.7;
        if (this.playerElbowL) this.playerElbowL.rotation.x = -Math.PI / 4 + Math.cos(walkCycle) * 0.25;
        if (this.playerElbowR) this.playerElbowR.rotation.x = -Math.PI / 4 - Math.cos(walkCycle) * 0.25;

        // Thigh Swing with Realistic Knee Bending (Eliminates stiff Roblox look!)
        this.playerLeftLeg.rotation.x = -Math.sin(walkCycle) * 0.75;
        this.playerRightLeg.rotation.x = Math.sin(walkCycle) * 0.75;
        if (this.playerKneeL) this.playerKneeL.rotation.x = Math.max(0, -Math.sin(walkCycle) * 1.25);
        if (this.playerKneeR) this.playerKneeR.rotation.x = Math.max(0, Math.sin(walkCycle) * 1.25);
      } else {
        // Idle breathing animation
        const breath = Math.sin(this.clock.getElapsedTime() * 3) * 0.03;
        this.playerTorsoMesh.position.y = 0.85 + breath * 0.3;
        this.playerTorsoMesh.rotation.set(0, 0, 0);
        this.playerLeftArm.rotation.x = breath;
        this.playerRightArm.rotation.x = -breath;
        if (this.playerElbowL) this.playerElbowL.rotation.x = -0.22;
        if (this.playerElbowR) this.playerElbowR.rotation.x = -0.22;
        this.playerLeftLeg.rotation.x = 0;
        this.playerRightLeg.rotation.x = 0;
        if (this.playerKneeL) this.playerKneeL.rotation.x = 0;
        if (this.playerKneeR) this.playerKneeR.rotation.x = 0;
      }
    }

    if (this.attackCooldown > 0) {
      this.playerRightArm.rotation.x = -Math.PI * 0.85;
      this.playerRightArm.rotation.y = Math.sin(this.attackCooldown * 20) * 1.4;
      if (this.playerElbowR) this.playerElbowR.rotation.x = -Math.PI / 3;
    } else {
      this.playerRightArm.rotation.y = 0;
    }

    this.playerGroup.position.copy(this.playerPos);

    const wavingArm = this.girlMeshGroup.getObjectByName('wavingArm');
    if (wavingArm) {
      wavingArm.rotation.z = -Math.PI / 3.8 + Math.sin(this.clock.getElapsedTime() * 5) * 0.3;
    }
  }

  private updateEnemies(dt: number) {
    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;

      const toPlayer = new THREE.Vector3().subVectors(this.playerPos, enemy.pos);
      const dist = toPlayer.length();

      if (dist < 4.5) {
        toPlayer.normalize();
        enemy.pos.addScaledVector(toPlayer, enemy.speed * 0.8 * dt);
        enemy.group.lookAt(this.playerPos.x, enemy.pos.y, this.playerPos.z);
      } else {
        enemy.pos.x += enemy.dir * enemy.speed * dt;
        if (Math.abs(enemy.pos.x - enemy.startPos.x) > enemy.range) {
          enemy.dir *= -1;
        }
      }

      enemy.group.position.copy(enemy.pos);
      if (enemy.type === 'dust_bunny') {
        enemy.group.position.y = 0.35 + Math.abs(Math.sin(this.clock.getElapsedTime() * 6)) * 0.4;
      }

      if (dist < 1.1) {
        this.takeDamage(1, `¡Te golpeó un ${enemy.type}!`);
      }
    });
  }

  private updateParents(dt: number) {
    let anyAlert = false;

    this.parents.forEach(parent => {
      if (parent.stunTimer > 0) {
        parent.stunTimer -= dt;
        parent.group.rotation.y += dt * 8;
        return;
      }

      parent.patrolAngle += (parent.speed / parent.radius) * dt * 0.5;
      parent.pos.x = parent.startPos.x + Math.sin(parent.patrolAngle) * parent.radius;
      parent.pos.z = parent.startPos.z + Math.cos(parent.patrolAngle) * (parent.radius * 0.7);
      parent.group.position.copy(parent.pos);

      // Comedic walking waddle & mustache bounce
      parent.group.rotation.z = Math.sin(this.clock.getElapsedTime() * 7) * 0.05;
      const stache = parent.group.getObjectByName('dadMustache');
      if (stache) {
        stache.rotation.z = Math.sin(this.clock.getElapsedTime() * 12) * 0.15;
      }

      const lookTarget = (this.suspicion > 30) ? this.playerPos : new THREE.Vector3(
        parent.pos.x + Math.cos(parent.patrolAngle),
        parent.pos.y,
        parent.pos.z - Math.sin(parent.patrolAngle)
      );
      parent.group.lookAt(lookTarget.x, parent.pos.y, lookTarget.z);

      const toPlayer = new THREE.Vector3().subVectors(this.playerPos, parent.pos);
      const dist = toPlayer.length();

      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(parent.group.quaternion);
      const angle = forward.angleTo(toPlayer.clone().normalize());

      const inCone = (angle < 0.6 && dist < 9.5);
      const effectiveVisibility = this.isDashing ? 0.35 : 1.0;

      if (inCone && effectiveVisibility > 0.4) {
        this.suspicion = Math.min(100, this.suspicion + dt * 45);
        this.everDetected = true;
        (parent.visionCone.material as THREE.MeshBasicMaterial).color.setHex(0xef4444);
      } else {
        (parent.visionCone.material as THREE.MeshBasicMaterial).color.setHex(0xfef08a);
      }

      if (!inCone) {
        this.suspicion = Math.max(0, this.suspicion - dt * 15);
      }

      if (this.suspicion >= 90) {
        anyAlert = true;
        parent.throwTimer -= dt;
        if (parent.throwTimer <= 0) {
          this.throwSlipper(parent.pos, this.playerPos);
          parent.throwTimer = 1.9;
          sounds.playAlert();
          sounds.playDadGrunt();
        }
      }

      if (dist < 1.4 && parent.stunTimer <= 0) {
        this.takeDamage(1, `¡${parent.name} te atrapó en la casa!`);
      }
    });

    this.callbacks.onSuspicionChange(this.suspicion);

    if (anyAlert && !this.isAlert) {
      this.isAlert = true;
      this.callbacks.onAlertStatus(true, '¡ALERTA ROJA! ¡PAPÁ LANZA CHANCLAS!');
    } else if (!anyAlert && this.isAlert) {
      this.isAlert = false;
      this.callbacks.onAlertStatus(false, '');
    }
  }

  private throwSlipper(from: THREE.Vector3, to: THREE.Vector3) {
    const grp = new THREE.Group();
    grp.position.set(from.x, 1.2, from.z);

    const mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.14, 0.35, 6, 10),
      new THREE.MeshLambertMaterial({ color: 0xdc2626 })
    );
    mesh.scale.set(1.0, 0.25, 1.0);
    grp.add(mesh);
    this.scene.add(grp);

    const dir = new THREE.Vector3().subVectors(to, from).normalize();
    dir.y += 0.15;
    this.flyingSlippers.push({
      mesh: grp,
      pos: grp.position,
      vel: dir.multiplyScalar(14),
      life: 2.8
    });
  }

  private updateTrapsAndProjectiles(dt: number) {
    for (let i = this.flyingSlippers.length - 1; i >= 0; i--) {
      const s = this.flyingSlippers[i];
      s.life -= dt;
      s.vel.y -= 7.0 * dt;
      s.pos.addScaledVector(s.vel, dt);
      s.mesh.rotation.x += dt * 14;

      if (s.pos.distanceTo(this.playerPos) < 1.2) {
        this.takeDamage(1, '¡Te golpeó una Chancla Voladora!');
        sounds.playHit(true);
        this.scene.remove(s.mesh);
        this.flyingSlippers.splice(i, 1);
        continue;
      }

      if (s.life <= 0 || s.pos.y < 0) {
        this.scene.remove(s.mesh);
        this.flyingSlippers.splice(i, 1);
      }
    }

    this.bananaPeels.forEach(peel => {
      if (!peel.active) return;
      this.parents.forEach(p => {
        if (p.pos.distanceTo(peel.mesh.position) < 1.3 && p.stunTimer <= 0) {
          p.stunTimer = 5.0;
          peel.active = false;
          this.scene.remove(peel.mesh);
          sounds.playSlip();
          this.emitHitSparks(p.pos, 0xfacc15, 25);
          this.callbacks.onAlertStatus(true, `¡${p.name} resbaló con la cáscara de plátano!`);
        }
      });
    });
  }

  private checkCollectibles() {
    const pPos = this.playerPos;

    this.collectibleLetters.forEach(l => {
      if (l.collected) return;
      l.mesh.rotation.y += 0.03;
      if (l.mesh.position.distanceTo(pPos) < 1.4) {
        l.collected = true;
        this.scene.remove(l.mesh);
        this.lettersCollected++;
        sounds.playLetter();
        this.emitHitSparks(l.mesh.position, 0xfacc15, 20);
        this.callbacks.onLettersChange(this.lettersCollected, this.totalLetters);
      }
    });

    this.collectibleCoins.forEach(c => {
      if (c.collected) return;
      c.mesh.rotation.y += 0.04;
      if (c.mesh.position.distanceTo(pPos) < 1.3) {
        c.collected = true;
        this.scene.remove(c.mesh);
        this.coinsCollected++;
        sounds.playCoin();
        this.callbacks.onCoinsChange(this.coinsCollected);
      }
    });

    this.collectibleHearts.forEach(h => {
      if (h.collected) return;
      h.mesh.rotation.y += 0.04;
      if (h.mesh.position.distanceTo(pPos) < 1.4) {
        h.collected = true;
        this.scene.remove(h.mesh);
        if (this.health < this.maxHealth) {
          this.health++;
          this.callbacks.onHealthChange(this.health, this.maxHealth);
          sounds.playCoin();
          this.emitHitSparks(h.mesh.position, 0xf43f5e, 18);
        }
      }
    });
  }

  private checkGirlGoal() {
    const pBox = new THREE.Box3(
      new THREE.Vector3(this.playerPos.x - 0.5, 0, this.playerPos.z - 0.5),
      new THREE.Vector3(this.playerPos.x + 0.5, 1.8, this.playerPos.z + 0.5)
    );

    if (pBox.intersectsBox(this.girlGoalBox)) {
      this.triggerWin();
    }
  }

  private updateParticles(dt: number) {
    if (!this.particles) return;
    const p = this.particles;

    for (let i = 0; i < p.positions.length / 3; i++) {
      if (p.lifespans[i] > 0) {
        p.lifespans[i] -= dt;
        p.positions[i * 3] += p.velocities[i].x * dt;
        p.positions[i * 3 + 1] += p.velocities[i].y * dt;
        p.positions[i * 3 + 2] += p.velocities[i].z * dt;
        p.velocities[i].y -= 9.8 * dt;
      } else {
        p.positions[i * 3 + 1] = -100;
      }
    }
    p.geometry.attributes.position.needsUpdate = true;
  }

  private updateCamera(dt: number) {
    const cx = this.playerPos.x + Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDist;
    const cy = this.playerPos.y + 1.8 + Math.sin(this.cameraPitch) * this.cameraDist;
    const cz = this.playerPos.z + Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDist;

    this.camera.position.lerp(new THREE.Vector3(cx, cy, cz), dt * 8);
    this.camera.lookAt(this.playerPos.x, this.playerPos.y + 1.2, this.playerPos.z);
  }

  private takeDamage(amount: number, reason: string) {
    if (this.isInvulnerable) return;
    this.health -= amount;
    this.isInvulnerable = true;
    this.invulnTimer = 1.5;
    sounds.playHurt();
    this.emitHitSparks(this.playerPos, 0xef4444, 20);
    this.callbacks.onHealthChange(this.health, this.maxHealth);

    if (this.health <= 0) {
      this.triggerGameOver(reason);
    }
  }

  private triggerWin() {
    this.isRunning = false;
    sounds.playVictory();
    this.callbacks.onWin({
      time: Math.round(this.levelTime),
      letters: this.lettersCollected,
      coins: this.coinsCollected,
      undetected: !this.everDetected
    });
  }

  private triggerGameOver(reason: string) {
    this.isRunning = false;
    this.callbacks.onGameOver(reason);
  }

  // Public Controls
  public start() {
    this.isRunning = true;
    this.isPaused = false;
    this.clock.start();
    sounds.startMusic();
    this.loop();
  }

  public pause() {
    this.isPaused = true;
    sounds.stopMusic();
  }

  public resume() {
    this.isPaused = false;
    this.clock.start();
    sounds.startMusic();
  }

  public setQuality(quality: GraphicsQuality) {
    this.quality = quality;
    this.applyQualitySettings();
  }

  public updateSettings(settings: GameSettings) {
    this.cameraSensitivity = settings.cameraSensitivity ?? 1.0;
    this.moveSensitivity = settings.moveSensitivity ?? 1.0;
    this.invertY = settings.invertY ?? false;
    if (this.quality !== settings.quality) {
      this.quality = settings.quality;
      this.applyQualitySettings();
    }
  }

  private loop = () => {
    if (!this.isRunning) return;
    this.animationFrameId = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.1);
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
  };

  private onResize = () => {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = Math.max(this.container.clientHeight, 1);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public destroy() {
    this.isRunning = false;
    sounds.stopMusic();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
