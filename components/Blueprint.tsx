import React, { useEffect, useRef, useState } from 'react';
import { CyborgConfiguration, PartSlot } from '../types';
import { ScanLine, AlertCircle } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

interface BlueprintProps {
    config: CyborgConfiguration;
    activeSlot: PartSlot;
    onSlotClick: (slot: PartSlot) => void;
}

const Blueprint: React.FC<BlueprintProps> = ({ config, activeSlot, onSlotClick }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const requestRef = useRef<number>(0);

    const modelRef = useRef<THREE.Group | null>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const reticleRef = useRef<THREE.Group | null>(null);
    const targetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3, 0));

    const activeSlotRef = useRef(activeSlot);
    useEffect(() => { activeSlotRef.current = activeSlot; }, [activeSlot]);

    const TARGET_HEIGHT = 6.0;

    useEffect(() => {
        if (!mountRef.current) return;

        const container = mountRef.current;
        const w = container.clientWidth;
        const h = container.clientHeight;

        // ═══════════════════════════════════════
        //         SCENE — Gradient Background
        // ═══════════════════════════════════════
        const scene = new THREE.Scene();
        // No flat color background — we use a gradient sky dome
        sceneRef.current = scene;

        // Sky dome — smooth gradient from dark top to lighter bottom
        const skyGeo = new THREE.SphereGeometry(100, 32, 32);
        const skyMat = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            depthWrite: false,
            uniforms: {
                topColor: { value: new THREE.Color(0x0d1117) },  // dark slate top
                midColor: { value: new THREE.Color(0x141b24) },  // mid blue-gray
                bottomColor: { value: new THREE.Color(0x1a2332) },  // lighter blue at horizon
                floorColor: { value: new THREE.Color(0x0f1520) },  // below horizon
            },
            vertexShader: `
                varying vec3 vWorldPos;
                void main() {
                    vec4 wp = modelMatrix * vec4(position, 1.0);
                    vWorldPos = wp.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 midColor;
                uniform vec3 bottomColor;
                uniform vec3 floorColor;
                varying vec3 vWorldPos;
                void main() {
                    float h = normalize(vWorldPos).y;
                    vec3 col;
                    if (h < 0.0) {
                        col = mix(floorColor, bottomColor, smoothstep(-0.3, 0.0, h));
                    } else {
                        col = mix(bottomColor, midColor, smoothstep(0.0, 0.3, h));
                        col = mix(col, topColor, smoothstep(0.3, 0.8, h));
                    }
                    gl_FragColor = vec4(col, 1.0);
                }
            `
        });
        scene.add(new THREE.Mesh(skyGeo, skyMat));

        // ═══════════════════════════════════════
        //           RENDERER
        // ═══════════════════════════════════════
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2.0;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // ═══════════════════════════════════════
        //            CAMERA
        // ═══════════════════════════════════════
        const camera = new THREE.PerspectiveCamera(30, w / (h || 1), 0.1, 500);
        camera.position.set(10, 4.5, 10);
        cameraRef.current = camera;

        // ═══════════════════════════════════════
        //    ENVIRONMENT MAP (bright studio panels for reflections)
        // ═══════════════════════════════════════
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0x2a3040);

        // Large softbox panels
        const panelGeo = new THREE.PlaneGeometry(40, 25);

        // Key softbox — bright white
        const keyPanel = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: 0xeeeeff }));
        keyPanel.position.set(15, 12, 10);
        keyPanel.lookAt(0, 3, 0);
        envScene.add(keyPanel);

        // Fill softbox — cool white
        const fillPanel = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: 0xaabbcc }));
        fillPanel.position.set(-18, 10, 8);
        fillPanel.lookAt(0, 3, 0);
        envScene.add(fillPanel);

        // Rim softbox — behind
        const rimPanel = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: 0x99aacc }));
        rimPanel.position.set(0, 8, -18);
        rimPanel.lookAt(0, 3, 0);
        envScene.add(rimPanel);

        // Cyan accent strip
        const stripGeo = new THREE.PlaneGeometry(6, 25);
        const cyanStrip = new THREE.Mesh(stripGeo, new THREE.MeshBasicMaterial({ color: 0x22ddff }));
        cyanStrip.position.set(-12, 8, -12);
        cyanStrip.lookAt(0, 3, 0);
        envScene.add(cyanStrip);

        // Fuchsia accent strip
        const magStrip = new THREE.Mesh(stripGeo, new THREE.MeshBasicMaterial({ color: 0xff4499 }));
        magStrip.position.set(12, 5, -10);
        magStrip.lookAt(0, 3, 0);
        envScene.add(magStrip);

        // Floor + ceiling ambient
        const bigPlane = new THREE.PlaneGeometry(60, 60);
        const floorEnv = new THREE.Mesh(bigPlane, new THREE.MeshBasicMaterial({ color: 0x334455 }));
        floorEnv.rotation.x = Math.PI / 2;
        floorEnv.position.y = -4;
        envScene.add(floorEnv);
        const ceilEnv = new THREE.Mesh(bigPlane, new THREE.MeshBasicMaterial({ color: 0x556677 }));
        ceilEnv.rotation.x = -Math.PI / 2;
        ceilEnv.position.y = 30;
        envScene.add(ceilEnv);

        const envRT = pmremGenerator.fromScene(envScene, 0.015);
        scene.environment = envRT.texture;
        pmremGenerator.dispose();

        // ═══════════════════════════════════════
        //         STUDIO LIGHTING
        // ═══════════════════════════════════════

        // Strong ambient — character is always visible
        scene.add(new THREE.AmbientLight(0xd0d4e0, 3.0));

        // Hemisphere: bright blue sky, warm ground bounce
        const hemiLight = new THREE.HemisphereLight(0xb0c4dd, 0x444444, 2.0);
        scene.add(hemiLight);

        // KEY — strong white directional, front-right
        const keyLight = new THREE.DirectionalLight(0xffffff, 5.0);
        keyLight.position.set(8, 14, 8);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(2048, 2048);
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 40;
        keyLight.shadow.camera.left = -8;
        keyLight.shadow.camera.right = 8;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -2;
        keyLight.shadow.bias = -0.0003;
        keyLight.shadow.normalBias = 0.02;
        keyLight.shadow.radius = 4;
        scene.add(keyLight);

        // FILL — from left, softer
        const fillLight = new THREE.DirectionalLight(0xc8d0e0, 3.0);
        fillLight.position.set(-8, 8, 6);
        scene.add(fillLight);

        // RIM — back edge light for silhouette
        const rimLight = new THREE.DirectionalLight(0x99ccff, 3.0);
        rimLight.position.set(-4, 8, -10);
        scene.add(rimLight);

        // TOP — overhead soft fill
        const topLight = new THREE.DirectionalLight(0xdde0f0, 2.0);
        topLight.position.set(0, 18, 0);
        scene.add(topLight);

        // BOTTOM FILL — bounce light from floor (prevents black underside)
        const bottomFill = new THREE.DirectionalLight(0x556688, 1.5);
        bottomFill.position.set(0, -3, 5);
        scene.add(bottomFill);

        // Colored accent spotlights aimed at character
        const cyanSpot = new THREE.SpotLight(0x22ddee, 20, 30, Math.PI / 4, 0.7, 1);
        cyanSpot.position.set(-5, 5, 5);
        cyanSpot.target.position.set(0, 3, 0);
        scene.add(cyanSpot);
        scene.add(cyanSpot.target);

        const magentaSpot = new THREE.SpotLight(0xff3388, 10, 25, Math.PI / 5, 0.8, 1);
        magentaSpot.position.set(5, 3, -4);
        magentaSpot.target.position.set(0, 3, 0);
        scene.add(magentaSpot);
        scene.add(magentaSpot.target);

        // ═══════════════════════════════════════
        //       PROTOTYPE ROOM ENVIRONMENT
        // ═══════════════════════════════════════

        // FLOOR — large reflective surface
        const floorGeo = new THREE.PlaneGeometry(60, 60);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x1a2030,
            metalness: 0.7,
            roughness: 0.3,
            envMapIntensity: 1.0,
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.01;
        floor.receiveShadow = true;
        scene.add(floor);

        // Grid overlay
        const gridHelper = new THREE.GridHelper(40, 80, 0x2a3545, 0x1a2530);
        gridHelper.position.y = 0.01;
        const gMat = gridHelper.material as THREE.Material;
        gMat.transparent = true;
        gMat.opacity = 0.35;
        scene.add(gridHelper);

        // Platform ring (outer)
        const platformRingGeo = new THREE.TorusGeometry(3.5, 0.02, 16, 128);
        const platformRingMat = new THREE.MeshBasicMaterial({ color: 0x22aacc, transparent: true, opacity: 0.5 });
        const platformRing = new THREE.Mesh(platformRingGeo, platformRingMat);
        platformRing.rotation.x = Math.PI / 2;
        platformRing.position.y = 0.02;
        scene.add(platformRing);

        // Platform ring (inner)
        const innerPlatformGeo = new THREE.TorusGeometry(1.8, 0.015, 16, 64);
        const innerPlatformMat = new THREE.MeshBasicMaterial({ color: 0x1a6688, transparent: true, opacity: 0.35 });
        const innerPlatform = new THREE.Mesh(innerPlatformGeo, innerPlatformMat);
        innerPlatform.rotation.x = Math.PI / 2;
        innerPlatform.position.y = 0.02;
        scene.add(innerPlatform);

        // Radial lines on floor (4 lines radiating from center)
        const radialMat = new THREE.LineBasicMaterial({ color: 0x1a5566, transparent: true, opacity: 0.3 });
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const rGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(Math.cos(angle) * 1.8, 0.015, Math.sin(angle) * 1.8),
                new THREE.Vector3(Math.cos(angle) * 3.5, 0.015, Math.sin(angle) * 3.5),
            ]);
            scene.add(new THREE.Line(rGeo, radialMat));
        }

        // Room walls — tall translucent panels around the scene (far back, subtle)
        const wallGeo = new THREE.PlaneGeometry(50, 20);
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x1a2030,
            metalness: 0.3,
            roughness: 0.6,
            transparent: true,
            opacity: 0.5,
        });

        // Back wall
        const backWall = new THREE.Mesh(wallGeo, wallMat);
        backWall.position.set(0, 10, -20);
        scene.add(backWall);

        // Left wall
        const leftWall = new THREE.Mesh(wallGeo, wallMat.clone());
        leftWall.position.set(-20, 10, 0);
        leftWall.rotation.y = Math.PI / 2;
        scene.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(wallGeo, wallMat.clone());
        rightWall.position.set(20, 10, 0);
        rightWall.rotation.y = -Math.PI / 2;
        scene.add(rightWall);

        // Glowing wall accent strips (horizontal light strips on walls)
        const accentStripGeo = new THREE.PlaneGeometry(40, 0.15);
        const cyanGlowMat = new THREE.MeshBasicMaterial({
            color: 0x22ccdd,
            transparent: true,
            opacity: 0.6,
        });
        const magGlowMat = new THREE.MeshBasicMaterial({
            color: 0xff3388,
            transparent: true,
            opacity: 0.3,
        });

        // Back wall — cyan accent line
        const backAccent = new THREE.Mesh(accentStripGeo, cyanGlowMat);
        backAccent.position.set(0, 3.5, -19.9);
        scene.add(backAccent);

        // Back wall — upper line
        const backAccent2 = new THREE.Mesh(accentStripGeo, cyanGlowMat.clone());
        (backAccent2.material as THREE.MeshBasicMaterial).opacity = 0.3;
        backAccent2.position.set(0, 8, -19.9);
        scene.add(backAccent2);

        // ═══════════════════════════════════════
        //       ATMOSPHERIC PARTICLES
        // ═══════════════════════════════════════
        const particleCount = 120;
        const particlesGeo = new THREE.BufferGeometry();
        const posArr = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) posArr[i] = (Math.random() - 0.5) * 20;
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
        const particlesMat = new THREE.PointsMaterial({
            color: 0x22d3ee, size: 0.04, transparent: true, opacity: 0.3,
            blending: THREE.AdditiveBlending, sizeAttenuation: true
        });
        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        // ═══════════════════════════════════════
        //       SCANNING LASER SWEEP
        // ═══════════════════════════════════════
        const scannerGeo = new THREE.RingGeometry(0, 8, 64);
        const scannerMat = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x22d3ee) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                void main() {
                    float dist = distance(vUv, vec2(0.5));
                    float ring = smoothstep(0.48, 0.5, dist) * (1.0 - smoothstep(0.5, 0.52, dist));
                    float scan = fract(time * 0.2);
                    float alpha = ring * smoothstep(scan, scan + 0.05, dist) * (1.0 - smoothstep(scan + 0.05, scan + 0.1, dist));
                    gl_FragColor = vec4(color, alpha * 0.4);
                }
            `,
            side: THREE.DoubleSide
        });
        const scannerSweep = new THREE.Mesh(scannerGeo, scannerMat);
        scannerSweep.rotation.x = -Math.PI / 2;
        scannerSweep.position.y = 0.03;
        scene.add(scannerSweep);

        // Left wall — magenta accent
        const leftAccent = new THREE.Mesh(accentStripGeo, magGlowMat);
        leftAccent.position.set(-19.9, 3.5, 0);
        leftAccent.rotation.y = Math.PI / 2;
        scene.add(leftAccent);

        // Right wall — cyan accent
        const rightAccent = new THREE.Mesh(accentStripGeo, cyanGlowMat.clone());
        (rightAccent.material as THREE.MeshBasicMaterial).opacity = 0.4;
        rightAccent.position.set(19.9, 3.5, 0);
        rightAccent.rotation.y = -Math.PI / 2;
        scene.add(rightAccent);

        // ═══════════════════════════════════════
        //          SLOT MARKERS
        // ═══════════════════════════════════════
        const SLOT_POSITIONS: Record<string, THREE.Vector3> = {
            [PartSlot.HEAD]: new THREE.Vector3(0, 5.8, 0),
            [PartSlot.CORE]: new THREE.Vector3(0, 3.6, 0),
            [PartSlot.LEFT_ARM]: new THREE.Vector3(-1.0, 4.2, 0),
            [PartSlot.RIGHT_ARM]: new THREE.Vector3(1.0, 4.2, 0),
            [PartSlot.LEGS]: new THREE.Vector3(0, 1.2, 0),
        };

        const SLOT_RING_SCALE: Record<string, number> = {
            [PartSlot.HEAD]: 3.0,
            [PartSlot.CORE]: 5.0,
            [PartSlot.LEFT_ARM]: 1.8,
            [PartSlot.RIGHT_ARM]: 1.8,
            [PartSlot.LEGS]: 4.0,
        };

        const markerGroup = new THREE.Group();
        scene.add(markerGroup);
        reticleRef.current = markerGroup;

        const dotGeo = new THREE.SphereGeometry(0.06, 8, 8);

        const activeRingGeo = new THREE.TorusGeometry(0.18, 0.012, 16, 64);
        const activeRingMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.7 });
        const activeRing = new THREE.Mesh(activeRingGeo, activeRingMat);
        activeRing.rotation.x = Math.PI / 2;

        const pulseRingGeo = new THREE.TorusGeometry(0.22, 0.008, 16, 64);
        const pulseRingMat = new THREE.MeshBasicMaterial({ color: 0xd946ef, transparent: true, opacity: 0.35 });
        const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
        pulseRing.rotation.x = Math.PI / 2;

        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -0.3, 0)
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.3 });
        const activeLine = new THREE.Line(lineGeo, lineMat);

        const slotDots: Record<string, THREE.Mesh> = {};
        Object.entries(SLOT_POSITIONS).forEach(([slot, pos]) => {
            const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({
                color: 0x334455, transparent: true, opacity: 0.4
            }));
            dot.position.copy(pos);
            markerGroup.add(dot);
            slotDots[slot] = dot;
        });

        markerGroup.add(activeRing);
        markerGroup.add(pulseRing);
        markerGroup.add(activeLine);

        // ═══════════════════════════════════════
        //        POST-PROCESSING
        // ═══════════════════════════════════════
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        // Subtle bloom for glow on accent strips and bright highlights
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(w, h),
            0.4,    // strength
            0.6,    // radius
            0.8     // threshold
        );
        composer.addPass(bloomPass);

        // FXAA
        const fxaaPass = new ShaderPass(FXAAShader);
        fxaaPass.uniforms['resolution'].value.set(
            1 / (w * renderer.getPixelRatio()),
            1 / (h * renderer.getPixelRatio())
        );
        composer.addPass(fxaaPass);
        composerRef.current = composer;

        // ═══════════════════════════════════════
        //            CONTROLS
        // ═══════════════════════════════════════
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.target.set(0, 3, 0);
        controls.minDistance = 6;
        controls.maxDistance = 22;
        controls.maxPolarAngle = Math.PI / 2 + 0.05;
        controls.minPolarAngle = 0.3;
        controlsRef.current = controls;

        // ═══════════════════════════════════════
        //           FBX LOAD
        // ═══════════════════════════════════════
        const loader = new FBXLoader();
        const MODEL_URL = '/models/humanoid_robot.fbx';

        loader.load(
            MODEL_URL,
            (fbx) => {
                if (!container.isConnected) return;
                modelRef.current = fbx;

                // Auto-Orientation
                fbx.updateMatrixWorld(true);
                const box = new THREE.Box3().setFromObject(fbx);
                const size = box.getSize(new THREE.Vector3());

                if (size.z > size.y * 1.5) fbx.rotation.x = -Math.PI / 2;
                else if (size.x > size.y * 1.5) fbx.rotation.z = Math.PI / 2;
                fbx.updateMatrixWorld(true);

                // Auto-Scale
                const fixedBox = new THREE.Box3().setFromObject(fbx);
                const fixedSize = fixedBox.getSize(new THREE.Vector3());
                const scale = TARGET_HEIGHT / (fixedSize.y || 1);
                fbx.scale.set(scale, scale, scale);
                fbx.updateMatrixWorld(true);

                // Auto-Center
                const finalBox = new THREE.Box3().setFromObject(fbx);
                const finalCenter = finalBox.getCenter(new THREE.Vector3());
                fbx.position.set(-finalCenter.x, -finalBox.min.y, -finalCenter.z);
                fbx.updateMatrixWorld(true);

                // PBR Physical Materials
                fbx.traverse((child) => {
                    const obj = child as any;
                    obj.visible = true;
                    if (obj.isMesh || obj.isSkinnedMesh) {
                        obj.frustumCulled = false;
                        obj.castShadow = true;
                        obj.receiveShadow = true;

                        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                        const fixedMats = mats.map((m: any) => {
                            if (!m) return new THREE.MeshPhysicalMaterial({
                                color: 0x888888, metalness: 0.6, roughness: 0.3, side: THREE.DoubleSide
                            });

                            const tex = m.map || null;
                            const normalMap = m.normalMap || null;
                            const col = m.color ? m.color.clone() : new THREE.Color(0xaaaaaa);

                            const lum = col.r * 0.299 + col.g * 0.587 + col.b * 0.114;
                            const isMetal = lum < 0.45;

                            return new THREE.MeshPhysicalMaterial({
                                color: col,
                                map: tex,
                                normalMap: normalMap,
                                metalness: isMetal ? 0.75 : 0.08,
                                roughness: isMetal ? 0.2 : 0.5,
                                clearcoat: isMetal ? 0.35 : 0.05,
                                clearcoatRoughness: 0.15,
                                envMapIntensity: isMetal ? 2.0 : 0.5,
                                side: THREE.DoubleSide,
                            });
                        });
                        obj.material = Array.isArray(obj.material) ? fixedMats : fixedMats[0];
                    }
                });

                scene.add(fbx);

                if (fbx.animations && fbx.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(fbx);
                    mixerRef.current = mixer;
                    mixer.clipAction(fbx.animations[0]).play();
                }

                setLoading(false);
            },
            (xhr) => {
                const pct = (xhr.loaded / (xhr.total || 45737520)) * 100;
                setProgress(pct);
            },
            (err) => {
                console.error('FBX_LOAD: ERROR:', err);
                setError(String(err));
                setLoading(false);
            }
        );

        // ═══════════════════════════════════════
        //           ANIMATION LOOP
        // ═══════════════════════════════════════
        const clock = new THREE.Clock();
        const animate = () => {
            requestRef.current = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            if (mixerRef.current) mixerRef.current.update(delta);
            if (controlsRef.current) controlsRef.current.update();

            // Gentle accent light breathing
            cyanSpot.intensity = 20 + Math.sin(time * 0.5) * 4;
            magentaSpot.intensity = 10 + Math.sin(time * 0.4 + 1) * 3;

            // Particles animation
            particles.rotation.y = time * 0.02;
            const positions = particles.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 1] += Math.sin(time * 0.5 + i) * 0.002; // subtle float
            }
            particles.geometry.attributes.position.needsUpdate = true;

            // Update scanner sweep uniform
            scannerMat.uniforms.time.value = time;

            // Wall accent glow pulse
            (backAccent.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(time * 0.6) * 0.15;
            (leftAccent.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(time * 0.5 + 1) * 0.1;
            (rightAccent.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(time * 0.7 + 2) * 0.1;

            // Platform rings rotation
            platformRing.rotation.z = time * 0.06;
            innerPlatform.rotation.z = -time * 0.1;

            // Slot markers
            const currentSlot = activeSlotRef.current;
            const targetPos = SLOT_POSITIONS[currentSlot] || SLOT_POSITIONS[PartSlot.CORE];
            const targetScale = SLOT_RING_SCALE[currentSlot] || 3.0;

            activeRing.position.lerp(targetPos, 0.12);
            pulseRing.position.lerp(targetPos, 0.12);
            activeLine.position.lerp(targetPos, 0.12);

            const cs = activeRing.scale.x;
            const ns = cs + (targetScale - cs) * 0.1;
            activeRing.scale.set(ns, ns, ns);
            activeRing.rotation.z = time * 0.8;

            const pulse = ns * (1 + Math.sin(time * 3) * 0.12);
            pulseRing.scale.set(pulse, pulse, pulse);
            pulseRingMat.opacity = 0.25 + Math.sin(time * 3) * 0.1;

            Object.entries(slotDots).forEach(([slot, dot]) => {
                const mat = dot.material as THREE.MeshBasicMaterial;
                if (slot === currentSlot) {
                    mat.color.set(0x22d3ee);
                    mat.opacity = 0.9;
                    const s = 1 + Math.sin(time * 4) * 0.2;
                    dot.scale.set(s, s, s);
                } else {
                    mat.color.set(0x334455);
                    mat.opacity = 0.3;
                    dot.scale.set(1, 1, 1);
                }
            });

            if (composerRef.current) {
                composerRef.current.render();
            } else {
                renderer.render(scene, camera);
            }
        };
        animate();

        // Resize
        const onResize = () => {
            const nw = container.clientWidth;
            const nh = container.clientHeight;
            camera.aspect = nw / (nh || 1);
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
            composer.setSize(nw, nh);
            fxaaPass.uniforms['resolution'].value.set(
                1 / (nw * renderer.getPixelRatio()),
                1 / (nh * renderer.getPixelRatio())
            );
        };
        window.addEventListener('resize', onResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(requestRef.current);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            composer.dispose();
        };
    }, []);

    return (
        <div className="w-full h-full relative bg-[#141b24] overflow-hidden" ref={mountRef}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117] z-30">
                    <div className="text-cyan-400 font-mono-tech flex flex-col items-center gap-6">
                        <ScanLine size={48} className="animate-pulse" />
                        <div className="text-center">
                            <div className="text-sm tracking-widest mb-2 uppercase">Initializing Neural Feed</div>
                            <div className="w-64 h-1 bg-cyan-950 rounded-full overflow-hidden relative">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_15px_#22d3ee] transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="text-[10px] mt-2 opacity-40 uppercase">Downloading Bio-Signature: {progress.toFixed(0)}%</div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40 bg-red-950/40 border border-red-500/50 p-4 backdrop-blur clip-corner-1 text-red-200 text-xs font-mono-tech flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-500" />
                    <span>SYNC_ERROR: {error}</span>
                </div>
            )}

            {/* HUD */}
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start opacity-50">
                    <div className="text-[10px] font-mono-tech text-cyan-500/70 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_#22d3ee]" />
                        NEXUS_VIEWPORT: {loading ? 'LOADING' : 'ONLINE'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blueprint;