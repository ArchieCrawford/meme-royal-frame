import * as THREE from "three";
import { CONFIG } from "./config.js";
import { Unit3D } from "./Unit3D.js";
import { Tower3D } from "./Tower3D.js";

class Game {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x22252f);

    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 40, 32);
    this.camera.lookAt(0, 0, 0);

    this.clock = new THREE.Clock();

    this.playerUnits = [];
    this.enemyUnits = [];
    this.playerTowers = {};
    this.enemyTowers = {};
    this.playerCrowns = 0;
    this.enemyCrowns = 0;

    this.elixir = CONFIG.INITIAL_ELIXIR;
    this.lastElixirTick = performance.now();
    this.battleTimeRemaining = CONFIG.BATTLE_DURATION;
    this.isGameOver = false;

    this.selectedCardId = null;
    this.hand = [];
    this.deckQueue = [];

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.timerEl = document.getElementById("timer");
    this.elixirEl = document.getElementById("elixir");
    this.enemyCrownsEl = document.getElementById("enemy-crowns");
    this.playerCrownsEl = document.getElementById("player-crowns");
    this.cardDeckEl = document.getElementById("card-deck");
    this.gameOverEl = document.getElementById("game-over");
    this.resultTextEl = document.getElementById("result-text");
    this.restartBtn = document.getElementById("restart-btn");

    this.enemyNextSpawnTime = performance.now() + this.randomEnemyDelay();

    this.initArena();
    this.initTowers();
    this.initDeck();
    this.initUI();
    this.bindEvents();

    this.animate();
  }

  initArena() {
    const groundGeom = new THREE.PlaneGeometry(CONFIG.ARENA_WIDTH, CONFIG.ARENA_DEPTH);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x2b8c4a });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.ground = ground;
    this.scene.add(ground);

    const riverGeom = new THREE.PlaneGeometry(CONFIG.ARENA_WIDTH, 6);
    const riverMat = new THREE.MeshStandardMaterial({ color: 0x2e86c1, metalness: 0.2, roughness: 0.3 });
    const river = new THREE.Mesh(riverGeom, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.001, CONFIG.BRIDGE_Z);
    river.receiveShadow = false;
    this.scene.add(river);

    const bridgeGeom = new THREE.BoxGeometry(6, 0.4, 7);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xc2b280 });
    const leftBridge = new THREE.Mesh(bridgeGeom, bridgeMat);
    leftBridge.position.set(CONFIG.LANE_X.LEFT, 0.2, CONFIG.BRIDGE_Z);
    leftBridge.receiveShadow = true;
    leftBridge.castShadow = true;
    const rightBridge = new THREE.Mesh(bridgeGeom, bridgeMat);
    rightBridge.position.set(CONFIG.LANE_X.RIGHT, 0.2, CONFIG.BRIDGE_Z);
    rightBridge.receiveShadow = true;
    rightBridge.castShadow = true;
    this.scene.add(leftBridge);
    this.scene.add(rightBridge);

    const borderGeom = new THREE.BoxGeometry(1, 3, CONFIG.ARENA_DEPTH);
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x8b7355 });
    const leftBorder = new THREE.Mesh(borderGeom, borderMat);
    leftBorder.position.set(-CONFIG.ARENA_WIDTH / 2, 1.5, 0);
    leftBorder.receiveShadow = true;
    leftBorder.castShadow = true;
    const rightBorder = new THREE.Mesh(borderGeom, borderMat);
    rightBorder.position.set(CONFIG.ARENA_WIDTH / 2, 1.5, 0);
    rightBorder.receiveShadow = true;
    rightBorder.castShadow = true;
    this.scene.add(leftBorder);
    this.scene.add(rightBorder);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 30, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 100;
    this.scene.add(dirLight);
  }

  initTowers() {
    const p = CONFIG.TOWERS.PLAYER;
    const e = CONFIG.TOWERS.ENEMY;
    this.playerTowers.king = new Tower3D(this.scene, p.KING.x, p.KING.z, p.KING.hp, true);
    this.playerTowers.left = new Tower3D(this.scene, p.LEFT.x, p.LEFT.z, p.LEFT.hp, true);
    this.playerTowers.right = new Tower3D(this.scene, p.RIGHT.x, p.RIGHT.z, p.RIGHT.hp, true);

    this.enemyTowers.king = new Tower3D(this.scene, e.KING.x, e.KING.z, e.KING.hp, false);
    this.enemyTowers.left = new Tower3D(this.scene, e.LEFT.x, e.LEFT.z, e.LEFT.hp, false);
    this.enemyTowers.right = new Tower3D(this.scene, e.RIGHT.x, e.RIGHT.z, e.RIGHT.hp, false);
  }

  initDeck() {
    const troopIds = Object.keys(CONFIG.TROOPS);
    this.deckQueue = troopIds.slice(4);
    this.hand = troopIds.slice(0, 4);
  }

  initUI() {
    this.renderHand();
    this.updateElixirUI();
    this.updateCrownsUI();
    this.updateTimerUI();
  }

  bindEvents() {
    window.addEventListener("resize", () => this.onResize());
    this.canvas.addEventListener("click", e => this.onCanvasClick(e));
    this.restartBtn.addEventListener("click", () => window.location.reload());
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  renderHand() {
    this.cardDeckEl.innerHTML = "";
    for (const cardId of this.hand) {
      const troop = CONFIG.TROOPS[cardId];
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.cardId = cardId;

      const cost = document.createElement("div");
      cost.className = "card-cost";
      cost.textContent = troop.cost.toString();
      card.appendChild(cost);

      const img = document.createElement("img");
      img.src = troop.image;
      card.appendChild(img);

      const name = document.createElement("div");
      name.className = "card-name";
      name.textContent = troop.name;
      card.appendChild(name);

      card.addEventListener("click", e => {
        e.stopPropagation();
        this.onCardClick(cardId);
      });

      this.cardDeckEl.appendChild(card);
    }
  }

  onCardClick(cardId) {
    if (this.isGameOver) return;
    const troop = CONFIG.TROOPS[cardId];
    if (this.elixir < troop.cost) return;
    if (this.selectedCardId === cardId) {
      this.selectedCardId = null;
      this.refreshCardSelection();
      return;
    }
    this.selectedCardId = cardId;
    this.refreshCardSelection();
  }

  refreshCardSelection() {
    const cards = this.cardDeckEl.querySelectorAll(".card");
    cards.forEach(card => {
      const id = card.dataset.cardId;
      card.classList.toggle("selected", id === this.selectedCardId);
      const troop = CONFIG.TROOPS[id];
      const disabled = this.elixir < troop.cost;
      card.classList.toggle("disabled", disabled);
    });
  }

  onCanvasClick(event) {
    if (this.isGameOver) return;
    if (!this.selectedCardId) return;

    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, point);

    if (point.z > CONFIG.BRIDGE_Z - 1) return;

    const laneX = Math.abs(point.x - CONFIG.LANE_X.LEFT) < Math.abs(point.x - CONFIG.LANE_X.RIGHT)
      ? CONFIG.LANE_X.LEFT
      : CONFIG.LANE_X.RIGHT;

    const spawnZ = CONFIG.PLAYER_SIDE_Z + 2;

    const troop = CONFIG.TROOPS[this.selectedCardId];
    if (this.elixir < troop.cost) return;

    this.spawnUnit(this.selectedCardId, true, laneX, spawnZ);
    this.consumeElixir(troop.cost);
    this.cycleCard(this.selectedCardId);
    this.selectedCardId = null;
    this.refreshCardSelection();
  }

  spawnUnit(unitKey, isPlayer, x, z) {
    const unit = new Unit3D(this.scene, CONFIG, unitKey, isPlayer, x, z);
    if (isPlayer) {
      this.playerUnits.push(unit);
    } else {
      this.enemyUnits.push(unit);
    }
  }

  cycleCard(playedId) {
    const index = this.hand.indexOf(playedId);
    if (index === -1) return;
    const nextId = this.deckQueue.shift();
    if (nextId) {
      this.hand[index] = nextId;
      this.deckQueue.push(playedId);
    }
    this.renderHand();
  }

  consumeElixir(amount) {
    this.elixir = Math.max(0, this.elixir - amount);
    this.updateElixirUI();
  }

  regenerateElixir(now) {
    if (this.elixir >= CONFIG.MAX_ELIXIR) return;
    if (now - this.lastElixirTick >= CONFIG.ELIXIR_REGEN_RATE_MS) {
      const ticks = Math.floor((now - this.lastElixirTick) / CONFIG.ELIXIR_REGEN_RATE_MS);
      this.elixir = Math.min(CONFIG.MAX_ELIXIR, this.elixir + ticks);
      this.lastElixirTick += ticks * CONFIG.ELIXIR_REGEN_RATE_MS;
      this.updateElixirUI();
    }
  }

  updateElixirUI() {
    this.elixirEl.textContent = this.elixir.toString() + "/" + CONFIG.MAX_ELIXIR.toString();
    this.refreshCardSelection();
  }

  updateTimer(deltaSec) {
    if (this.isGameOver) return;
    this.battleTimeRemaining -= deltaSec;
    if (this.battleTimeRemaining <= 0) {
      this.battleTimeRemaining = 0;
      this.endBattleByTime();
    }
    this.updateTimerUI();
  }

  updateTimerUI() {
    const total = Math.max(0, this.battleTimeRemaining);
    const minutes = Math.floor(total / 60);
    const seconds = Math.floor(total % 60);
    const s = seconds < 10 ? "0" + seconds : seconds.toString();
    this.timerEl.textContent = minutes.toString() + ":" + s;
  }

  updateCrownsUI() {
    this.playerCrownsEl.textContent = this.playerCrowns.toString();
    this.enemyCrownsEl.textContent = this.enemyCrowns.toString();
  }

  randomEnemyDelay() {
    const min = CONFIG.ENEMY_AI.MIN_SPAWN_DELAY_MS;
    const max = CONFIG.ENEMY_AI.MAX_SPAWN_DELAY_MS;
    return min + Math.random() * (max - min);
  }

  updateEnemyAI(now) {
    if (this.isGameOver) return;
    if (now < this.enemyNextSpawnTime) return;

    const troopIds = Object.keys(CONFIG.TROOPS);
    const unitKey = troopIds[Math.floor(Math.random() * troopIds.length)];
    const laneX = Math.random() < 0.5 ? CONFIG.LANE_X.LEFT : CONFIG.LANE_X.RIGHT;
    const spawnZ = CONFIG.ENEMY_SIDE_Z - 2;
    this.spawnUnit(unitKey, false, laneX, spawnZ);

    this.enemyNextSpawnTime = now + this.randomEnemyDelay();
  }

  updateEntities(deltaSec) {
    const alivePlayerUnits = [];
    const aliveEnemyUnits = [];

    const enemyTowersArr = Object.values(this.enemyTowers);
    const playerTowersArr = Object.values(this.playerTowers);

    for (const u of this.playerUnits) {
      u.update(deltaSec, this.enemyUnits, enemyTowersArr);
      if (!u.destroyed && u.hp > 0) alivePlayerUnits.push(u);
    }

    for (const u of this.enemyUnits) {
      u.update(deltaSec, this.playerUnits, playerTowersArr);
      if (!u.destroyed && u.hp > 0) aliveEnemyUnits.push(u);
    }

    this.playerUnits = alivePlayerUnits;
    this.enemyUnits = aliveEnemyUnits;

    const updatedPlayerTowers = {};
    for (const key of Object.keys(this.playerTowers)) {
      const t = this.playerTowers[key];
      t.update(deltaSec, this.enemyUnits);
      updatedPlayerTowers[key] = t;
    }
    this.playerTowers = updatedPlayerTowers;

    const updatedEnemyTowers = {};
    for (const key of Object.keys(this.enemyTowers)) {
      const t = this.enemyTowers[key];
      t.update(deltaSec, this.playerUnits);
      updatedEnemyTowers[key] = t;
    }
    this.enemyTowers = updatedEnemyTowers;

    this.checkTowerCrowns();
  }

  checkTowerCrowns() {
    let playerDestroyed = 0;
    let enemyDestroyed = 0;

    for (const key of Object.keys(this.playerTowers)) {
      if (this.playerTowers[key].destroyed) playerDestroyed += 1;
    }
    for (const key of Object.keys(this.enemyTowers)) {
      if (this.enemyTowers[key].destroyed) enemyDestroyed += 1;
    }

    this.enemyCrowns = playerDestroyed;
    this.playerCrowns = enemyDestroyed;
    this.updateCrownsUI();

    if (this.playerTowers.king.destroyed || this.enemyTowers.king.destroyed) {
      this.endBattleByKing();
    }
  }

  endBattleByKing() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    const playerLost = this.playerTowers.king.destroyed && !this.enemyTowers.king.destroyed;
    const enemyLost = this.enemyTowers.king.destroyed && !this.playerTowers.king.destroyed;
    if (enemyLost && !playerLost) {
      this.resultTextEl.textContent = "Victory!";
    } else if (playerLost && !enemyLost) {
      this.resultTextEl.textContent = "Defeat";
    } else {
      this.resultTextEl.textContent = "Draw";
    }
    this.gameOverEl.classList.add("show");
  }

  endBattleByTime() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    if (this.playerCrowns > this.enemyCrowns) {
      this.resultTextEl.textContent = "Victory!";
    } else if (this.enemyCrowns > this.playerCrowns) {
      this.resultTextEl.textContent = "Defeat";
    } else {
      this.resultTextEl.textContent = "Draw";
    }
    this.gameOverEl.classList.add("show");
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const deltaSec = this.clock.getDelta();
    const now = performance.now();

    if (!this.isGameOver) {
      this.regenerateElixir(now);
      this.updateTimer(deltaSec);
      this.updateEnemyAI(now);
      this.updateEntities(deltaSec);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

new Game();
