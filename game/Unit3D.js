import * as THREE from "three";

export class Unit3D {
  constructor(scene, config, unitKey, isPlayer, spawnX, spawnZ) {
    this.scene = scene;
    this.config = config;
    this.unitKey = unitKey;
    this.isPlayer = isPlayer;
    this.stats = config.TROOPS[unitKey];
    this.maxHp = this.stats.maxHp;
    this.hp = this.stats.maxHp;
    this.damage = this.stats.damage;
    this.speed = this.stats.speed;
    this.attackRange = this.stats.attackRange;
    this.attackSpeedSec = this.stats.attackSpeedSec;
    this.direction = isPlayer ? 1 : -1;
    this.state = "walking";
    this.attackCooldown = 0;
    this.target = null;
    this.destroyed = false;

    const bodyGeometry = new THREE.CapsuleGeometry(0.7, 1.2, 4, 8);
    const color = isPlayer ? 0x4488ff : 0xff5555;
    const bodyMaterial = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(spawnX, 1.5, spawnZ);
    this.mesh = mesh;
    scene.add(mesh);

    const hpBgGeom = new THREE.PlaneGeometry(2, 0.25);
    const hpBgMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const hpBg = new THREE.Mesh(hpBgGeom, hpBgMat);
    hpBg.position.set(0, 2.6, 0);
    hpBg.rotation.x = -Math.PI / 2;
    this.hpBarBg = hpBg;
    mesh.add(hpBg);

    const hpGeom = new THREE.PlaneGeometry(2, 0.22);
    const hpMat = new THREE.MeshBasicMaterial({ color: isPlayer ? 0x33ff66 : 0xff3333, side: THREE.DoubleSide });
    const hpBar = new THREE.Mesh(hpGeom, hpMat);
    hpBar.position.set(0, 0.001, 0);
    this.hpBar = hpBar;
    hpBg.add(hpBar);
  }

  update(deltaSec, enemyUnits, enemyTowers) {
    if (this.destroyed) return;
    if (this.hp <= 0) {
      this.destroy();
      return;
    }

    this.attackCooldown = Math.max(0, this.attackCooldown - deltaSec);

    if (!this.target || !this.isValidTarget(this.target)) {
      this.target = this.findTarget(enemyUnits, enemyTowers);
    }

    if (this.target) {
      const targetPos = this.getTargetPosition(this.target);
      const dist = this.mesh.position.distanceTo(targetPos);
      if (dist <= this.attackRange) {
        this.state = "attacking";
        this.tryAttackTarget();
      } else {
        this.state = "walking";
        this.moveForward(deltaSec);
      }
    } else {
      this.state = "walking";
      this.moveForward(deltaSec);
    }

    this.updateHpBar();
  }

  moveForward(deltaSec) {
    const dz = this.direction * this.speed * deltaSec;
    const pos = this.mesh.position;
    const nextZ = pos.z + dz;
    if (this.isPlayer) {
      if (nextZ < this.config.ENEMY_SIDE_Z + 2) {
        pos.z = nextZ;
      }
    } else {
      if (nextZ > this.config.PLAYER_SIDE_Z - 2) {
        pos.z = nextZ;
      }
    }
  }

  findTarget(enemyUnits, enemyTowers) {
    let nearest = null;
    let minDist = Infinity;

    for (const u of enemyUnits) {
      if (u.destroyed || u.hp <= 0) continue;
      const d = this.mesh.position.distanceTo(u.mesh.position);
      if (d < minDist && d <= this.attackRange + 0.5) {
        minDist = d;
        nearest = u;
      }
    }

    for (const t of enemyTowers) {
      if (t.destroyed || t.hp <= 0) continue;
      const d = this.mesh.position.distanceTo(t.position);
      if (d < minDist && d <= this.attackRange + 1.5) {
        minDist = d;
        nearest = t;
      }
    }

    return nearest;
  }

  isValidTarget(target) {
    if (!target) return false;
    if (target.destroyed) return false;
    if (typeof target.hp === "number" && target.hp <= 0) return false;
    return true;
  }

  getTargetPosition(target) {
    if (target.mesh) return target.mesh.position;
    if (target.position) return target.position;
    return new THREE.Vector3();
  }

  tryAttackTarget() {
    if (this.attackCooldown > 0) return;
    this.attackCooldown = this.attackSpeedSec;

    if (!this.target || !this.isValidTarget(this.target)) return;

    if (this.target.applyDamage) {
      this.target.applyDamage(this.damage);
    } else if (this.target.hp !== undefined) {
      this.target.hp -= this.damage;
      if (this.target.hp <= 0 && this.target.destroy) {
        this.target.destroy();
      }
    }
  }

  applyDamage(amount) {
    if (this.destroyed) return;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
    }
  }

  updateHpBar() {
    const ratio = Math.max(0, this.hp / this.maxHp);
    this.hpBar.scale.x = ratio;
    this.hpBar.position.x = -1 + ratio;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    } else {
      this.scene.remove(this.mesh);
    }
  }
}
