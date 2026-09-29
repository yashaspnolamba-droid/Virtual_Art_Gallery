/**
 * ArtworksCatalogue & Procedural Artwork Texture Generators
 * Creates museum-grade visual exhibits and 3D kinetic installations.
 */
class ArtworksManager {
  constructor() {
    this.artworks = [];
    this.interactiveObjects = [];
    this.sculptures = [];
  }

  /* ==========================================================================
     Procedural Canvas Texture Generators (100% Offline & High-Resolution)
     ========================================================================== */

  createCanvas(width = 1024, height = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return { canvas, ctx: canvas.getContext('2d') };
  }

  generateNebulaTexture() {
    const { canvas, ctx } = this.createCanvas(1024, 1280);
    const w = canvas.width, h = canvas.height;

    // Dark cosmic base
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#040308');
    grad.addColorStop(0.5, '#0c071a');
    grad.addColorStop(1, '#050a14');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Swirling nebula clouds
    const colors = [
      'rgba(142, 68, 173, 0.45)', // Violet
      'rgba(41, 128, 185, 0.4)',  // Deep Cyan
      'rgba(231, 76, 60, 0.35)',  // Cosmic Crimson
      'rgba(241, 196, 15, 0.3)'   // Golden Core
    ];

    for (let c = 0; c < colors.length; c++) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = colors[c];
      for (let i = 0; i < 24; i++) {
        const x = w * 0.5 + Math.cos(i * 0.4 + c) * (w * 0.28);
        const y = h * 0.5 + Math.sin(i * 0.4 + c) * (h * 0.28);
        const r = 120 + Math.random() * 180;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.filter = 'blur(60px)';
        ctx.fill();
      }
      ctx.restore();
    }

    // Starfield particles
    ctx.fillStyle = '#ffffff';
    for (let s = 0; s < 450; s++) {
      const sx = Math.random() * w;
      const sy = Math.random() * h;
      const sr = Math.random() * 2.2;
      const op = 0.3 + Math.random() * 0.7;
      ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  }

  generateGeometricVoronoiTexture() {
    const { canvas, ctx } = this.createCanvas(1024, 1024);
    const w = canvas.width, h = canvas.height;

    // Dark slate gradient background
    const bg = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, w * 0.7);
    bg.addColorStop(0, '#1c1f26');
    bg.addColorStop(1, '#0c0d12');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Sacred geometric concentric circles & triangles
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.8;

    for (let r = 80; r < 440; r += 60) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Intersecting golden triangles & polygons
    const numPoints = 12;
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const radius = 280 + (i % 2 === 0 ? 80 : -40);
      points.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
    }

    ctx.fillStyle = 'rgba(212, 175, 55, 0.04)';
    ctx.beginPath();
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Connecting chords
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 2; j < points.length; j++) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }

    return canvas;
  }

  generateCyberFluidTexture() {
    const { canvas, ctx } = this.createCanvas(1024, 1280);
    const w = canvas.width, h = canvas.height;

    ctx.fillStyle = '#08060f';
    ctx.fillRect(0, 0, w, h);

    // Neon chromatic fluid ribbons
    const ribbons = [
      { color: 'rgba(255, 0, 128, 0.8)', yOffset: 0.3 },
      { color: 'rgba(0, 229, 255, 0.8)', yOffset: 0.5 },
      { color: 'rgba(255, 215, 0, 0.8)', yOffset: 0.7 }
    ];

    ribbons.forEach(ribbon => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = ribbon.color;
      ctx.lineWidth = 35;
      ctx.filter = 'blur(16px)';

      ctx.beginPath();
      for (let x = 0; x <= w; x += 20) {
        const y = h * ribbon.yOffset + Math.sin(x * 0.006) * 160 + Math.cos(x * 0.012) * 80;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    });

    // Crisp high-frequency lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 15) {
      const y = h * 0.5 + Math.sin(x * 0.006) * 160 + Math.cos(x * 0.012) * 80;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    return canvas;
  }

  generateArchitecturalMinimalismTexture() {
    const { canvas, ctx } = this.createCanvas(1024, 1280);
    const w = canvas.width, h = canvas.height;

    // Mediterranean dusk gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1c2e4a');
    sky.addColorStop(0.6, '#3a597a');
    sky.addColorStop(1, '#d88b69');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Brutalist monolithic forms & dramatic cast shadows
    ctx.fillStyle = '#e8dec8'; // Warm plaster wall
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h);
    ctx.lineTo(w * 0.2, h * 0.25);
    ctx.lineTo(w * 0.85, h * 0.35);
    ctx.lineTo(w * 0.85, h);
    ctx.closePath();
    ctx.fill();

    // Deep architectural shadow wedge
    ctx.fillStyle = '#171e28';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.29);
    ctx.lineTo(w * 0.85, h * 0.35);
    ctx.lineTo(w * 0.85, h);
    ctx.lineTo(w * 0.5, h);
    ctx.closePath();
    ctx.fill();

    // Archway cutout
    ctx.fillStyle = '#d88b69';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.65, 90, Math.PI, 0, false);
    ctx.lineTo(w * 0.35 + 90, h);
    ctx.lineTo(w * 0.35 - 90, h);
    ctx.closePath();
    ctx.fill();

    return canvas;
  }

  generateNordicImpastoTexture() {
    const { canvas, ctx } = this.createCanvas(1024, 1024);
    const w = canvas.width, h = canvas.height;

    // Earthy textured base
    ctx.fillStyle = '#313437';
    ctx.fillRect(0, 0, w, h);

    const palette = ['#c8beab', '#8f887b', '#484b4f', '#6c7774', '#c97d60'];

    // Simulated impasto knife strokes
    for (let i = 0; i < 300; i++) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      ctx.fillStyle = col;
      ctx.save();
      const x = Math.random() * w;
      const y = Math.random() * h;
      const strokeW = 60 + Math.random() * 180;
      const strokeH = 15 + Math.random() * 35;
      const angle = (Math.random() - 0.5) * 0.3;

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillRect(-strokeW / 2, -strokeH / 2, strokeW, strokeH);

      // Light bevel edge on stroke for 3D paint relief
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(-strokeW / 2, -strokeH / 2, strokeW, 3);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(-strokeW / 2, strokeH / 2 - 3, strokeW, 3);
      ctx.restore();
    }

    return canvas;
  }

  generateDigitalMetamorphosisTexture() {
    const { canvas, ctx } = this.createCanvas(1024, 1280);
    const w = canvas.width, h = canvas.height;

    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, w, h);

    // Glowing cyber grid
    ctx.strokeStyle = 'rgba(0, 255, 170, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Abstract digital human silhouette contour
    const cx = w / 2, cy = h * 0.45;
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00ffaa';
    ctx.shadowBlur = 20;

    for (let r = 40; r < 280; r += 20) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Horizontal glitch bars
    ctx.shadowBlur = 0;
    for (let g = 0; g < 20; g++) {
      const gy = Math.random() * h;
      const gh = 4 + Math.random() * 12;
      ctx.fillStyle = g % 2 === 0 ? 'rgba(255, 0, 85, 0.7)' : 'rgba(0, 229, 255, 0.7)';
      ctx.fillRect(w * 0.15 + Math.random() * 60, gy, w * 0.7, gh);
    }

    return canvas;
  }

  /* ==========================================================================
     Artwork Mesh Construction (Frames, Canvases, Placards, Glass)
     ========================================================================== */

  createFramedArtwork(config) {
    const group = new THREE.Group();
    group.position.set(config.x, config.y, config.z);
    group.rotation.set(config.rotX || 0, config.rotY || 0, config.rotZ || 0);

    const canvasW = config.width || 3.0;
    const canvasH = config.height || 3.8;
    const frameDepth = 0.12;
    const frameBorder = 0.14;

    // Outer Frame (Solid Wood/Metal)
    const frameGeo = new THREE.BoxGeometry(canvasW + frameBorder * 2, canvasH + frameBorder * 2, frameDepth);
    const frameMat = new THREE.MeshStandardMaterial({
      color: config.frameColor || 0x18191d,
      roughness: 0.4,
      metalness: 0.3
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.castShadow = true;
    frameMesh.receiveShadow = true;
    group.add(frameMesh);

    // Inner Canvas with Procedural Texture
    const canvasTexture = new THREE.CanvasTexture(config.canvasElement);
    if (THREE.SRGBColorSpace) canvasTexture.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) canvasTexture.encoding = THREE.sRGBEncoding;

    const canvasGeo = new THREE.PlaneGeometry(canvasW, canvasH);
    const canvasMat = new THREE.MeshStandardMaterial({
      map: canvasTexture,
      roughness: 0.7,
      metalness: 0.05
    });
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.position.z = frameDepth / 2 + 0.005;
    canvasMesh.castShadow = false;
    canvasMesh.receiveShadow = true;
    group.add(canvasMesh);

    // Glass Protective Sheet
    const glassGeo = new THREE.PlaneGeometry(canvasW, canvasH);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 0.25,
      transparent: true,
      roughness: 0.08,
      metalness: 0.1,
      reflectivity: 0.6
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.z = frameDepth / 2 + 0.015;
    group.add(glassMesh);

    // Wall Placard (Museum Brass / Dark Slate with Text)
    const placardCanvas = this.createCanvas(512, 160);
    const pCtx = placardCanvas.ctx;
    pCtx.fillStyle = '#1c1d22';
    pCtx.fillRect(0, 0, 512, 160);
    pCtx.strokeStyle = '#d4af37';
    pCtx.lineWidth = 4;
    pCtx.strokeRect(4, 4, 504, 152);

    pCtx.fillStyle = '#ffffff';
    pCtx.font = 'bold 26px serif';
    pCtx.fillText(config.title, 24, 48);

    pCtx.fillStyle = '#d4af37';
    pCtx.font = '20px sans-serif';
    pCtx.fillText(config.artist + ', ' + config.year, 24, 86);

    pCtx.fillStyle = '#9ca3af';
    pCtx.font = '16px sans-serif';
    pCtx.fillText(config.medium, 24, 122);

    const placardTexture = new THREE.CanvasTexture(placardCanvas.canvas);
    if (THREE.SRGBColorSpace) placardTexture.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) placardTexture.encoding = THREE.sRGBEncoding;
    const placardGeo = new THREE.PlaneGeometry(0.9, 0.32);
    const placardMat = new THREE.MeshStandardMaterial({
      map: placardTexture,
      roughness: 0.3,
      metalness: 0.4
    });
    const placardMesh = new THREE.Mesh(placardGeo, placardMat);
    placardMesh.position.set(canvasW / 2 + 0.6, -canvasH / 2 + 0.2, 0.01);
    group.add(placardMesh);

    // Metadata & Interactive Reference
    const artworkData = {
      id: config.id,
      title: config.title,
      artist: config.artist,
      year: config.year,
      medium: config.medium,
      dimensions: config.dimensions,
      description: config.description,
      curatorNote: config.curatorNote,
      soundType: config.soundType,
      imageSrc: config.canvasElement.toDataURL(),
      mesh: canvasMesh,
      group: group,
      is3D: false
    };

    canvasMesh.userData = { artworkData };
    glassMesh.userData = { artworkData };
    this.artworks.push(artworkData);
    this.interactiveObjects.push(canvasMesh, glassMesh);

    return group;
  }

  /* ==========================================================================
     Kinetic 3D Sculptures
     ========================================================================== */

  createCenterpieceSculpture(x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Dark Polished Pedestal
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.7, 1.1, 8);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.15,
      metalness: 0.8
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.55;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    group.add(baseMesh);

    // Gold Trim Ring on Pedestal
    const ringGeo = new THREE.TorusGeometry(2.4, 0.05, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2
    });
    const trimRing = new THREE.Mesh(ringGeo, ringMat);
    trimRing.rotation.x = Math.PI / 2;
    trimRing.position.y = 1.1;
    group.add(trimRing);

    // Central Kinetic Polyhedron (The Chrono-Prism)
    const polyGeo = new THREE.IcosahedronGeometry(1.0, 0);
    const polyMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.65,
      opacity: 0.95,
      transparent: true,
      roughness: 0.1,
      metalness: 0.8,
      ior: 2.2,
      reflectivity: 0.9
    });
    const centralPoly = new THREE.Mesh(polyGeo, polyMat);
    centralPoly.position.y = 2.4;
    centralPoly.castShadow = true;
    group.add(centralPoly);

    // Nested Counter-Rotating Gimbal Rings
    const gimbalRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.035, 16, 64), ringMat);
    gimbalRing1.position.y = 2.4;
    group.add(gimbalRing1);

    const gimbalRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.035, 16, 64), ringMat);
    gimbalRing2.position.y = 2.4;
    group.add(gimbalRing2);

    // Swirling Light Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const rad = 1.2 + Math.random() * 1.5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.random() * Math.PI;
      particlePos[i] = rad * Math.sin(ph) * Math.cos(th);
      particlePos[i + 1] = 2.4 + rad * Math.cos(ph);
      particlePos[i + 2] = rad * Math.sin(ph) * Math.sin(th);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Sculpture Data & Interactive Target
    const artworkData = {
      id: 'sculpture-chrono',
      title: 'The Chrono-Prism',
      artist: 'Aurelius Vance',
      year: '2026',
      medium: 'Iridescent Dichroic Quartz, Cast Brass & Magnetic Suspension',
      dimensions: '350 x 350 x 400 cm',
      description: 'A monument to perceptual time and dimensional symmetry.',
      curatorNote: 'Suspended in harmonic equilibrium, The Chrono-Prism explores the tension between immutable geometric constants and temporal perception. Its concentric brass gimbals rotate along celestial trajectories, refracting gallery ambient light through its hyper-dense quartz core.',
      soundType: 'sculpture',
      imageSrc: this.generateGeometricVoronoiTexture().toDataURL(),
      mesh: centralPoly,
      group: group,
      is3D: true
    };

    centralPoly.userData = { artworkData };
    this.artworks.push(artworkData);
    this.interactiveObjects.push(centralPoly);

    this.sculptures.push({
      update: (delta, time) => {
        centralPoly.rotation.y = time * 0.45;
        centralPoly.rotation.x = Math.sin(time * 0.3) * 0.25;
        centralPoly.position.y = 2.4 + Math.sin(time * 1.2) * 0.08;

        gimbalRing1.rotation.x = time * 0.6;
        gimbalRing1.rotation.z = time * 0.3;
        gimbalRing2.rotation.y = -time * 0.5;
        gimbalRing2.rotation.z = Math.cos(time * 0.4) * 0.5;

        particles.rotation.y = time * 0.15;
      }
    });

    return group;
  }

  createCrystalSculpture(x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Pedestal
    const pedGeo = new THREE.BoxGeometry(1.2, 1.3, 1.2);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      roughness: 0.3,
      metalness: 0.6
    });
    const pedestal = new THREE.Mesh(pedGeo, pedMat);
    pedestal.position.y = 0.65;
    pedestal.receiveShadow = true;
    group.add(pedestal);

    // Cluster of Quartz Prisms
    const crystalGroup = new THREE.Group();
    crystalGroup.position.y = 1.3;

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x76e5fc,
      transmission: 0.8,
      roughness: 0.05,
      metalness: 0.2,
      ior: 1.8,
      reflectivity: 0.85
    });

    const heights = [1.3, 1.1, 0.85, 0.7, 0.95];
    const angles = [0, 1.2, 2.4, 3.8, 5.1];
    heights.forEach((h, i) => {
      const geo = new THREE.ConeGeometry(0.18 + i * 0.03, h, 6);
      const m = new THREE.Mesh(geo, crystalMat);
      m.position.set(Math.cos(angles[i]) * 0.25, h / 2, Math.sin(angles[i]) * 0.25);
      m.rotation.z = (Math.random() - 0.5) * 0.25;
      m.rotation.x = (Math.random() - 0.5) * 0.25;
      m.castShadow = true;
      crystalGroup.add(m);
    });

    // Internal Light Core
    const crystalLight = new THREE.PointLight(0x76e5fc, 2.5, 4);
    crystalLight.position.y = 1.8;
    group.add(crystalLight);
    group.add(crystalGroup);

    const artworkData = {
      id: 'sculpture-crystal',
      title: 'Crystalline Resonance',
      artist: 'Elora Danvers',
      year: '2025',
      medium: 'Synthesized Cyan Beryl Crystals & Photonic Core',
      dimensions: '120 x 120 x 240 cm',
      description: 'Luminescent crystal formation exhibiting natural harmonic resonance.',
      curatorNote: 'Grown in high-pressure hydrothermal chambers, Danvers crystal prisms harness ambient gallery photoluminescence. The arrangement echoes tectonic fracture lines found along deep mid-ocean ridges.',
      soundType: 'crystalline',
      imageSrc: this.generateNebulaTexture().toDataURL(),
      mesh: crystalGroup.children[0],
      group: group,
      is3D: true
    };

    crystalGroup.children.forEach(c => {
      c.userData = { artworkData };
      this.interactiveObjects.push(c);
    });
    this.artworks.push(artworkData);

    this.sculptures.push({
      update: (delta, time) => {
        crystalGroup.rotation.y = time * 0.2;
        crystalLight.intensity = 2.0 + Math.sin(time * 3.0) * 0.6;
      }
    });

    return group;
  }

  /* ==========================================================================
     Initialize All Gallery Artwork Placements
     ========================================================================== */

  initGalleryArtworks(scene) {
    // 1. Centerpiece Sculpture in Rotunda
    const centerpiece = this.createCenterpieceSculpture(0, 0, 0);
    scene.add(centerpiece);

    // 2. Crystal Sculpture in East Pedestal Alcove
    const crystalSculpture = this.createCrystalSculpture(14, 0, 0);
    scene.add(crystalSculpture);

    // 3. North Wall: Celestial & Algorithmic Canvases
    const artNorth1 = this.createFramedArtwork({
      id: 'art-nebula',
      title: 'Symphony in the Void',
      artist: 'Selene Moreau',
      year: '2024',
      medium: 'Algorithmic Chromodynamics on Textured Canvas',
      dimensions: '240 x 300 cm',
      description: 'Deep cosmological canvas exploring interstellar birth and thermodynamic equilibrium.',
      curatorNote: 'Moreau models the violent birth of solar nebulae through custom fluid-gravitational equations. The deep lapis hues collide with radiant gold filaments, symbolizing the eternal dance between gravitational collapse and stellar ignition.',
      soundType: 'celestial',
      canvasElement: this.generateNebulaTexture(),
      x: -7, y: 3.2, z: -17.8,
      width: 3.2, height: 4.0,
      rotY: 0
    });
    scene.add(artNorth1);

    const artNorth2 = this.createFramedArtwork({
      id: 'art-geometric',
      title: 'The Golden Ratio Singularity',
      artist: 'Kaelen Thorne',
      year: '2025',
      medium: 'Acid-Etched Brass & Procedural Geometry',
      dimensions: '220 x 220 cm',
      description: 'Sacred geometric tessellation of multi-dimensional spatial topologies.',
      curatorNote: 'Thorne strips spatial architecture down to Euclidean purity. The interlocking concentric chords create moiré harmonics that dynamically shift as the observer walks past the frame.',
      soundType: 'geometric',
      canvasElement: this.generateGeometricVoronoiTexture(),
      x: 7, y: 3.2, z: -17.8,
      width: 3.4, height: 3.4,
      rotY: 0
    });
    scene.add(artNorth2);

    // 4. South Wall: Modern Fluid & Cyber Canvases
    const artSouth1 = this.createFramedArtwork({
      id: 'art-cyber-fluid',
      title: 'Neon Synapse Overdrive',
      artist: 'Kira Vance',
      year: '2026',
      medium: 'Photonic Pigment, Liquid Polymer & Silicon',
      dimensions: '240 x 300 cm',
      description: 'High-frequency stream of consciousness in an electrified digital metropolis.',
      curatorNote: 'Vance translates hyper-speed data packet exchanges into luminous viscous fluid waves. The sharp chromatic interplay between radiant fuchsia and electric cyan radiates with energetic pulse.',
      soundType: 'cyber',
      canvasElement: this.generateCyberFluidTexture(),
      x: -7, y: 3.2, z: 17.8,
      width: 3.2, height: 4.0,
      rotY: Math.PI
    });
    scene.add(artSouth1);

    const artSouth2 = this.createFramedArtwork({
      id: 'art-metamorphosis',
      title: 'Digital Metamorphosis',
      artist: 'Devon Mercer',
      year: '2025',
      medium: 'Vector Glitch Synthesis on Ultra-Black Linen',
      dimensions: '240 x 300 cm',
      description: 'The dissolving frontier between human consciousness and synthetic intelligence.',
      curatorNote: 'A haunting study on digital transience. Mercer uses recursive glitch offsets to fragment human contours against an infinitely dark void.',
      soundType: 'cyber',
      canvasElement: this.generateDigitalMetamorphosisTexture(),
      x: 7, y: 3.2, z: 17.8,
      width: 3.2, height: 4.0,
      rotY: Math.PI
    });
    scene.add(artSouth2);

    // 5. West Wall: Brutalism & Impasto Painting
    const artWest1 = this.createFramedArtwork({
      id: 'art-architectural',
      title: 'Brutalist Silence at Dusk',
      artist: 'Mateo Rossi',
      year: '2024',
      medium: 'Limestone Pigment, Terracotta & Raw Linen',
      dimensions: '260 x 320 cm',
      description: 'Minimalist monumental geometries bathed in warm twilight cast shadows.',
      curatorNote: 'Rossi evokes the serene permanence of monumental Mediterranean architecture. The stark contrast between sunlit sandstone and deep monolithic shadow induces contemplative stillness.',
      soundType: 'organic',
      canvasElement: this.generateArchitecturalMinimalismTexture(),
      x: -17.8, y: 3.2, z: -6,
      width: 3.2, height: 4.0,
      rotY: Math.PI / 2
    });
    scene.add(artWest1);

    const artWest2 = this.createFramedArtwork({
      id: 'art-nordic-impasto',
      title: 'Topography of Silence',
      artist: 'Astrid Lindholm',
      year: '2023',
      medium: 'Heavy Impasto Oil, Volcanic Ash & Slate',
      dimensions: '260 x 260 cm',
      description: 'Tactile study of weathered sub-arctic tectonic landscapes.',
      curatorNote: 'Applied with heavy steel pallet knives, Lindholm thick sculptural impasto layers create rich physical shadow relief that shifts with ambient museum lighting.',
      soundType: 'organic',
      canvasElement: this.generateNordicImpastoTexture(),
      x: -17.8, y: 3.2, z: 6,
      width: 3.2, height: 3.2,
      rotY: Math.PI / 2
    });
    scene.add(artWest2);
  }

  update(delta, time) {
    this.sculptures.forEach(s => s.update(delta, time));
  }
}

window.Artworks = new ArtworksManager();
