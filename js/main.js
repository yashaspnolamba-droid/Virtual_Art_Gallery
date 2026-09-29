/**
 * Main Application Entry Point - Three.js Renderer, Animation Loop & Scene Management
 */
(function() {
  let scene, camera, renderer, controls, clock;

  function init() {
    const container = document.getElementById('canvas-container');

    // 1. Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0b0e);
    scene.fog = new THREE.FogExp2(0x0a0b0e, 0.015);

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 80);

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // 4. Clock
    clock = new THREE.Clock();

    // 5. Controls
    controls = new window.FirstPersonControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    // 6. Build Architecture & Artworks
    if (window.Gallery) {
      window.Gallery.buildGallery(scene);
    }
    if (window.Artworks) {
      window.Artworks.initGalleryArtworks(scene);
    }

    // 7. Event Handlers
    window.addEventListener('resize', onWindowResize, false);

    // Enter Gallery button
    const enterBtn = document.getElementById('btn-enter-gallery');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        controls.lock();
      });
    }

    // Fullscreen toggle button
    const fsBtn = document.getElementById('btn-fullscreen-toggle');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => console.warn(err));
        } else {
          document.exitFullscreen();
        }
      });
    }

    // 8. Start Loop
    animate();
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);
    const time = clock.getElapsedTime();

    // Update Player & Camera
    if (controls) {
      controls.update(delta);
    }

    // Update Kinetic Sculptures
    if (window.Artworks) {
      window.Artworks.update(delta, time);
    }

    // Update Interaction Raycaster
    if (window.UI && window.Artworks) {
      window.UI.updateRaycast(camera, window.Artworks.interactiveObjects);

      const playerObj = controls.getObject();
      window.UI.updateMinimap(playerObj.position, playerObj.rotation.y);
    }

    // Render Scene
    renderer.render(scene, camera);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
