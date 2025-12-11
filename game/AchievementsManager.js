// Achievements Manager - Handles achievements, milestones, and rewards
import { CONFIG } from './config.js';

export class AchievementsManager {
  constructor() {
    this.achievements = this.defineAchievements();
    this.loadProgress();
  }
  
  defineAchievements() {
    return {
      // Battle Achievements
      'first-victory': {
        id: 'first-victory',
        name: 'First Blood',
        description: 'Win your first battle',
        icon: '🏆',
        category: 'battle',
        requirement: 1,
        tracker: 'wins',
        rewards: { gold: 100 },
        unlocked: false
      },
      'veteran': {
        id: 'veteran',
        name: 'Veteran',
        description: 'Win 10 battles',
        icon: '⚔️',
        category: 'battle',
        requirement: 10,
        tracker: 'wins',
        rewards: { gold: 500, cards: 5 },
        unlocked: false
      },
      'champion': {
        id: 'champion',
        name: 'Champion',
        description: 'Win 50 battles',
        icon: '👑',
        category: 'battle',
        requirement: 50,
        tracker: 'wins',
        rewards: { gold: 2000, cards: 20 },
        unlocked: false
      },
      'legendary-fighter': {
        id: 'legendary-fighter',
        name: 'Legendary Fighter',
        description: 'Win 100 battles',
        icon: '🌟',
        category: 'battle',
        requirement: 100,
        tracker: 'wins',
        rewards: { gold: 5000, cards: 50 },
        unlocked: false
      },
      
      // Trophy Achievements
      'bronze-league': {
        id: 'bronze-league',
        name: 'Bronze League',
        description: 'Reach 500 trophies',
        icon: '🥉',
        category: 'trophies',
        requirement: 500,
        tracker: 'trophies',
        rewards: { gold: 300 },
        unlocked: false
      },
      'silver-league': {
        id: 'silver-league',
        name: 'Silver League',
        description: 'Reach 1000 trophies',
        icon: '🥈',
        category: 'trophies',
        requirement: 1000,
        tracker: 'trophies',
        rewards: { gold: 800, cards: 10 },
        unlocked: false
      },
      'gold-league': {
        id: 'gold-league',
        name: 'Gold League',
        description: 'Reach 2000 trophies',
        icon: '🥇',
        category: 'trophies',
        requirement: 2000,
        tracker: 'trophies',
        rewards: { gold: 2000, cards: 25 },
        unlocked: false
      },
      'master-league': {
        id: 'master-league',
        name: 'Master League',
        description: 'Reach 3000 trophies',
        icon: '💎',
        category: 'trophies',
        requirement: 3000,
        tracker: 'trophies',
        rewards: { gold: 5000, cards: 50 },
        unlocked: false
      },
      
      // Tower Achievements
      'tower-breaker': {
        id: 'tower-breaker',
        name: 'Tower Breaker',
        description: 'Destroy 25 towers',
        icon: '🗼',
        category: 'towers',
        requirement: 25,
        tracker: 'towersDestroyed',
        rewards: { gold: 400, cards: 5 },
        unlocked: false
      },
      'demolition-expert': {
        id: 'demolition-expert',
        name: 'Demolition Expert',
        description: 'Destroy 100 towers',
        icon: '💥',
        category: 'towers',
        requirement: 100,
        tracker: 'towersDestroyed',
        rewards: { gold: 1500, cards: 15 },
        unlocked: false
      },
      
      // Unit Achievements
      'army-commander': {
        id: 'army-commander',
        name: 'Army Commander',
        description: 'Deploy 100 units',
        icon: '🎖️',
        category: 'units',
        requirement: 100,
        tracker: 'unitsDeployed',
        rewards: { gold: 500, cards: 8 },
        unlocked: false
      },
      'war-general': {
        id: 'war-general',
        name: 'War General',
        description: 'Deploy 500 units',
        icon: '⭐',
        category: 'units',
        requirement: 500,
        tracker: 'unitsDeployed',
        rewards: { gold: 2000, cards: 30 },
        unlocked: false
      },
      
      // Card Achievements
      'collector': {
        id: 'collector',
        name: 'Collector',
        description: 'Collect 100 cards',
        icon: '🃏',
        category: 'cards',
        requirement: 100,
        tracker: 'cardsCollected',
        rewards: { gold: 300 },
        unlocked: false
      },
      'hoarder': {
        id: 'hoarder',
        name: 'Hoarder',
        description: 'Collect 500 cards',
        icon: '📚',
        category: 'cards',
        requirement: 500,
        tracker: 'cardsCollected',
        rewards: { gold: 1000, cards: 20 },
        unlocked: false
      },
      'card-master': {
        id: 'card-master',
        name: 'Card Master',
        description: 'Collect 1000 cards',
        icon: '🎴',
        category: 'cards',
        requirement: 1000,
        tracker: 'cardsCollected',
        rewards: { gold: 3000, cards: 50 },
        unlocked: false
      },
      
      // Upgrade Achievements
      'level-up': {
        id: 'level-up',
        name: 'Level Up',
        description: 'Upgrade any card to level 3',
        icon: '⬆️',
        category: 'upgrades',
        requirement: 3,
        tracker: 'maxCardLevel',
        rewards: { gold: 200, cards: 3 },
        unlocked: false
      },
      'power-player': {
        id: 'power-player',
        name: 'Power Player',
        description: 'Upgrade any card to level 5',
        icon: '💪',
        category: 'upgrades',
        requirement: 5,
        tracker: 'maxCardLevel',
        rewards: { gold: 800, cards: 10 },
        unlocked: false
      },
      'max-power': {
        id: 'max-power',
        name: 'Max Power',
        description: 'Upgrade any card to level 10',
        icon: '🔥',
        category: 'upgrades',
        requirement: 10,
        tracker: 'maxCardLevel',
        rewards: { gold: 5000, cards: 50 },
        unlocked: false
      },
      
      // Special Achievements
      'perfect-victory': {
        id: 'perfect-victory',
        name: 'Perfect Victory',
        description: 'Win without losing any towers',
        icon: '✨',
        category: 'special',
        requirement: 1,
        tracker: 'perfectWins',
        rewards: { gold: 500, cards: 10 },
        unlocked: false
      },
      'comeback-king': {
        id: 'comeback-king',
        name: 'Comeback King',
        description: 'Win after losing 2 towers',
        icon: '🔄',
        category: 'special',
        requirement: 1,
        tracker: 'comebackWins',
        rewards: { gold: 500, cards: 10 },
        unlocked: false
      },
      'deck-master': {
        id: 'deck-master',
        name: 'Deck Master',
        description: 'Create and save 3 different decks',
        icon: '🎯',
        category: 'special',
        requirement: 3,
        tracker: 'decksCreated',
        rewards: { gold: 400, cards: 8 },
        unlocked: false
      },
      'speed-demon': {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Win a battle in under 1 minute',
        icon: '⚡',
        category: 'special',
        requirement: 1,
        tracker: 'quickWins',
        rewards: { gold: 800, cards: 15 },
        unlocked: false
      },
      'gold-digger': {
        id: 'gold-digger',
        name: 'Gold Digger',
        description: 'Earn 10,000 total gold',
        icon: '💰',
        category: 'special',
        requirement: 10000,
        tracker: 'goldEarned',
        rewards: { gold: 2000, cards: 25 },
        unlocked: false
      }
    };
  }
  
  loadProgress() {
    const saved = localStorage.getItem('achievementProgress');
    if (saved) {
      const progress = JSON.parse(saved);
      // Merge saved progress with achievements
      Object.keys(this.achievements).forEach(id => {
        if (progress[id]) {
          this.achievements[id].unlocked = progress[id].unlocked;
          this.achievements[id].unlockedAt = progress[id].unlockedAt;
        }
      });
    }
    
    // Load stats
    const savedStats = localStorage.getItem('achievementStats');
    if (savedStats) {
      this.stats = JSON.parse(savedStats);
    } else {
      this.resetStats();
    }
  }
  
  resetStats() {
    this.stats = {
      wins: 0,
      losses: 0,
      trophies: 0,
      towersDestroyed: 0,
      unitsDeployed: 0,
      cardsCollected: 0,
      maxCardLevel: 1,
      perfectWins: 0,
      comebackWins: 0,
      decksCreated: 1,
      quickWins: 0,
      goldEarned: 0
    };
  }
  
  saveProgress() {
    const progress = {};
    Object.keys(this.achievements).forEach(id => {
      progress[id] = {
        unlocked: this.achievements[id].unlocked,
        unlockedAt: this.achievements[id].unlockedAt
      };
    });
    localStorage.setItem('achievementProgress', JSON.stringify(progress));
    localStorage.setItem('achievementStats', JSON.stringify(this.stats));
  }
  
  checkAchievements() {
    const newlyUnlocked = [];
    
    Object.values(this.achievements).forEach(achievement => {
      if (!achievement.unlocked) {
        const currentValue = this.stats[achievement.tracker] || 0;
        if (currentValue >= achievement.requirement) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();
          newlyUnlocked.push(achievement);
        }
      }
    });
    
    if (newlyUnlocked.length > 0) {
      this.saveProgress();
    }
    
    return newlyUnlocked;
  }
  
  updateStats(stat, value, mode = 'add') {
    if (mode === 'add') {
      this.stats[stat] = (this.stats[stat] || 0) + value;
    } else if (mode === 'set') {
      this.stats[stat] = value;
    } else if (mode === 'max') {
      this.stats[stat] = Math.max(this.stats[stat] || 0, value);
    }
    
    this.saveProgress();
  }
  
  recordBattleResult(result, battleData) {
    // Update win/loss
    if (result === 'victory') {
      this.updateStats('wins', 1);
      
      // Check for perfect victory
      if (battleData.playerTowersLost === 0) {
        this.updateStats('perfectWins', 1);
      }
      
      // Check for comeback
      if (battleData.playerTowersLost >= 2) {
        this.updateStats('comebackWins', 1);
      }
      
      // Check for quick win
      if (battleData.battleDuration <= 60) {
        this.updateStats('quickWins', 1);
      }
    } else if (result === 'defeat') {
      this.updateStats('losses', 1);
    }
    
    // Update towers destroyed
    this.updateStats('towersDestroyed', battleData.enemyTowersDestroyed);
    
    // Update gold earned
    this.updateStats('goldEarned', battleData.goldEarned);
    
    return this.checkAchievements();
  }
  
  recordUnitDeployed() {
    this.updateStats('unitsDeployed', 1);
    return this.checkAchievements();
  }
  
  recordCardsCollected(amount) {
    this.updateStats('cardsCollected', amount);
    return this.checkAchievements();
  }
  
  recordCardUpgrade(newLevel) {
    this.updateStats('maxCardLevel', newLevel, 'max');
    return this.checkAchievements();
  }
  
  recordDeckCreated() {
    this.updateStats('decksCreated', 1, 'max');
    return this.checkAchievements();
  }
  
  updateTrophies(trophies) {
    this.updateStats('trophies', trophies, 'set');
    return this.checkAchievements();
  }
  
  getAchievement(id) {
    return this.achievements[id];
  }
  
  getAllAchievements() {
    return Object.values(this.achievements);
  }
  
  getAchievementsByCategory(category) {
    return Object.values(this.achievements).filter(a => a.category === category);
  }
  
  getUnlockedAchievements() {
    return Object.values(this.achievements).filter(a => a.unlocked);
  }
  
  getLockedAchievements() {
    return Object.values(this.achievements).filter(a => !a.unlocked);
  }
  
  getProgress(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement) return null;
    
    const current = this.stats[achievement.tracker] || 0;
    const required = achievement.requirement;
    const percentage = Math.min(100, Math.round((current / required) * 100));
    
    return {
      current,
      required,
      percentage,
      unlocked: achievement.unlocked
    };
  }
  
  getTotalProgress() {
    const total = Object.keys(this.achievements).length;
    const unlocked = this.getUnlockedAchievements().length;
    return {
      unlocked,
      total,
      percentage: Math.round((unlocked / total) * 100)
    };
  }
  
  getCategories() {
    const categories = new Set();
    Object.values(this.achievements).forEach(a => categories.add(a.category));
    return Array.from(categories);
  }
  
  getCategoryProgress(category) {
    const categoryAchievements = this.getAchievementsByCategory(category);
    const unlocked = categoryAchievements.filter(a => a.unlocked).length;
    return {
      unlocked,
      total: categoryAchievements.length,
      percentage: Math.round((unlocked / categoryAchievements.length) * 100)
    };
  }
  
  claimRewards(achievementId, cardManager) {
    const achievement = this.achievements[achievementId];
    if (!achievement || !achievement.unlocked) return null;
    
    const rewards = achievement.rewards;
    const claimed = [];
    
    if (rewards.gold) {
      cardManager.addGold(rewards.gold);
      claimed.push({ type: 'gold', amount: rewards.gold });
    }
    
    if (rewards.cards) {
      // Give random cards
      const drops = cardManager.rewardCards(true); // Use victory drop rates
      claimed.push({ type: 'cards', amount: rewards.cards, cards: drops });
    }
    
    return claimed;
  }
  
  getCategoryName(category) {
    const names = {
      battle: 'Battle',
      trophies: 'Trophies',
      towers: 'Towers',
      units: 'Units',
      cards: 'Cards',
      upgrades: 'Upgrades',
      special: 'Special'
    };
    return names[category] || category;
  }
  
  getCategoryIcon(category) {
    const icons = {
      battle: '⚔️',
      trophies: '🏆',
      towers: '🗼',
      units: '🎖️',
      cards: '🃏',
      upgrades: '⬆️',
      special: '✨'
    };
    return icons[category] || '📋';
  }
}
