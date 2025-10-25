'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Point {
    x: number;
    y: number;
    z?: number;
}

interface ThreeSceneProps {
    obstacleType: string;
    onPointSelect: (point: Point) => void;
    soundSource: Point | null;
    userGuess: Point | null;
    showResult: boolean;
}

export default function ThreeScene({ obstacleType, onPointSelect, soundSource, userGuess, showResult }: ThreeSceneProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationRef = useRef<number>(0);

    const createObstacles = (scene: THREE.Scene) => {
        const obstacles: THREE.Object3D[] = [];
        scene.children.forEach(child => {
            if (child.userData?.isObstacle) {
                obstacles.push(child);
            }
        });
        obstacles.forEach(obstacle => scene.remove(obstacle));

        if (obstacleType === 'none') return;

        const obstacleMaterial = new THREE.MeshPhongMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.7
        });

        switch (obstacleType) {
            case 'wall':
                const wall = new THREE.Mesh(
                    new THREE.BoxGeometry(2, 1, 0.2),
                    obstacleMaterial
                );
                wall.position.set(0, 0.5, 0);
                wall.userData = { isObstacle: true };
                scene.add(wall);
                break;

            case 'pillar':
                const pillar1 = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.3, 0.3, 1, 16),
                    obstacleMaterial
                );
                pillar1.position.set(-1, 0.5, -1);
                pillar1.userData = { isObstacle: true };
                scene.add(pillar1);

                const pillar2 = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.3, 0.3, 1, 16),
                    obstacleMaterial
                );
                pillar2.position.set(1, 0.5, 1);
                pillar2.userData = { isObstacle: true };
                scene.add(pillar2);
                break;

            case 'corner':
                const corner = new THREE.Mesh(
                    new THREE.BoxGeometry(1.5, 1, 1.5),
                    obstacleMaterial
                );
                corner.position.set(-1.5, 0.5, -1.5);
                corner.userData = { isObstacle: true };
                scene.add(corner);
                break;

            case 'tunnel':
                const tunnel = new THREE.Mesh(
                    new THREE.TorusGeometry(1.5, 0.3, 16, 100),
                    obstacleMaterial
                );
                tunnel.rotation.x = Math.PI / 2;
                tunnel.position.y = 0.5;
                tunnel.userData = { isObstacle: true };
                scene.add(tunnel);
                break;

            case 'maze':
                const walls = [
                    { position: [0, 0.5, -1], size: [3, 1, 0.1] },
                    { position: [1, 0.5, 0], size: [0.1, 1, 2] },
                    { position: [-1, 0.5, 1], size: [2, 1, 0.1] },
                ];

                walls.forEach(wallConfig => {
                    const wall = new THREE.Mesh(
                        new THREE.BoxGeometry(...wallConfig.size as [number, number, number]),
                        obstacleMaterial
                    );
                    wall.position.set(...wallConfig.position as [number, number, number]);
                    wall.userData = { isObstacle: true };
                    scene.add(wall);
                });
                break;
        }
    };

    const updateMarkers = () => {
        if (!sceneRef.current) return;

        const markers: THREE.Object3D[] = [];
        sceneRef.current.children.forEach(child => {
            if (child.userData?.isMarker) {
                markers.push(child);
            }
        });
        markers.forEach(marker => sceneRef.current!.remove(marker));

        if (showResult && soundSource) {
            const sourceGeometry = new THREE.SphereGeometry(0.15);
            const sourceMaterial = new THREE.MeshPhongMaterial({ color: 0x4ade80 });
            const sourceMarker = new THREE.Mesh(sourceGeometry, sourceMaterial);

            sourceMarker.position.set(
                (soundSource.x / 150) * 3 - 1.5,
                0.15,
                (soundSource.y / 150) * 3 - 1.5
            );

            sourceMarker.userData = { isMarker: true };
            sceneRef.current.add(sourceMarker);
        }

        if (userGuess) {
            const guessGeometry = new THREE.SphereGeometry(0.1);
            const guessMaterial = new THREE.MeshPhongMaterial({
                color: showResult ? 0xf87171 : 0x60a5fa
            });
            const guessMarker = new THREE.Mesh(guessGeometry, guessMaterial);

            guessMarker.position.set(
                (userGuess.x / 150) * 3 - 1.5,
                0.1,
                (userGuess.y / 150) * 3 - 1.5
            );

            guessMarker.userData = { isMarker: true };
            sceneRef.current.add(guessMarker);

            if (showResult && soundSource) {
                const lineGeometry = new THREE.BufferGeometry();
                const points = [
                    new THREE.Vector3(
                        (userGuess.x / 150) * 3 - 1.5,
                        0.1,
                        (userGuess.y / 150) * 3 - 1.5
                    ),
                    new THREE.Vector3(
                        (soundSource.x / 150) * 3 - 1.5,
                        0.15,
                        (soundSource.y / 150) * 3 - 1.5
                    )
                ];
                lineGeometry.setFromPoints(points);

                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x94a3b8,
                    transparent: true,
                    opacity: 0.6
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                line.userData = { isMarker: true };
                sceneRef.current.add(line);
            }
        }
    };

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1e293b);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);
        camera.position.set(0, 4, 4);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(500, 500);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        if (mountRef.current.children.length === 0) {
            mountRef.current.appendChild(renderer.domElement);
        }

        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const floorGeometry = new THREE.PlaneGeometry(6, 6);
        const floorMaterial = new THREE.MeshPhongMaterial({
            color: 0x374151,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        scene.add(floor);

        const gridHelper = new THREE.GridHelper(6, 12, 0x4b5563, 0x4b5563);
        gridHelper.position.y = 0.01;
        scene.add(gridHelper);

        const axesHelper = new THREE.AxesHelper(2);
        scene.add(axesHelper);

        createObstacles(scene);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleClick = (event: MouseEvent) => {
            if (!mountRef.current || !cameraRef.current) return;

            const rect = mountRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / 500) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / 500) * 2 + 1;

            raycaster.setFromCamera(mouse, cameraRef.current);

            const intersects = raycaster.intersectObject(floor);

            if (intersects.length > 0) {
                const point = intersects[0].point;
                onPointSelect({
                    x: ((point.x + 3) / 6) * 300,
                    y: ((point.z + 3) / 6) * 300,
                    z: point.y
                });
            }
        };

        mountRef.current.addEventListener('click', handleClick);

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
            mountRef.current?.removeEventListener('click', handleClick);

            if (rendererRef.current) {
                rendererRef.current.dispose();
            }

            if (mountRef.current && rendererRef.current?.domElement) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }

            sceneRef.current = null;
            cameraRef.current = null;
            rendererRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (sceneRef.current) {
            createObstacles(sceneRef.current);
        }
    }, [obstacleType]);

    useEffect(() => {
        updateMarkers();
    }, [soundSource, userGuess, showResult]);

    return (
        <div
            ref={mountRef}
            className="border-2 border-blue-600 rounded-lg bg-slate-800 cursor-crosshair"
            style={{ width: 500, height: 500 }}
        />
    );
}