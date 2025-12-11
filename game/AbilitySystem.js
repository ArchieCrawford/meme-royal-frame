import * as THREE from 'three';

// Special ability definitions for each unit
export const ABILITIES = {
  'bonkhouse': {
    name: 'Legendary Strike',
    description: 'Unleashes a devastating area attack dealing 400 damage and stunning enemies for 2 seconds',
    cooldown: 30000, // 30 seconds - legendary cooldown
    duration: 2000, // 2 second stun effect
    icon: '👑',
    color: 0xff00ff,
    execute: (unit, scene, enemyUnits, enemyTowers) => {
      // Hero ability - massive AoE with stun
      const strikeRange = 6;
      const strikeDamage = 400;
      const affectedEnemies = [];
      
      return {
        onActivate: () => {
          unit.abilityActive = true;
          
          // Play epic legendary strike sound effect
          if (unit.soundManager) {
            unit.soundManager.playLegendaryStrike();
          }
          
          // Create epic legendary shockwave visual
          if (unit.particleManager) {
            unit.particleManager.createShockwave(unit.mesh.position.clone(), strikeRange, 0xff00ff);
            unit.particleManager.createExplosion(unit.mesh.position.clone(), 0xffd700);
          }
          
          // Damage and stun all enemies in range
          enemyUnits.forEach(enemy => {
            if (!enemy.destroyed) {
              const distance = unit.getDistance(enemy);
              if (distance <= strikeRange) {
                enemy.takeDamage(strikeDamage);
                // Store stunned enemies
                affectedEnemies.push(enemy);
                enemy.stunned = true;
              }
            }
          });
          
          // Also damage towers in range
          enemyTowers.forEach(tower => {
            if (!tower.destroyed) {
              const dist = Math.sqrt(
                Math.pow(unit.mesh.position.x - tower.x, 2) +
                Math.pow(unit.mesh.position.z - tower.z, 2)
              );
              if (dist <= strikeRange) {
                tower.takeDamage(strikeDamage);
              }
            }
          });
        },
        onUpdate: (delta, elapsed) => {
          // Legendary purple/gold pulsing aura during stun duration
          if (unit.mesh && unit.is3DModel) {
            const pulse = 1 + Math.sin(elapsed * 0.012) * 0.4;
            const colorMix = (Math.sin(elapsed * 0.005) + 1) / 2;
            const color = new THREE.Color().lerpColors(
              new THREE.Color(0xff00ff), // Purple
              new THREE.Color(0xffd700), // Gold
              colorMix
            );
            
            unit.mesh.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.emissive = color;
                child.material.emissiveIntensity = pulse * 0.7;
              }
            });
          }
        },
        onEnd: () => {
          unit.abilityActive = false;
          
          // Remove stun from all affected enemies
          affectedEnemies.forEach(enemy => {
            if (!enemy.destroyed) {
              enemy.stunned = false;
            }
          });
          
          // Remove glow
          if (unit.mesh && unit.is3DModel) {
            unit.mesh.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.emissive = new THREE.Color(0x000000);
                child.material.emissiveIntensity = 0;
              }
            });
          }
        }
      };
    }
  },
  
  'doge-warrior': {
    name: 'Berserker Rage',
    description: 'Increases attack speed by 100% for 4 seconds',
    cooldown: 15000, // 15 seconds
    duration: 4000, // 4 seconds
    icon: '⚔️',
    color: 0xff6600,
    execute: (unit) => {
      // Store original attack speed
      const originalSpeed = unit.attackSpeed;
      unit.attackSpeed = originalSpeed / 2; // Half the time = double speed
      
      // Visual indicator - glowing red aura
      return {
        onActivate: () => {
          unit.abilityActive = true;
          unit.originalAttackSpeed = originalSpeed;
          
          // Play ability sound
          if (unit.soundManager) {
            unit.soundManager.playAbilityActivate();
          }
        },
        onUpdate: (delta, elapsed) => {
          // Pulsing red glow effect
          if (unit.mesh && unit.is3DModel) {
            const pulse = 1 + Math.sin(elapsed * 0.01) * 0.3;
            unit.mesh.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.emissive = new THREE.Color(0xff0000);
                child.material.emissiveIntensity = pulse * 0.5;
              }
            });
          }
        },
        onEnd: () => {
          unit.attackSpeed = unit.originalAttackSpeed;
          unit.abilityActive = false;
          
          // Remove glow
          if (unit.mesh && unit.is3DModel) {
            unit.mesh.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.emissive = new THREE.Color(0x000000);
                child.material.emissiveIntensity = 0;
              }
            });
          }
        }
      };
    }
  },
  
  'bitcoin-knight': {
    name: 'Golden Shield',
    description: 'Reduces incoming damage by 75% for 5 seconds',
    cooldown: 20000, // 20 seconds
    duration: 5000, // 5 seconds
    icon: '🛡️',
    color: 0xffd700,
    execute: (unit) => {
      unit.damageReduction = 0.75; // 75% damage reduction
      
      return {
        onActivate: () => {
          unit.abilityActive = true;
          
          // Play ability sound
          if (unit.soundManager) {
            unit.soundManager.playAbilityActivate();
          }
          
          // Create shield visual effect
          if (unit.particleManager) {
            unit.particleManager.createShieldEffect(unit.mesh.position.clone(), 0xffd700);
          }
        },
        onUpdate: (delta, elapsed) => {
          // Rotating golden particles around unit
          if (unit.particleManager && elapsed % 500 < 50) {
            const pos = unit.mesh.position.clone();
            pos.y += 1;
            unit.particleManager.createShieldParticle(pos, 0xffd700);
          }
          
          // Golden glow
          if (unit.mesh && unit.is3DModel) {
            const pulse = 1 + Math.sin(elapsed * 0.008) * 0.2;
            unit.mesh.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.emissive = new THREE.Color(0xffd700);
                child.material.emissiveIntensity = pulse * 0.4;
              }
            });
          }
        },
        onEnd: () => {
          unit.damageReduction = 0;
          unit.abilityActive = false;
          
          // Remove glow
          if (unit.mesh && unit.is3DModel) {
            unit.mesh.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.emissive = new THREE.Color(0x000000);
                child.material.emissiveIntensity = 0;
              }
            });
          }
        }
      };
    }
  },
  
  'shiba-tank': {
    name: 'Ground Slam',
    description: 'AoE attack dealing 200 damage to all enemies within 5 units',
    cooldown: 25000, // 25 seconds
    duration: 0, // Instant
    icon: '💥',
    color: 0xff4444,
    execute: (unit, scene, enemyUnits, enemyTowers) => {
      // Find all enemies within range
      const slamRange = 5;
      const slamDamage = 200;
      
      return {
        onActivate: () => {
          // Play ability sound
          if (unit.soundManager) {
            unit.soundManager.playAbilityActivate();
          }
          
          // Create shockwave visual
          if (unit.particleManager) {
            unit.particleManager.createShockwave(unit.mesh.position.clone(), slamRange);
          }
          
          // Damage all enemies in range
          enemyUnits.forEach(enemy => {
            if (!enemy.destroyed) {
              const distance = unit.getDistance(enemy);
              if (distance <= slamRange) {
                enemy.takeDamage(slamDamage);
              }
            }
          });
          
          // Also damage towers in range
          enemyTowers.forEach(tower => {
            if (!tower.destroyed) {
              const dist = Math.sqrt(
                Math.pow(unit.mesh.position.x - tower.x, 2) +
                Math.pow(unit.mesh.position.z - tower.z, 2)
              );
              if (dist <= slamRange) {
                tower.takeDamage(slamDamage);
              }
            }
          });
        },
        onUpdate: () => {},
        onEnd: () => {}
      };
    }
  },
  
  'laser-punk': {
    name: 'Overcharge',
    description: 'Next 3 attacks deal 50% more damage and pierce targets',
    cooldown: 18000, // 18 seconds
    duration: 0, // Until 3 shots
    icon: '⚡',
    color: 0x00ffff,
    execute: (unit) => {
      unit.overchargeShots = 3;
      unit.overchargeDamageBoost = 1.5;
      
      return {
        onActivate: () => {
          unit.abilityActive = true;
          
          // Play ability sound
          if (unit.soundManager) {
            unit.soundManager.playAbilityActivate();
          }
          
          // Electric aura
          if (unit.particleManager) {
            unit.particleManager.createElectricAura(unit.mesh.position.clone(), 0x00ffff);
          }
        },
        onUpdate: (delta, elapsed) => {
          // Check if all shots used
          if (unit.overchargeShots <= 0) {
            return true; // Signal to end ability early
          }
          
          // Electric crackling effect
          if (unit.mesh && unit.is3DModel) {
            const pulse = 1 + Math.sin(elapsed * 0.015) * 0.5;
            unit.mesh.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.emissive = new THREE.Color(0x00ffff);
                child.material.emissiveIntensity = pulse * 0.6;
              }
            });
          }
        },
        onEnd: () => {
          unit.overchargeShots = 0;
          unit.overchargeDamageBoost = 1;
          unit.abilityActive = false;
          
          // Remove glow
          if (unit.mesh && unit.is3DModel) {
            unit.mesh.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.emissive = new THREE.Color(0x000000);
                child.material.emissiveIntensity = 0;
              }
            });
          }
        }
      };
    }
  },
  
  'pepe-mage': {
    name: 'Arcane Blast',
    description: 'Fires a powerful spell dealing 300 damage to target',
    cooldown: 20000, // 20 seconds
    duration: 0, // Instant
    icon: '🔮',
    color: 0x9933ff,
    execute: (unit) => {
      return {
        onActivate: () => {
          if (unit.currentTarget && !unit.currentTarget.destroyed) {
            // Deal massive damage
            unit.currentTarget.takeDamage(300);
            
            // Create magic explosion
            if (unit.particleManager) {
              const targetPos = unit.currentTarget.mesh ? 
                unit.currentTarget.mesh.position.clone() :
                new THREE.Vector3(unit.currentTarget.x, 1, unit.currentTarget.z);
              unit.particleManager.createMagicExplosion(targetPos, 0x9933ff);
            }
          }
        },
        onUpdate: () => {},
        onEnd: () => {}
      };
    }
  },
  
  'ethereum-archer': {
    name: 'Multishot',
    description: 'Fires 5 arrows at once, hitting up to 5 targets',
    cooldown: 16000, // 16 seconds
    duration: 0, // Instant
    icon: '🏹',
    color: 0x00ff88,
    execute: (unit, scene, enemyUnits, enemyTowers) => {
      return {
        onActivate: () => {
          // Find up to 5 targets
          const targets = [];
          const allTargets = [...enemyUnits.filter(u => !u.destroyed), ...enemyTowers.filter(t => !t.destroyed)];
          
          // Sort by distance and take closest 5
          allTargets.sort((a, b) => {
            const distA = unit.getDistance(a);
            const distB = unit.getDistance(b);
            return distA - distB;
          });
          
          const targetCount = Math.min(5, allTargets.length);
          for (let i = 0; i < targetCount; i++) {
            const target = allTargets[i];
            const distance = unit.getDistance(target);
            
            if (distance <= unit.attackRange + 3) {
              // Deal damage
              target.takeDamage(unit.damage);
              
              // Create arrow projectile
              const targetPos = target.mesh ? 
                target.mesh.position.clone() :
                new THREE.Vector3(target.x, 3, target.z);
              
              if (unit.particleManager) {
                unit.particleManager.createArrowProjectile(
                  unit.mesh.position.clone(),
                  targetPos,
                  unit.isPlayer ? 0x4488ff : 0xff4444,
                  scene
                );
              }
            }
          }
        },
        onUpdate: () => {},
        onEnd: () => {}
      };
    }
  },
  
  'wojak-healer': {
    name: 'Mass Heal',
    description: 'Heals all friendly units within 8 units for 150 HP',
    cooldown: 22000, // 22 seconds
    duration: 0, // Instant
    icon: '💚',
    color: 0x44ff44,
    execute: (unit, scene, friendlyUnits) => {
      return {
        onActivate: () => {
          const healRange = 8;
          const healAmount = 150;
          
          // Heal all friendlies in range
          friendlyUnits.forEach(ally => {
            if (!ally.destroyed && ally !== unit) {
              const distance = Math.sqrt(
                Math.pow(unit.mesh.position.x - ally.mesh.position.x, 2) +
                Math.pow(unit.mesh.position.z - ally.mesh.position.z, 2)
              );
              
              if (distance <= healRange) {
                ally.heal(healAmount);
                
                // Healing beam
                if (unit.particleManager) {
                  unit.particleManager.createHealingBeam(
                    unit.mesh.position.clone(),
                    ally.mesh.position.clone(),
                    scene
                  );
                }
              }
            }
          });
          
          // Create mass heal visual
          if (unit.particleManager) {
            unit.particleManager.createMassHealEffect(unit.mesh.position.clone(), healRange);
          }
        },
        onUpdate: () => {},
        onEnd: () => {}
      };
    }
  }
};

// Ability manager for tracking cooldowns and active abilities
export class AbilityManager {
  constructor() {
    this.activeAbilities = new Map(); // unitId -> { ability, startTime, duration, handler }
    this.cooldowns = new Map(); // unitId -> cooldownEndTime
  }
  
  canUseAbility(unitId, unitKey) {
    const ability = ABILITIES[unitKey];
    if (!ability) return false;
    
    const now = Date.now();
    const cooldownEnd = this.cooldowns.get(unitId) || 0;
    
    return now >= cooldownEnd;
  }
  
  useAbility(unit, scene, enemyUnits, enemyTowers, friendlyUnits) {
    const ability = ABILITIES[unit.unitKey];
    if (!ability) return false;
    
    const unitId = unit.id || unit.mesh.uuid;
    
    if (!this.canUseAbility(unitId, unit.unitKey)) {
      return false;
    }
    
    // Execute ability
    const handler = ability.execute(unit, scene, enemyUnits, enemyTowers, friendlyUnits);
    
    // Call onActivate
    if (handler.onActivate) {
      handler.onActivate();
    }
    
    // Set cooldown
    this.cooldowns.set(unitId, Date.now() + ability.cooldown);
    
    // Track active ability if it has duration
    if (ability.duration > 0) {
      this.activeAbilities.set(unitId, {
        ability,
        startTime: Date.now(),
        duration: ability.duration,
        handler
      });
    } else if (handler.onEnd) {
      // Instant abilities still call onEnd
      handler.onEnd();
    }
    
    return true;
  }
  
  update(delta) {
    const now = Date.now();
    
    // Update all active abilities
    for (const [unitId, data] of this.activeAbilities.entries()) {
      const elapsed = now - data.startTime;
      
      if (data.handler.onUpdate) {
        const shouldEnd = data.handler.onUpdate(delta, elapsed);
        if (shouldEnd) {
          // Ability requests early end
          if (data.handler.onEnd) {
            data.handler.onEnd();
          }
          this.activeAbilities.delete(unitId);
          continue;
        }
      }
      
      // Check if duration expired
      if (elapsed >= data.duration) {
        if (data.handler.onEnd) {
          data.handler.onEnd();
        }
        this.activeAbilities.delete(unitId);
      }
    }
  }
  
  getCooldownRemaining(unitId, unitKey) {
    const ability = ABILITIES[unitKey];
    if (!ability) return 0;
    
    const cooldownEnd = this.cooldowns.get(unitId) || 0;
    const remaining = Math.max(0, cooldownEnd - Date.now());
    
    return remaining;
  }
  
  getCooldownPercent(unitId, unitKey) {
    const ability = ABILITIES[unitKey];
    if (!ability) return 1;
    
    const remaining = this.getCooldownRemaining(unitId, unitKey);
    return 1 - (remaining / ability.cooldown);
  }
  
  cleanup(unitId) {
    // Clean up when unit is destroyed
    this.activeAbilities.delete(unitId);
    this.cooldowns.delete(unitId);
  }
}
