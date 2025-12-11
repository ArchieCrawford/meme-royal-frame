// Multiplayer Manager - Handles matchmaking and PvP connections
export class MultiplayerManager {
  constructor() {
    this.playerId = this.generatePlayerId();
    this.playerName = localStorage.getItem('playerName') || 'Guest';
    this.isMatchmaking = false;
    this.isInMatch = false;
    this.opponent = null;
    this.isHost = false;
    
    // Simulated network state (in production, use WebSocket/WebRTC)
    this.matchmakingQueue = [];
    this.activeMatches = new Map();
    
    // Network sync
    this.pendingActions = [];
    this.receivedActions = [];
    this.lastSyncTime = 0;
    this.syncInterval = 100; // ms
  }
  
  generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
  }
  
  setPlayerName(name) {
    this.playerName = name;
    localStorage.setItem('playerName', name);
  }
  
  // Start matchmaking
  startMatchmaking(onMatchFound, onMatchmakingUpdate) {
    this.isMatchmaking = true;
    this.onMatchFound = onMatchFound;
    this.onMatchmakingUpdate = onMatchmakingUpdate;
    
    // Simulate matchmaking search
    onMatchmakingUpdate('Searching for opponent...');
    
    // Simulate finding a match after 2-5 seconds
    const matchTime = 2000 + Math.random() * 3000;
    
    this.matchmakingTimeout = setTimeout(() => {
      this.findMatch();
    }, matchTime);
  }
  
  cancelMatchmaking() {
    this.isMatchmaking = false;
    if (this.matchmakingTimeout) {
      clearTimeout(this.matchmakingTimeout);
    }
  }
  
  findMatch() {
    if (!this.isMatchmaking) return;
    
    this.isMatchmaking = false;
    this.isInMatch = true;
    
    // Generate opponent data
    const opponentNames = [
      'CryptoKing', 'MemeL0rd', 'DogeWarrior', 'PepeChamp',
      'WojakMaster', 'ShibaCommander', 'VitalikFan', 'NFTHunter',
      'BlockchainBoss', 'DeFiDegen', 'MoonBoy', 'DiamondHands'
    ];
    
    this.opponent = {
      id: 'ai_opponent_' + Math.random().toString(36).substr(2, 9),
      name: opponentNames[Math.floor(Math.random() * opponentNames.length)],
      level: Math.floor(Math.random() * 10) + 1,
      trophies: Math.floor(Math.random() * 3000) + 1000,
      isAI: true // In real implementation, this would be false for real players
    };
    
    // Randomly determine who is host
    this.isHost = Math.random() > 0.5;
    
    this.onMatchmakingUpdate('Match found!');
    
    setTimeout(() => {
      this.onMatchFound(this.opponent);
    }, 1000);
  }
  
  // Send action to opponent (unit deployment, etc.)
  sendAction(action) {
    if (!this.isInMatch) return;
    
    const networkAction = {
      playerId: this.playerId,
      timestamp: Date.now(),
      action: action
    };
    
    this.pendingActions.push(networkAction);
    
    // Simulate network delay (50-150ms)
    const delay = 50 + Math.random() * 100;
    
    setTimeout(() => {
      // In real implementation, this would go through network
      // For now, we'll process it locally for AI opponent
      this.processOpponentAction(networkAction);
    }, delay);
  }
  
  processOpponentAction(networkAction) {
    // This would normally receive actions from the network
    // For now, return to game logic to handle
    this.receivedActions.push(networkAction);
  }
  
  getReceivedActions() {
    const actions = [...this.receivedActions];
    this.receivedActions = [];
    return actions;
  }
  
  // Sync game state
  syncGameState(gameState) {
    const now = Date.now();
    if (now - this.lastSyncTime < this.syncInterval) return;
    
    this.lastSyncTime = now;
    
    // In real implementation, send state to server/opponent
    // For now, just store locally
    this.lastGameState = gameState;
  }
  
  // End match
  endMatch(result, cardManager = null) {
    this.isInMatch = false;
    this.opponent = null;
    
    // Calculate rewards
    const rewards = this.calculateRewards(result, cardManager);
    
    return rewards;
  }
  
  calculateRewards(result, cardManager = null) {
    let trophyChange = 0;
    let goldEarned = 0;
    
    if (result === 'victory') {
      trophyChange = 25 + Math.floor(Math.random() * 10);
      goldEarned = 50 + Math.floor(Math.random() * 50);
    } else if (result === 'defeat') {
      trophyChange = -(15 + Math.floor(Math.random() * 10));
      goldEarned = 10 + Math.floor(Math.random() * 20);
    } else {
      trophyChange = 0;
      goldEarned = 20 + Math.floor(Math.random() * 30);
    }
    
    // Add card rewards if CardManager is provided
    let cardRewards = [];
    if (cardManager) {
      cardRewards = cardManager.rewardCards(result === 'victory');
    }
    
    return {
      trophyChange,
      goldEarned,
      cardRewards,
      result
    };
  }
  
  // AI opponent simulation
  getAIAction(gameState) {
    // Simple AI decision making
    if (!this.opponent || !this.opponent.isAI) return null;
    
    // Random chance to deploy a unit
    if (Math.random() > 0.85) {
      const unitTypes = ['doge-warrior', 'pepe-mage', 'bitcoin-knight', 'ethereum-archer', 'shiba-tank', 'wojak-healer'];
      const randomUnit = unitTypes[Math.floor(Math.random() * unitTypes.length)];
      
      // Random position in enemy territory
      const x = (Math.random() - 0.5) * 30;
      const z = Math.random() * 25 + 3;
      
      return {
        type: 'deploy',
        unitType: randomUnit,
        position: { x, z }
      };
    }
    
    return null;
  }
  
  // Get player stats
  getPlayerStats() {
    return {
      playerId: this.playerId,
      playerName: this.playerName,
      level: parseInt(localStorage.getItem('playerLevel') || '1'),
      trophies: parseInt(localStorage.getItem('playerTrophies') || '0'),
      wins: parseInt(localStorage.getItem('playerWins') || '0'),
      losses: parseInt(localStorage.getItem('playerLosses') || '0')
    };
  }
  
  updatePlayerStats(result, cardManager = null) {
    const stats = this.getPlayerStats();
    const rewards = this.calculateRewards(result, cardManager);
    
    stats.trophies = Math.max(0, stats.trophies + rewards.trophyChange);
    
    if (result === 'victory') {
      stats.wins++;
    } else if (result === 'defeat') {
      stats.losses++;
    }
    
    // Level up every 10 wins
    stats.level = Math.floor(stats.wins / 10) + 1;
    
    localStorage.setItem('playerLevel', stats.level.toString());
    localStorage.setItem('playerTrophies', stats.trophies.toString());
    localStorage.setItem('playerWins', stats.wins.toString());
    localStorage.setItem('playerLosses', stats.losses.toString());
    
    // Add gold rewards
    if (cardManager) {
      cardManager.addGold(rewards.goldEarned);
    }
    
    return { stats, rewards };
  }
}
