// Core configuration for Meme Royal Clash-style loop
export const CONFIG = {
  BATTLE_DURATION: 180, // seconds
  INITIAL_ELIXIR: 5,
  MAX_ELIXIR: 10,
  ELIXIR_REGEN_RATE_MS: 1400,

  ARENA_WIDTH: 40,
  ARENA_DEPTH: 60,
  PLAYER_SIDE_Z: -20,
  ENEMY_SIDE_Z: 20,
  BRIDGE_Z: 0,
  LANE_X: {
    LEFT: -8,
    RIGHT: 8
  },

  TOWERS: {
    PLAYER: {
      KING: { x: 0, z: -24, hp: 3000 },
      LEFT: { x: -10, z: -10, hp: 1500 },
      RIGHT: { x: 10, z: -10, hp: 1500 }
    },
    ENEMY: {
      KING: { x: 0, z: 24, hp: 3000 },
      LEFT: { x: -10, z: 10, hp: 1500 },
      RIGHT: { x: 10, z: 10, hp: 1500 }
    }
  },

  TROOPS: {
    "doge-warrior": {
      id: "doge-warrior",
      name: "Doge Warrior",
      cost: 3,
      maxHp: 700,
      damage: 80,
      speed: 4,
      attackRange: 1.8,
      attackSpeedSec: 1.0,
      type: "melee",
      image: "https://play.rosebud.ai/assets/doge-warrior.webp?AOyc",
      modelUrl: "https://rosebud.ai/assets/Meshy_Merged_Animations.glb?tlcw",
      modelScale: 1.0
    },
    "bitcoin-knight": {
      id: "bitcoin-knight",
      name: "Bitcoin Knight",
      cost: 4,
      maxHp: 950,
      damage: 90,
      speed: 3,
      attackRange: 1.8,
      attackSpeedSec: 1.1,
      type: "melee",
      image: "https://play.rosebud.ai/assets/bitcoin-knight.webp?3C2f",
      modelUrl: "https://rosebud.ai/assets/Crypto_Knight_1210104327_texture.glb?r4sP",
      modelScale: 1.3
    },
    "shiba-tank": {
      id: "shiba-tank",
      name: "Shiba Tank",
      cost: 5,
      maxHp: 1600,
      damage: 60,
      speed: 2,
      attackRange: 1.5,
      attackSpeedSec: 1.4,
      type: "tank",
      image: "https://play.rosebud.ai/assets/shiba-tank.webp?qjWE",
      modelUrl: "https://rosebud.ai/assets/Shiba_tank.glb?UrXG",
      modelScale: 1.5
    },
    "ethereum-archer": {
      id: "ethereum-archer",
      name: "Ethereum Archer",
      cost: 3,
      maxHp: 500,
      damage: 65,
      speed: 3,
      attackRange: 6.5,
      attackSpeedSec: 1.0,
      type: "ranged",
      image: "https://play.rosebud.ai/assets/ethereum-archer.webp?Jela",
      modelUrl: "https://rosebud.ai/assets/Meshy_Merged_Animations.glb?1xom",
      modelScale: 1.0
    },
    "laser-punk": {
      id: "laser-punk",
      name: "Laser Punk",
      cost: 4,
      maxHp: 550,
      damage: 90,
      speed: 3,
      attackRange: 6.5,
      attackSpeedSec: 0.9,
      type: "ranged",
      image: "https://play.rosebud.ai/assets/laser-punk-card.webp?46vy",
      modelUrl: "https://rosebud.ai/assets/Laser_punk.glb?Uei7",
      modelScale: 1.2
    },
    "wojak-healer": {
      id: "wojak-healer",
      name: "Wojak Healer",
      cost: 4,
      maxHp: 450,
      damage: 40,
      speed: 3,
      attackRange: 5.5,
      attackSpeedSec: 1.2,
      type: "ranged",
      image: "https://play.rosebud.ai/assets/wojak-healer.webp?oUAQ",
      modelUrl: "https://rosebud.ai/assets/Meshy_Merged_Animations.glb?3zIS",
      modelScale: 1.0
    },
    "pepe-mage": {
      id: "pepe-mage",
      name: "Pepe Mage",
      cost: 4,
      maxHp: 520,
      damage: 110,
      speed: 3,
      attackRange: 7.5,
      attackSpeedSec: 1.3,
      type: "ranged",
      image: "https://play.rosebud.ai/assets/pepe-mage.webp?V6Gy"
    }
  },

  ENEMY_AI: {
    MIN_SPAWN_DELAY_MS: 2600,
    MAX_SPAWN_DELAY_MS: 5200
  }
};
