/**
 * GalleryUIManager - Reticle Raycasting, Curatorial Modal, Audio Guide & Minimap
 */
class GalleryUIManager {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 5.2; // Maximum interaction range in meters
    this.centerScreen = new THREE.Vector2(0, 0);

    this.currentHoveredArtwork = null;
    this.isModalOpen = false;

    // DOM Elements
    this.crosshair = document.getElementById('crosshair');
    this.promptEl = document.getElementById('interaction-prompt');
    this.modal = document.getElementById('artwork-modal');
    this.modalImage = document.getElementById('modal-image');
    this.modalTitle = document.getElementById('modal-title');
    this.modalMeta = document.getElementById('modal-meta');
    this.modalEssay = document.getElementById('modal-essay');
    this.audioGuideBox = document.getElementById('audio-guide-box');
    this.audioGuideBtn = document.getElementById('btn-audio-guide');
    this.btnCloseModal = document.getElementById('btn-close-modal');
    this.btnAudioToggle = document.getElementById('btn-audio-toggle');
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

    this.initEventListeners();
  }

  initEventListeners() {
    // Modal close button
    if (this.btnCloseModal) {
      this.btnCloseModal.addEventListener('click', () => this.closeArtworkModal());
    }

    // Modal background click to close
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeArtworkModal();
      });
    }

    // Audio Guide play button in modal
    if (this.audioGuideBtn) {
      this.audioGuideBtn.addEventListener('click', () => {
        if (!this.currentModalArtwork) return;
        if (window.GalleryAudio.isPlayingAudioGuide) {
          window.GalleryAudio.stopAudioGuide();
          this.audioGuideBox.classList.remove('playing');
        } else {
          this.audioGuideBox.classList.add('playing');
          window.GalleryAudio.startAudioGuide(this.currentModalArtwork.soundType, () => {
            this.audioGuideBox.classList.remove('playing');
          });
        }
      });
    }

    // HUD Audio Mute toggle button
    if (this.btnAudioToggle) {
      this.btnAudioToggle.addEventListener('click', () => {
        if (window.GalleryAudio) {
          const isMuted = window.GalleryAudio.toggleMute();
          this.updateAudioButtonState(isMuted);
        }
      });
    }

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && this.isModalOpen) {
        this.closeArtworkModal();
      }
    });
  }

  updateAudioButtonState(isMuted) {
    if (!this.btnAudioToggle) return;
    if (isMuted) {
      this.btnAudioToggle.style.color = '#ef4444';
      this.btnAudioToggle.style.borderColor = '#ef4444';
    } else {
      this.btnAudioToggle.style.color = 'var(--text-main)';
      this.btnAudioToggle.style.borderColor = 'rgba(255, 255, 255, 0.12)';
    }
  }

  /**
   * Raycast check from camera center to identify artworks in player focus
   */
  updateRaycast(camera, interactiveObjects) {
    if (this.isModalOpen || !camera || !interactiveObjects || interactiveObjects.length === 0) {
      this.clearHover();
      return;
    }

    this.raycaster.setFromCamera(this.centerScreen, camera);
    const intersects = this.raycaster.intersectObjects(interactiveObjects, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const data = hit.object.userData.artworkData;
      if (data) {
        this.currentHoveredArtwork = data;
        this.crosshair.classList.add('active');
        this.promptEl.textContent = `[E / Click] Inspect: "${data.title}"`;
        this.promptEl.classList.add('visible');
        return;
      }
    }

    this.clearHover();
  }

  clearHover() {
    this.currentHoveredArtwork = null;
    if (this.crosshair) this.crosshair.classList.remove('active');
    if (this.promptEl) this.promptEl.classList.remove('visible');
  }

  /**
   * Open full curatorial inspection placard modal
   */
  openArtworkModal(artwork) {
    if (!artwork || !this.modal) return;
    this.isModalOpen = true;
    this.currentModalArtwork = artwork;

    // Release pointer lock to allow mouse interaction with modal
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }

    // Populate data
    this.modalTitle.textContent = artwork.title;
    this.modalMeta.innerHTML = `
      <span>${artwork.artist}</span>
      <span>${artwork.year}</span>
      <span>${artwork.medium}</span>
      <span>${artwork.dimensions}</span>
    `;
    this.modalEssay.textContent = artwork.curatorNote;
    this.modalImage.src = artwork.imageSrc;

    // Play subtle harmonic chime matching artwork's theme
    if (window.GalleryAudio) {
      window.GalleryAudio.playArtworkChime(artwork.soundType);
    }

    this.audioGuideBox.classList.remove('playing');
    this.modal.classList.add('active');
  }

  closeArtworkModal() {
    if (!this.isModalOpen || !this.modal) return;
    this.modal.classList.remove('active');
    this.isModalOpen = false;

    if (window.GalleryAudio) {
      window.GalleryAudio.stopAudioGuide();
    }
    this.audioGuideBox.classList.remove('playing');
  }

  /**
   * Real-time Minimap Radar
   */
  updateMinimap(playerPos, playerRotationY) {
    if (!this.minimapCtx || !this.minimapCanvas) return;
    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Dark radar background
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, w, h);

    // Gallery room boundary scale (room is 38x38m, map has 12px padding)
    const mapSize = w - 24;
    const scale = mapSize / 38;
    const originX = w / 2;
    const originZ = h / 2;

    // Outer Room Border
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 12, mapSize, mapSize);

    // Center Rotunda Plinth
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.beginPath();
    ctx.arc(originX, originZ, 2.8 * scale, 0, Math.PI * 2);
    ctx.stroke();

    // Artwork locations (little glowing dots)
    if (window.Artworks && window.Artworks.artworks) {
      ctx.fillStyle = '#d4af37';
      window.Artworks.artworks.forEach(art => {
        if (art.group) {
          const ax = originX + art.group.position.x * scale;
          const az = originZ + art.group.position.z * scale;
          ctx.beginPath();
          ctx.arc(ax, az, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Player Marker & Direction Heading
    const px = originX + playerPos.x * scale;
    const pz = originZ + playerPos.z * scale;

    // Heading cone
    ctx.save();
    ctx.translate(px, pz);
    ctx.rotate(-playerRotationY);

    ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 16, -Math.PI / 2 - 0.4, -Math.PI / 2 + 0.4);
    ctx.closePath();
    ctx.fill();

    // Player dot
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

window.UI = new GalleryUIManager();
