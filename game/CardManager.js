// Card Manager - Handles card collection, levels, and upgrades
import { CONFIG } from './config.js';

export class CardManager {
  constructor() {
    this.loadCollection();
    this.loadDecks();
  }
  
  loadCollection() {
    const savedCollection = localStorage.getItem('cardCollection');
    if (savedCollection) {
      this.collection = JSON.parse(savedCollection);
    } else {
      // Initialize with starting cards
      this.collection = {};
      Object.keys(CONFIG.UNITS).forEach(unitId => {
        this.collection[unitId] = {
          level: 1,
          count: 10, // Starting with 10 cards each
          totalCollected: 10
        };
      });
      this.saveCollection();
    }
  }
  
  loadDecks() {
    const savedDecks = localStorage.getItem('playerDecks');
    if (savedDecks) {
      this.decks = JSON.parse(savedDecks);
    } else {
      // Initialize with default deck (all available cards)
      const allCards = Object.keys(CONFIG.UNITS);
      // Fill deck with all available cards, duplicate if less than 8
      const defaultDeck = [...allCards];
      while (defaultDeck.length < 8) {
        defaultDeck.push(allCards[defaultDeck.length % allCards.length]);
      }
      
      this.decks = {
        activeDeck: 0,
        decks: [
          {
            name: 'Deck 1',
            cards: defaultDeck.slice(0, 8)
          },
          {
            name: 'Deck 2',
            cards: defaultDeck.slice(0, 8)
          },
          {
            name: 'Deck 3',
            cards: defaultDeck.slice(0, 8)
          }
        ]
      };
      this.saveDecks();
    }
  }
  
  saveDecks() {
    localStorage.setItem('playerDecks', JSON.stringify(this.decks));
  }
  
  getActiveDeck() {
    return this.decks.decks[this.decks.activeDeck];
  }
  
  getActiveDeckCards() {
    return this.getActiveDeck().cards;
  }
  
  setActiveDeck(index) {
    if (index >= 0 && index < this.decks.decks.length) {
      this.decks.activeDeck = index;
      this.saveDecks();
      return true;
    }
    return false;
  }
  
  updateDeck(deckIndex, cards) {
    if (deckIndex >= 0 && deckIndex < this.decks.decks.length) {
      if (cards.length === 8) {
        // Validate all cards exist in collection
        const allValid = cards.every(cardId => this.collection[cardId]);
        if (allValid) {
          this.decks.decks[deckIndex].cards = cards;
          this.saveDecks();
          return { success: true };
        }
        return { success: false, error: 'Invalid cards' };
      }
      return { success: false, error: 'Deck must have exactly 8 cards' };
    }
    return { success: false, error: 'Invalid deck index' };
  }
  
  renameDeck(deckIndex, newName) {
    if (deckIndex >= 0 && deckIndex < this.decks.decks.length) {
      this.decks.decks[deckIndex].name = newName.substring(0, 20);
      this.saveDecks();
      return true;
    }
    return false;
  }
  
  getAllDecks() {
    return this.decks.decks.map((deck, index) => ({
      ...deck,
      isActive: index === this.decks.activeDeck
    }));
  }
  
  saveCollection() {
    localStorage.setItem('cardCollection', JSON.stringify(this.collection));
  }
  
  getCard(unitId) {
    return this.collection[unitId] || { level: 1, count: 0, totalCollected: 0 };
  }
  
  addCards(unitId, amount = 1) {
    if (!this.collection[unitId]) {
      this.collection[unitId] = { level: 1, count: 0, totalCollected: 0 };
    }
    
    this.collection[unitId].count += amount;
    this.collection[unitId].totalCollected += amount;
    this.saveCollection();
  }
  
  canUpgrade(unitId) {
    const card = this.getCard(unitId);
    const unitData = CONFIG.UNITS[unitId];
    if (!unitData) return false;
    
    const rarity = unitData.rarity;
    const requirements = CONFIG.UPGRADE_REQUIREMENTS[rarity];
    const costs = CONFIG.UPGRADE_COSTS[rarity];
    
    // Check if at max level
    if (card.level >= requirements.length + 1) {
      return { canUpgrade: false, reason: 'Max level reached' };
    }
    
    const requiredCards = requirements[card.level - 1];
    const requiredGold = costs[card.level - 1];
    const currentGold = this.getGold();
    
    if (card.count < requiredCards) {
      return { 
        canUpgrade: false, 
        reason: 'Not enough cards',
        required: requiredCards,
        current: card.count
      };
    }
    
    if (currentGold < requiredGold) {
      return { 
        canUpgrade: false, 
        reason: 'Not enough gold',
        required: requiredGold,
        current: currentGold
      };
    }
    
    return { 
      canUpgrade: true,
      requiredCards,
      requiredGold
    };
  }
  
  upgradeCard(unitId) {
    const upgradeCheck = this.canUpgrade(unitId);
    if (!upgradeCheck.canUpgrade) {
      return { success: false, ...upgradeCheck };
    }
    
    const card = this.getCard(unitId);
    const unitData = CONFIG.UNITS[unitId];
    
    // Deduct cards and gold
    card.count -= upgradeCheck.requiredCards;
    card.level += 1;
    
    const currentGold = this.getGold();
    this.setGold(currentGold - upgradeCheck.requiredGold);
    
    this.collection[unitId] = card;
    this.saveCollection();
    
    return {
      success: true,
      newLevel: card.level,
      cardsUsed: upgradeCheck.requiredCards,
      goldUsed: upgradeCheck.requiredGold
    };
  }
  
  getUpgradeInfo(unitId) {
    const card = this.getCard(unitId);
    const unitData = CONFIG.UNITS[unitId];
    if (!unitData) return null;
    
    const rarity = unitData.rarity;
    const requirements = CONFIG.UPGRADE_REQUIREMENTS[rarity];
    const costs = CONFIG.UPGRADE_COSTS[rarity];
    
    const maxLevel = requirements.length + 1;
    const isMaxLevel = card.level >= maxLevel;
    
    let nextLevelInfo = null;
    if (!isMaxLevel) {
      nextLevelInfo = {
        requiredCards: requirements[card.level - 1],
        requiredGold: costs[card.level - 1],
        hasEnoughCards: card.count >= requirements[card.level - 1],
        hasEnoughGold: this.getGold() >= costs[card.level - 1]
      };
    }
    
    return {
      unitId,
      name: unitData.name,
      rarity,
      level: card.level,
      count: card.count,
      totalCollected: card.totalCollected,
      maxLevel,
      isMaxLevel,
      nextLevelInfo
    };
  }
  
  getAllCards() {
    return Object.keys(CONFIG.UNITS).map(unitId => this.getUpgradeInfo(unitId));
  }
  
  // Gold management
  getGold() {
    return parseInt(localStorage.getItem('playerGold') || '500');
  }
  
  setGold(amount) {
    localStorage.setItem('playerGold', Math.max(0, amount).toString());
  }
  
  addGold(amount) {
    const current = this.getGold();
    this.setGold(current + amount);
  }
  
  // Reward cards after battle (random drops)
  rewardCards(victory = true) {
    const drops = [];
    
    // Number of card drops based on result
    const dropCount = victory ? (3 + Math.floor(Math.random() * 3)) : (1 + Math.floor(Math.random() * 2));
    
    for (let i = 0; i < dropCount; i++) {
      // Random card weighted by rarity
      const roll = Math.random();
      let targetRarity;
      
      if (roll < 0.6) {
        targetRarity = 'common'; // 60% chance
      } else if (roll < 0.85) {
        targetRarity = 'rare'; // 25% chance
      } else if (roll < 0.97) {
        targetRarity = 'epic'; // 12% chance
      } else {
        targetRarity = 'legendary'; // 3% chance
      }
      
      // Find cards of that rarity
      const cardsOfRarity = Object.keys(CONFIG.UNITS).filter(
        unitId => CONFIG.UNITS[unitId].rarity === targetRarity
      );
      
      if (cardsOfRarity.length > 0) {
        const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
        
        // Amount based on rarity
        let amount = 1;
        if (targetRarity === 'common') {
          amount = 1 + Math.floor(Math.random() * 4); // 1-4 cards
        } else if (targetRarity === 'rare') {
          amount = 1 + Math.floor(Math.random() * 2); // 1-2 cards
        }
        
        this.addCards(randomCard, amount);
        drops.push({
          unitId: randomCard,
          name: CONFIG.UNITS[randomCard].name,
          rarity: targetRarity,
          amount
        });
      }
    }
    
    return drops;
  }
  
  // Get rarity color for UI
  static getRarityColor(rarity) {
    const colors = {
      common: '#95a5a6',
      rare: '#3498db',
      epic: '#9b59b6',
      legendary: '#f39c12'
    };
    return colors[rarity] || '#95a5a6';
  }
  
  // Get rarity name
  static getRarityName(rarity) {
    const names = {
      common: 'Common',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary'
    };
    return names[rarity] || 'Common';
  }
}
