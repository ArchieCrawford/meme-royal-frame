import * as THREE from 'three';

export class ParticleManager {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
  }

  // Melee hit effect - sparks and flash
  createMeleeHitEffect(position, isPlayer) {
    const color = isPlayer ? 0xffaa00 : 0xff4444;
    const sparkCount = 8;

    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount;
      const speed = 0.15 + Math.random() * 0.1;
      
      const geometry = new THREE.SphereGeometry(0.1, 4, 4);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1
      });
      
      const spark = new THREE.Mesh(geometry, material);
      spark.position.copy(position);
      
      this.scene.add(spark);
      
      this.particles.push({
        mesh: spark,
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          0.2 + Math.random() * 0.2,
          Math.sin(angle) * speed
        ),
        life: 1.0,
        fadeRate: 0.05,
        gravity: -0.01,
        shrinkRate: 0.02
      });
    }
  }

  // Ranged projectile trail
  createProjectileTrail(position, color) {
    const geometry = new THREE.SphereGeometry(0.08, 6, 6);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6
    });
    
    const trail = new THREE.Mesh(geometry, material);
    trail.position.copy(position);
    this.scene.add(trail);
    
    this.particles.push({
      mesh: trail,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 0.6,
      fadeRate: 0.08,
      shrinkRate: 0.05
    });
  }

  // Explosion effect
  createExplosion(position, size = 1, color = 0xff6600) {
    // Main explosion flash
    const flashGeometry = new THREE.SphereGeometry(size, 16, 16);
    const flashMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff88,
      transparent: true,
      opacity: 1
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.copy(position);
    this.scene.add(flash);
    
    this.particles.push({
      mesh: flash,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 1.0,
      fadeRate: 0.1,
      expandRate: 0.3,
      colorShift: color
    });

    // Explosion particles
    const particleCount = 20 + Math.floor(size * 10);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      const speed = 0.2 + Math.random() * 0.3;
      
      const pSize = 0.1 + Math.random() * 0.2 * size;
      const geometry = new THREE.SphereGeometry(pSize, 6, 6);
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? color : 0xff8800,
        transparent: true,
        opacity: 1
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      this.scene.add(particle);
      
      this.particles.push({
        mesh: particle,
        velocity: new THREE.Vector3(
          Math.cos(angle) * Math.cos(elevation) * speed,
          Math.sin(elevation) * speed + 0.3,
          Math.sin(angle) * Math.cos(elevation) * speed
        ),
        life: 1.0,
        fadeRate: 0.03 + Math.random() * 0.02,
        gravity: -0.015,
        shrinkRate: 0.01
      });
    }

    // Smoke particles
    const smokeCount = 8 + Math.floor(size * 4);
    for (let i = 0; i < smokeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.05 + Math.random() * 0.1;
      
      const geometry = new THREE.SphereGeometry(0.3 * size, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.6
      });
      
      const smoke = new THREE.Mesh(geometry, material);
      smoke.position.copy(position);
      smoke.position.y += 0.5;
      this.scene.add(smoke);
      
      this.particles.push({
        mesh: smoke,
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          0.15 + Math.random() * 0.1,
          Math.sin(angle) * speed
        ),
        life: 1.0,
        fadeRate: 0.015,
        expandRate: 0.05,
        gravity: 0.005 // Smoke rises
      });
    }
  }

  // Healing particles
  createHealEffect(position) {
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
      const radius = 0.5 + Math.random() * 0.5;
      
      const geometry = new THREE.SphereGeometry(0.12, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0x44ff44,
        transparent: true,
        opacity: 0.9
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        position.x + Math.cos(angle) * radius,
        position.y - 0.5,
        position.z + Math.sin(angle) * radius
      );
      this.scene.add(particle);
      
      this.particles.push({
        mesh: particle,
        velocity: new THREE.Vector3(0, 0.25 + Math.random() * 0.15, 0),
        life: 1.0,
        fadeRate: 0.03,
        shrinkRate: 0.015,
        spiral: {
          center: position,
          angle: angle,
          radius: radius,
          speed: 0.1
        }
      });
    }

    // Bright center glow
    const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x88ff88,
      transparent: true,
      opacity: 0.8
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(position);
    this.scene.add(glow);
    
    this.particles.push({
      mesh: glow,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 1.0,
      fadeRate: 0.08,
      expandRate: 0.15
    });
  }

  // Death/destruction particles
  createDeathEffect(position, isPlayer) {
    const color = isPlayer ? 0x4488ff : 0xff4444;
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.2;
      
      const geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      particle.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      this.scene.add(particle);
      
      this.particles.push({
        mesh: particle,
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          0.2 + Math.random() * 0.3,
          Math.sin(angle) * speed
        ),
        rotation: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ),
        life: 1.0,
        fadeRate: 0.025,
        gravity: -0.02,
        shrinkRate: 0.015
      });
    }
  }

  // Deploy effect when units spawn
  createDeployEffect(position, isPlayer) {
    const color = isPlayer ? 0x4488ff : 0xff4444;
    
    // Ring expansion
    const ringGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(position);
    ring.position.y = 0.05;
    ring.rotation.x = -Math.PI / 2;
    this.scene.add(ring);
    
    this.particles.push({
      mesh: ring,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 1.0,
      fadeRate: 0.06,
      expandRate: 0.25,
      isRing: true
    });

    // Upward particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const radius = 0.5 + Math.random() * 0.5;
      
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        position.x + Math.cos(angle) * radius,
        position.y,
        position.z + Math.sin(angle) * radius
      );
      this.scene.add(particle);
      
      this.particles.push({
        mesh: particle,
        velocity: new THREE.Vector3(0, 0.3 + Math.random() * 0.2, 0),
        rotation: new THREE.Vector3(
          Math.random() * 0.2,
          Math.random() * 0.2,
          Math.random() * 0.2
        ),
        life: 1.0,
        fadeRate: 0.04,
        shrinkRate: 0.02
      });
    }
  }

  // Laser impact effect for Laser Punk
  createLaserImpact(position, laserColor) {
    // Electric sparks radiating outward
    const sparkCount = 12;
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.3;
      const elevation = (Math.random() - 0.5) * 0.5;
      const speed = 0.2 + Math.random() * 0.15;
      
      const geometry = new THREE.BoxGeometry(0.15, 0.05, 0.05);
      const material = new THREE.MeshBasicMaterial({
        color: laserColor,
        transparent: true,
        opacity: 1,
        emissive: laserColor,
        emissiveIntensity: 1
      });
      
      const spark = new THREE.Mesh(geometry, material);
      spark.position.copy(position);
      
      // Rotate spark to face direction of movement
      spark.rotation.y = angle;
      spark.rotation.z = elevation;
      
      this.scene.add(spark);
      
      this.particles.push({
        mesh: spark,
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          elevation * speed,
          Math.sin(angle) * speed
        ),
        life: 1.0,
        fadeRate: 0.05,
        shrinkRate: 0.03
      });
    }

    // Energy ring expansion
    const ringGeometry = new THREE.RingGeometry(0.2, 0.3, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: laserColor,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      emissive: laserColor,
      emissiveIntensity: 0.8
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(position);
    ring.rotation.x = -Math.PI / 2;
    this.scene.add(ring);
    
    this.particles.push({
      mesh: ring,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 1.0,
      fadeRate: 0.08,
      expandRate: 0.3,
      isRing: true
    });

    // Small energy orbs
    const orbCount = 8;
    for (let i = 0; i < orbCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.1;
      
      const geometry = new THREE.SphereGeometry(0.08, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: laserColor,
        transparent: true,
        opacity: 1,
        emissive: laserColor,
        emissiveIntensity: 1.5
      });
      
      const orb = new THREE.Mesh(geometry, material);
      orb.position.copy(position);
      this.scene.add(orb);
      
      this.particles.push({
        mesh: orb,
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          0.1 + Math.random() * 0.15,
          Math.sin(angle) * speed
        ),
        life: 1.0,
        fadeRate: 0.04,
        gravity: -0.01,
        shrinkRate: 0.02
      });
    }

    // Center flash
    const flashGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const flashMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      emissive: 0xffffff,
      emissiveIntensity: 2
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.copy(position);
    this.scene.add(flash);
    
    this.particles.push({
      mesh: flash,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 1.0,
      fadeRate: 0.15,
      expandRate: 0.2
    });
  }

  // Tower destruction effect
  createTowerExplosion(position) {
    // Multiple explosion waves
    for (let wave = 0; wave < 3; wave++) {
      setTimeout(() => {
        this.createExplosion(
          new THREE.Vector3(
            position.x + (Math.random() - 0.5) * 2,
            position.y + wave * 1.5,
            position.z + (Math.random() - 0.5) * 2
          ),
          1.5 + wave * 0.5,
          wave === 0 ? 0xff0000 : 0xff6600
        );
      }, wave * 150);
    }

    // Debris
    const debrisCount = 30;
    for (let i = 0; i < debrisCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.4;
      const size = 0.2 + Math.random() * 0.3;
      
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshBasicMaterial({
        color: [0x666666, 0x888888, 0x444444][Math.floor(Math.random() * 3)],
        transparent: true,
        opacity: 1
      });
      
      const debris = new THREE.Mesh(geometry, material);
      debris.position.copy(position);
      debris.position.y += Math.random() * 2;
      debris.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      this.scene.add(debris);
      
      this.particles.push({
        mesh: debris,
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          0.4 + Math.random() * 0.5,
          Math.sin(angle) * speed
        ),
        rotation: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        ),
        life: 1.0,
        fadeRate: 0.015,
        gravity: -0.025,
        bounce: 0.3 // Debris bounces
      });
    }
  }

  // Level up effect
  createLevelUpEffect(position) {
    // Golden spiral particles
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const height = (i / particleCount) * 4;
      const angle = (i / particleCount) * Math.PI * 6;
      const radius = 0.8;
      
      const geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffdd00,
        transparent: true,
        opacity: 0.9
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        position.x + Math.cos(angle) * radius,
        position.y + height - 2,
        position.z + Math.sin(angle) * radius
      );
      this.scene.add(particle);
      
      this.particles.push({
        mesh: particle,
        velocity: new THREE.Vector3(0, 0.15, 0),
        life: 1.0,
        fadeRate: 0.02,
        shrinkRate: 0.01,
        delay: i * 0.02
      });
    }

    // Central burst
    const burstCount = 16;
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount;
      const speed = 0.25;
      
      const geometry = new THREE.SphereGeometry(0.15, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffdd00 : 0xffaa00,
        transparent: true,
        opacity: 1
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      this.scene.add(particle);
      
      this.particles.push({
        mesh: particle,
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          0.2,
          Math.sin(angle) * speed
        ),
        life: 1.0,
        fadeRate: 0.04,
        shrinkRate: 0.02
      });
    }
  }

  // Shield effect for abilities
  createShieldEffect(position, color) {
    // Large shield sphere
    const shieldGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const shieldMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.position.copy(position);
    this.scene.add(shield);
    
    this.particles.push({
      mesh: shield,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 1.0,
      fadeRate: 0.02,
      rotation: new THREE.Vector3(0, 0.02, 0.01)
    });
  }

  createShieldParticle(position, color) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.2;
    
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      emissive: color,
      emissiveIntensity: 0.5
    });
    
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(
      position.x + Math.cos(angle) * radius,
      position.y,
      position.z + Math.sin(angle) * radius
    );
    this.scene.add(particle);
    
    this.particles.push({
      mesh: particle,
      velocity: new THREE.Vector3(0, 0.1, 0),
      life: 1.0,
      fadeRate: 0.05,
      spiral: {
        center: position,
        angle: angle,
        radius: radius,
        speed: 0.15
      }
    });
  }

  // Shockwave for ground slam
  createShockwave(position, radius) {
    // Multiple expanding rings
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const ringGeometry = new THREE.RingGeometry(0.5, 1, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xff4444,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(position);
        ring.position.y = 0.1;
        ring.rotation.x = -Math.PI / 2;
        this.scene.add(ring);
        
        this.particles.push({
          mesh: ring,
          velocity: new THREE.Vector3(0, 0, 0),
          life: 1.0,
          fadeRate: 0.06,
          expandRate: 0.4,
          isRing: true
        });
      }, i * 100);
    }

    // Ground debris
    const debrisCount = 20;
    for (let i = 0; i < debrisCount; i++) {
      const angle = (Math.PI * 2 * i) / debrisCount;
      const speed = 0.2 + Math.random() * 0.15;
      
      const geometry = new THREE.BoxGeometry(0.2, 0.1, 0.2);
      const material = new THREE.MeshBasicMaterial({
        color: 0x8B4513,
        transparent: true,
        opacity: 1
      });
      
      const debris = new THREE.Mesh(geometry, material);
      debris.position.copy(position);
      debris.position.y = 0.1;
      this.scene.add(debris);
      
      this.particles.push({
        mesh: debris,
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          0.3,
          Math.sin(angle) * speed
        ),
        rotation: new THREE.Vector3(
          Math.random() * 0.2,
          Math.random() * 0.2,
          Math.random() * 0.2
        ),
        life: 1.0,
        fadeRate: 0.03,
        gravity: -0.02
      });
    }
  }

  // Electric aura for overcharge
  createElectricAura(position, color) {
    const sparkCount = 15;
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const height = Math.random() * 2;
      const radius = 0.8 + Math.random() * 0.4;
      
      const geometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1,
        emissive: color,
        emissiveIntensity: 1
      });
      
      const spark = new THREE.Mesh(geometry, material);
      spark.position.set(
        position.x + Math.cos(angle) * radius,
        position.y + height,
        position.z + Math.sin(angle) * radius
      );
      spark.rotation.y = angle;
      this.scene.add(spark);
      
      this.particles.push({
        mesh: spark,
        velocity: new THREE.Vector3(0, 0.15, 0),
        life: 1.0,
        fadeRate: 0.06,
        shrinkRate: 0.03
      });
    }
  }

  // Magic explosion for arcane blast
  createMagicExplosion(position, color) {
    // Center burst
    const burstGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const burstMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      emissive: color,
      emissiveIntensity: 1.5
    });
    const burst = new THREE.Mesh(burstGeometry, burstMaterial);
    burst.position.copy(position);
    this.scene.add(burst);
    
    this.particles.push({
      mesh: burst,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 1.0,
      fadeRate: 0.1,
      expandRate: 0.3
    });

    // Magic particles
    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      const speed = 0.2 + Math.random() * 0.2;
      
      const geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1,
        emissive: color,
        emissiveIntensity: 1
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      this.scene.add(particle);
      
      this.particles.push({
        mesh: particle,
        velocity: new THREE.Vector3(
          Math.cos(angle) * Math.cos(elevation) * speed,
          Math.sin(elevation) * speed,
          Math.sin(angle) * Math.cos(elevation) * speed
        ),
        life: 1.0,
        fadeRate: 0.04,
        shrinkRate: 0.02
      });
    }
  }

  // Arrow projectile for multishot
  createArrowProjectile(startPos, endPos, color, scene) {
    const arrowGeometry = new THREE.ConeGeometry(0.05, 0.3, 8);
    const arrowMaterial = new THREE.MeshBasicMaterial({
      color: color
    });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.copy(startPos);
    
    // Point arrow at target
    const direction = new THREE.Vector3().subVectors(endPos, startPos);
    arrow.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    );
    
    scene.add(arrow);
    
    // Animate arrow
    const duration = 300;
    const startTime = Date.now();
    
    const animateArrow = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      arrow.position.lerpVectors(startPos, endPos, progress);
      
      if (progress < 1) {
        requestAnimationFrame(animateArrow);
      } else {
        scene.remove(arrow);
        arrow.geometry.dispose();
        arrow.material.dispose();
      }
    };
    animateArrow();
  }

  // Healing beam for mass heal
  createHealingBeam(startPos, endPos, scene) {
    const points = [startPos, endPos];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x44ff44,
      transparent: true,
      opacity: 0.8,
      linewidth: 3
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    
    setTimeout(() => {
      scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
    }, 200);
  }

  // Mass heal area effect
  createMassHealEffect(position, radius) {
    // Expanding green rings
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const ringGeometry = new THREE.RingGeometry(radius * 0.5, radius * 0.6, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0x44ff44,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(position);
        ring.position.y = 0.2;
        ring.rotation.x = -Math.PI / 2;
        this.scene.add(ring);
        
        this.particles.push({
          mesh: ring,
          velocity: new THREE.Vector3(0, 0.1, 0),
          life: 1.0,
          fadeRate: 0.05,
          expandRate: 0.15,
          isRing: true
        });
      }, i * 150);
    }
  }

  update(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Handle delay
      if (p.delay && p.delay > 0) {
        p.delay -= delta;
        continue;
      }
      
      // Apply gravity
      if (p.gravity) {
        p.velocity.y += p.gravity;
      }
      
      // Spiral motion
      if (p.spiral) {
        p.spiral.angle += p.spiral.speed * delta * 10;
        p.spiral.radius *= 0.99;
        p.mesh.position.x = p.spiral.center.x + Math.cos(p.spiral.angle) * p.spiral.radius;
        p.mesh.position.z = p.spiral.center.z + Math.sin(p.spiral.angle) * p.spiral.radius;
      }
      
      // Update position
      p.mesh.position.x += p.velocity.x;
      p.mesh.position.y += p.velocity.y;
      p.mesh.position.z += p.velocity.z;
      
      // Bounce off ground
      if (p.bounce && p.mesh.position.y < 0.1) {
        p.mesh.position.y = 0.1;
        p.velocity.y *= -p.bounce;
        p.velocity.x *= 0.8;
        p.velocity.z *= 0.8;
      }
      
      // Rotation
      if (p.rotation) {
        p.mesh.rotation.x += p.rotation.x;
        p.mesh.rotation.y += p.rotation.y;
        p.mesh.rotation.z += p.rotation.z;
      }
      
      // Expand
      if (p.expandRate) {
        if (p.isRing) {
          p.mesh.scale.x += p.expandRate;
          p.mesh.scale.y += p.expandRate;
        } else {
          p.mesh.scale.multiplyScalar(1 + p.expandRate * delta * 10);
        }
      }
      
      // Shrink
      if (p.shrinkRate) {
        p.mesh.scale.multiplyScalar(1 - p.shrinkRate);
      }
      
      // Color shift
      if (p.colorShift && p.mesh.material.color) {
        const targetColor = new THREE.Color(p.colorShift);
        p.mesh.material.color.lerp(targetColor, 0.1);
      }
      
      // Fade
      p.life -= p.fadeRate;
      p.mesh.material.opacity = p.life;
      
      // Remove dead particles
      if (p.life <= 0 || p.mesh.scale.x < 0.01) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  clear() {
    // Clean up all particles
    this.particles.forEach(p => {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
    });
    this.particles = [];
  }
}
