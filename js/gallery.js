s/**
 * GalleryArchitecture - Museum Room, Skylights, Track Lighting, Benches & Collision Geometry
 */
class GalleryArchitecture {
  constructor() {
    this.colliders = [];
  }

  buildGallery(scene) {
    const roomWidth = 38;
    const roomLength = 38;
    const roomHeight = 7.5;

    // 1. Polished Terrazzo Gallery Floor
    const floorGeo = new THREE.PlaneGeometry(roomWidth, roomLength, 32, 32);
    
    // Procedural Floor Texture
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext('2d');
    fCtx.fillStyle = '#111317';
    fCtx.fillRect(0, 0, 1024, 1024);

    // Subtle marble speckles & tile grid
    fCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    fCtx.lineWidth = 2;
    for (let i = 0; i <= 1024; i += 256) {
      fCtx.beginPath();
      fCtx.moveTo(i, 0); fCtx.lineTo(i, 1024);
      fCtx.stroke();
      fCtx.beginPath();
      fCtx.moveTo(0, i); fCtx.lineTo(1024, i);
      fCtx.stroke();
    }
    for (let s = 0; s < 1200; s++) {
      const sx = Math.random() * 1024;
      const sy = Math.random() * 1024;
      fCtx.fillStyle = Math.random() > 0.5 ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.06)';
      fCtx.fillRect(sx, sy, 2, 2);
    }

    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    if (THREE.SRGBColorSpace) floorTexture.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) floorTexture.encoding = THREE.sRGBEncoding;

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.15,
      metalness: 0.25
    });

    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 2. Coffered Architectural Ceiling & Recessed Skylight
    const ceilingGeo = new THREE.PlaneGeometry(roomWidth, roomLength);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.8
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.y = roomHeight;
    scene.add(ceilingMesh);

    // Central Glass Skylight
    const skylightGeo = new THREE.PlaneGeometry(16, 16);
    const skylightMat = new THREE.MeshBasicMaterial({
      color: 0xdde8f8,
      transparent: true,
      opacity: 0.85
    });
    const skylight = new THREE.Mesh(skylightGeo, skylightMat);
    skylight.rotation.x = Math.PI / 2;
    skylight.position.y = roomHeight - 0.05;
    scene.add(skylight);

    // Architectural Wooden Louvers / Ceiling Beams
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x221c17, roughness: 0.7 });
    for (let x = -7.5; x <= 7.5; x += 1.5) {
      const beamGeo = new THREE.BoxGeometry(0.12, 0.4, 16);
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(x, roomHeight - 0.25, 0);
      scene.add(beam);
    }

    // 3. Contemporary Gallery Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xe8e7e3,
      roughness: 0.88,
      metalness: 0.02
    });

    // North Wall (Z = -19)
    const northWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMat);
    northWall.position.set(0, roomHeight / 2, -roomLength / 2);
    northWall.receiveShadow = true;
    scene.add(northWall);

    // South Wall (Z = 19)
    const southWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMat);
    southWall.position.set(0, roomHeight / 2, roomLength / 2);
    southWall.rotation.y = Math.PI;
    southWall.receiveShadow = true;
    scene.add(southWall);

    // West Wall (X = -19)
    const westWall = new THREE.Mesh(new THREE.PlaneGeometry(roomLength, roomHeight), wallMat);
    westWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    westWall.rotation.y = Math.PI / 2;
    westWall.receiveShadow = true;
    scene.add(westWall);

    // East Wall (X = 19)
    const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(roomLength, roomHeight), wallMat);
    eastWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    eastWall.rotation.y = -Math.PI / 2;
    eastWall.receiveShadow = true;
    scene.add(eastWall);

    // Baseboards along perimeter walls
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x121316, roughness: 0.4 });
    const addBaseboard = (w, d, x, z) => {
      const bb = new THREE.Mesh(new THREE.BoxGeometry(w, 0.18, d), baseboardMat);
      bb.position.set(x, 0.09, z);
      scene.add(bb);
    };
    addBaseboard(roomWidth, 0.08, 0, -roomLength / 2 + 0.04);
    addBaseboard(roomWidth, 0.08, 0, roomLength / 2 - 0.04);
    addBaseboard(0.08, roomLength, -roomWidth / 2 + 0.04, 0);
    addBaseboard(0.08, roomLength, roomWidth / 2 - 0.04, 0);

    // 4. Track Rails & Targeted Art Spotlights
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x15161a, metalness: 0.8, roughness: 0.3 });
    const addTrackRail = (w, d, x, z) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), trackMat);
      rail.position.set(x, roomHeight - 1.2, z);
      scene.add(rail);
      return rail;
    };

    addTrackRail(roomWidth - 8, 0.1, 0, -12);
    addTrackRail(roomWidth - 8, 0.1, 0, 12);
    addTrackRail(0.1, roomLength - 8, -12, 0);
    addTrackRail(0.1, roomLength - 8, 12, 0);

    // Targeted Museum Spotlights for Artworks
    const createSpotlight = (posX, posY, posZ, targetX, targetY, targetZ, color = 0xfffaed, intensity = 28) => {
      const spot = new THREE.SpotLight(color, intensity);
      spot.position.set(posX, posY, posZ);
      spot.angle = Math.PI / 5.2;
      spot.penumbra = 0.55;
      spot.decay = 1.6;
      spot.distance = 18;
      spot.castShadow = true;
      spot.shadow.mapSize.width = 1024;
      spot.shadow.mapSize.height = 1024;
      spot.shadow.camera.near = 1;
      spot.shadow.camera.far = 22;
      spot.shadow.bias = -0.001;

      const targetObj = new THREE.Object3D();
      targetObj.position.set(targetX, targetY, targetZ);
      scene.add(targetObj);
      spot.target = targetObj;
      scene.add(spot);

      // Physical Fixture Cylinder
      const fixtureGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.3, 16);
      const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.8, roughness: 0.2 });
      const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
      fixture.position.set(posX, posY, posZ);
      fixture.lookAt(targetX, targetY, targetZ);
      fixture.rotateX(Math.PI / 2);
      scene.add(fixture);

      return spot;
    };

    // Spotlights aimed at North Artworks
    createSpotlight(-7, roomHeight - 1.2, -12, -7, 3.2, -17.8);
    createSpotlight(7, roomHeight - 1.2, -12, 7, 3.2, -17.8);

    // Spotlights aimed at South Artworks
    createSpotlight(-7, roomHeight - 1.2, 12, -7, 3.2, 17.8);
    createSpotlight(7, roomHeight - 1.2, 12, 7, 3.2, 17.8);

    // Spotlights aimed at West Artworks
    createSpotlight(-12, roomHeight - 1.2, -6, -17.8, 3.2, -6);
    createSpotlight(-12, roomHeight - 1.2, 6, -17.8, 3.2, 6);

    // Spotlight aimed at East Crystal Sculpture
    createSpotlight(12, roomHeight - 1.2, 0, 14, 1.6, 0, 0x88e2fc, 24);

    // Spotlight directly illuminating Grand Centerpiece
    createSpotlight(0, roomHeight - 0.6, 3.5, 0, 2.4, 0, 0xfff6dc, 35);
    createSpotlight(0, roomHeight - 0.6, -3.5, 0, 2.4, 0, 0xfff6dc, 35);

    // 5. Museum Ambient & Fill Lighting
    const hemiLight = new THREE.HemisphereLight(0xf2f4ff, 0x24262c, 0.45);
    scene.add(hemiLight);

    const skylightSun = new THREE.DirectionalLight(0xfff7e8, 0.6);
    skylightSun.position.set(3, roomHeight + 2, 2);
    scene.add(skylightSun);

    // 6. Architectural Leather Museum Benches
    const createBench = (x, z, rotY = 0) => {
      const benchGroup = new THREE.Group();
      benchGroup.position.set(x, 0, z);
      benchGroup.rotation.y = rotY;

      // Cushion
      const cushionGeo = new THREE.BoxGeometry(3.6, 0.35, 1.2);
      const cushionMat = new THREE.MeshStandardMaterial({
        color: 0x1a1c22,
        roughness: 0.6,
        metalness: 0.1
      });
      const cushion = new THREE.Mesh(cushionGeo, cushionMat);
      cushion.position.y = 0.55;
      cushion.castShadow = true;
      cushion.receiveShadow = true;
      benchGroup.add(cushion);

      // Brass / Steel Legs
      const legGeo = new THREE.BoxGeometry(0.08, 0.38, 1.0);
      const legMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.85,
        roughness: 0.25
      });
      const leg1 = new THREE.Mesh(legGeo, legMat);
      leg1.position.set(-1.4, 0.19, 0);
      leg1.castShadow = true;
      benchGroup.add(leg1);

      const leg2 = new THREE.Mesh(legGeo, legMat);
      leg2.position.set(1.4, 0.19, 0);
      leg2.castShadow = true;
      benchGroup.add(leg2);

      scene.add(benchGroup);

      // Register collision box
      this.colliders.push({
        type: 'box',
        minX: x - (rotY === 0 ? 1.9 : 0.7),
        maxX: x + (rotY === 0 ? 1.9 : 0.7),
        minZ: z - (rotY === 0 ? 0.7 : 1.9),
        maxZ: z + (rotY === 0 ? 0.7 : 1.9)
      });
    };

    // Place benches for contemplative art viewing with generous open circulation
    createBench(-7.5, 0, Math.PI / 2);
    createBench(7.5, 0, Math.PI / 2);

    // Register Centerpiece Pedestal Collision
    this.colliders.push({
      type: 'cylinder',
      x: 0,
      z: 0,
      radius: 2.8
    });

    // Register East Crystal Pedestal Collision
    this.colliders.push({
      type: 'box',
      minX: 13.0,
      maxX: 15.0,
      minZ: -1.0,
      maxZ: 1.0
    });

    // Outer Room Perimeter Colliders
    this.colliders.push({
      type: 'bounds',
      minX: -roomWidth / 2 + 1.2,
      maxX: roomWidth / 2 - 1.2,
      minZ: -roomLength / 2 + 1.2,
      maxZ: roomLength / 2 - 1.2
    });
  }
}

window.Gallery = new GalleryArchitecture();
