import * as THREE from "three";

export class Tower3D {
  constructor(scene, x, z, maxHp, isPlayer) {
    this.scene = scene;
    this.position = new THREE.Vector3(x, 2, z);
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.isPlayer = isPlayer;
    this.destroyed = false;
    this.attackRange = 9;
    this.attackSpeedSec = 1.1;
    this.damage = 110;
    this.attackCooldown = 0;

    const bodyGeom = new THREE.CylinderGeometry(1.6, 2.2, 4, 12);
    const color = isPlayer ? 0x3366ff : 0xff4444;
    const bodyMat = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(bodyGeom, bodyMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.copy(this.position);
    this.mesh = mesh;
    scene.add(mesh);

    const hpBgGeom = new THREE.PlaneGeometry(3, 0.35);
    const hpBgMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const hpBg = new THREE.Mesh(hpBgGeom, hpBgMat);
    hpBg.position.set(0, 3, 0);
    hpBg.rotation.x = -Math.PI / 2;
    this.hpBarBg = hpBg;
    mesh.add(hpBg);

    const hpGeom = new THREE.PlaneGeometry(3, 0.32);
    const hpMat = new THREE.MeshBasicMaterial({ color: 0x33ff66, side: THREE.DoubleSide });
    const hp = new THREE.Mesh(hpGeom, hpMat);
    hp.position.set(0, 0.001, 0);
    this.hpBar = hp;
    hpBg.add(hp);
  }

  update(deltaSec, enemyUnits) {
    if (this.destroyed) return;
    if (this.hp <= 0) {
      this.destroy();
      return;
    }

    this.attackCooldown = Math.max(0, this.attackCooldown - deltaSec);
    if (this.attackCooldown > 0) {
      this.updateHpBar();
      return;
    }

    let nearest = null;
    let minDist = this.attackRange;
    for (const u of enemyUnits) {
      if (u.destroyed || u.hp <= 0) continue;
      const d = this.position.distanceTo(u.mesh.position);
      if (d < minDist) {
        minDist = d;
        nearest = u;
      }
    }

    if (nearest) {
      this.attackCooldown = this.attackSpeedSec;
      nearest.applyDamage(this.damage);
      nearest.updateHpBar();
    }

    this.updateHpBar();
  }

  applyDamage(amount) {
    if (this.destroyed) return;
    this.hp -= amount;
    if (this.hp < 0) this.hp = 0;
    this.updateHpBar();
    if (this.hp <= 0) this.destroy();
  }

  updateHpBar() {
    const ratio = Math.max(0, this.hp / this.maxHp);
    this.hpBar.scale.x = ratio;
    this.hpBar.position.x = -1.5 + ratio * 1.5;
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
