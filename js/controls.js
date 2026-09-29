/**
 * FirstPersonControls - PointerLockControls, WASD Inertia, Collision & Head Bobbing
 */
class FirstPersonControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.isLocked = false;
    this.enabled = true;

    // Movement state
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.isSprinting = false;

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    // Natural Human Dimensions
    this.playerHeight = 1.7; // Eye height in meters
    this.playerRadius = 0.55;

    // Head bobbing
    this.bobTimer = 0;
    this.bobIntensity = 0.045;
    this.lastStepPhase = 0;

    // Camera pitch & yaw objects
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.position.set(0, this.playerHeight, 13); // Start in South promenade looking North towards centerpiece
    this.pitchObject.add(this.camera);
    this.yawObject.add(this.pitchObject);

    // Mouse sensitivity
    this.sensitivity = 0.0022;

    this.initEventListeners();
  }

  getObject() {
    return this.yawObject;
  }

  initEventListeners() {
    // Mouse movement inside Pointer Lock
    document.addEventListener('mousemove', (event) => {
      if (!this.isLocked || !this.enabled) return;

      const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      this.yawObject.rotation.y -= movementX * this.sensitivity;

      this.pitchObject.rotation.x -= movementY * this.sensitivity;
      // Clamp pitch to prevent somersaults (-85 deg to +85 deg)
      this.pitchObject.rotation.x = Math.max(-Math.PI / 2.15, Math.min(Math.PI / 2.15, this.pitchObject.rotation.x));
    });

    // Keyboard keys
    document.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveForward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveBackward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveLeft = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveRight = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.isSprinting = true;
          break;
        case 'KeyE':
          if (this.isLocked && window.UI && window.UI.currentHoveredArtwork) {
            window.UI.openArtworkModal(window.UI.currentHoveredArtwork);
          }
          break;
        case 'KeyM':
          if (window.GalleryAudio) {
            const muted = window.GalleryAudio.toggleMute();
            if (window.UI) window.UI.updateAudioButtonState(muted);
          }
          break;
      }
    });

    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveForward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveBackward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveLeft = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveRight = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.isSprinting = false;
          break;
      }
    });

    // Pointer Lock change listener
    document.addEventListener('pointerlockchange', () => {
      const isCurrentlyLocked = document.pointerLockElement === this.domElement;
      this.isLocked = isCurrentlyLocked;

      const overlay = document.getElementById('instructions-overlay');
      if (overlay) {
        if (this.isLocked) {
          overlay.classList.add('hidden');
          if (window.GalleryAudio) {
            window.GalleryAudio.init();
            window.GalleryAudio.resumeContext();
          }
        } else {
          // If modal is not active, show pause overlay
          if (window.UI && !window.UI.isModalOpen) {
            overlay.classList.remove('hidden');
          }
        }
      }
    });

    // Pointer lock error
    document.addEventListener('pointerlockerror', () => {
      console.warn('PointerLock failed or cancelled');
    });

    // Click to lock or interact
    this.domElement.addEventListener('click', () => {
      if (!this.isLocked && (!window.UI || !window.UI.isModalOpen)) {
        this.lock();
      } else if (this.isLocked && window.UI && window.UI.currentHoveredArtwork) {
        window.UI.openArtworkModal(window.UI.currentHoveredArtwork);
      }
    });
  }

  lock() {
    this.domElement.requestPointerLock();
  }

  unlock() {
    document.exitPointerLock();
  }

  /**
   * Collision check against museum walls, pedestals, and furniture
   */
  checkCollision(targetX, targetZ) {
    if (!window.Gallery || !window.Gallery.colliders) return false;

    const r = this.playerRadius;

    for (const col of window.Gallery.colliders) {
      if (col.type === 'bounds') {
        if (targetX - r < col.minX || targetX + r > col.maxX ||
            targetZ - r < col.minZ || targetZ + r > col.maxZ) {
          return true;
        }
      } else if (col.type === 'box') {
        if (targetX + r > col.minX && targetX - r < col.maxX &&
            targetZ + r > col.minZ && targetZ - r < col.maxZ) {
          return true;
        }
      } else if (col.type === 'cylinder') {
        const dx = targetX - col.x;
        const dz = targetZ - col.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < col.radius + r) {
          return true;
        }
      }
    }
    return false;
  }

  update(delta) {
    if (!this.isLocked || !this.enabled) return;

    // Movement damping
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();

    const speed = this.isSprinting ? 8.2 : 4.8;

    if (this.moveForward || this.moveBackward) {
      this.velocity.z -= this.direction.z * speed * 10.0 * delta;
    }
    if (this.moveLeft || this.moveRight) {
      this.velocity.x -= this.direction.x * speed * 10.0 * delta;
    }

    // Projected motion vectors along camera orientation
    const moveStepX = -this.velocity.x * delta;
    const moveStepZ = -this.velocity.z * delta;

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yawObject.rotation.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yawObject.rotation.y);

    const deltaPos = forward.multiplyScalar(-moveStepZ).add(right.multiplyScalar(-moveStepX));

    // Collision detection with sliding response
    const currentPos = this.yawObject.position;
    const targetX = currentPos.x + deltaPos.x;
    const targetZ = currentPos.z + deltaPos.z;

    // Test combined, then individual axes for smooth wall sliding
    if (!this.checkCollision(targetX, targetZ)) {
      currentPos.x = targetX;
      currentPos.z = targetZ;
    } else {
      if (!this.checkCollision(targetX, currentPos.z)) {
        currentPos.x = targetX;
      }
      if (!this.checkCollision(currentPos.x, targetZ)) {
        currentPos.z = targetZ;
      }
    }

    // Realistic Head Bobbing & Footsteps
    const horizontalSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
    if (horizontalSpeed > 0.4) {
      const stepRate = this.isSprinting ? 14 : 10;
      this.bobTimer += delta * stepRate;

      const bobY = Math.sin(this.bobTimer) * this.bobIntensity;
      const bobX = Math.cos(this.bobTimer * 0.5) * (this.bobIntensity * 0.5);

      this.camera.position.y = bobY;
      this.camera.position.x = bobX;

      // Footstep sound trigger when foot reaches lowest arc
      const stepPhase = Math.sin(this.bobTimer);
      if (stepPhase < -0.92 && this.lastStepPhase >= -0.92) {
        if (window.GalleryAudio) {
          window.GalleryAudio.playFootstep();
        }
      }
      this.lastStepPhase = stepPhase;
    } else {
      // Smoothly return to center eye height
      this.camera.position.y += (0 - this.camera.position.y) * 8.0 * delta;
      this.camera.position.x += (0 - this.camera.position.x) * 8.0 * delta;
      this.bobTimer = 0;
    }

    this.yawObject.position.y = this.playerHeight;
  }
}

window.FirstPersonControls = FirstPersonControls;
