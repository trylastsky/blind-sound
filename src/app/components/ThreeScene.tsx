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
    const floorRef = useRef<THREE.Mesh | null>(null);
    const animationRef = useRef<number>(0);

    // Константы для координат (совпадают с 2D режимом)
    const CANVAS_SIZE = 400; // Размер 2D канваса
    const CANVAS_RADIUS = 150; // Радиус 2D канваса
    const SCENE_RADIUS = 2.5; // Радиус 3D сцены

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
                    new THREE.BoxGeometry(1.5, 0.8, 0.1),
                    obstacleMaterial
                );
                wall.position.set(0, 0.4, 0);
                wall.userData = { isObstacle: true };
                scene.add(wall);
                break;

            case 'pillar':
                const pillar1 = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16),
                    obstacleMaterial
                );
                pillar1.position.set(-1, 0.4, -1);
                pillar1.userData = { isObstacle: true };
                scene.add(pillar1);

                const pillar2 = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16),
                    obstacleMaterial
                );
                pillar2.position.set(1, 0.4, 1);
                pillar2.userData = { isObstacle: true };
                scene.add(pillar2);
                break;

            case 'corner':
                const corner = new THREE.Mesh(
                    new THREE.BoxGeometry(1, 0.8, 1),
                    obstacleMaterial
                );
                corner.position.set(-1.2, 0.4, -1.2);
                corner.userData = { isObstacle: true };
                scene.add(corner);
                break;

            case 'tunnel':
                const tunnel = new THREE.Mesh(
                    new THREE.TorusGeometry(1.2, 0.2, 16, 100),
                    obstacleMaterial
                );
                tunnel.rotation.x = Math.PI / 2;
                tunnel.position.y = 0.4;
                tunnel.userData = { isObstacle: true };
                scene.add(tunnel);
                break;

            case 'maze':
                const walls = [
                    { position: [0, 0.4, -0.8], size: [2, 0.8, 0.05] },
                    { position: [0.8, 0.4, 0], size: [0.05, 0.8, 1.5] },
                    { position: [-0.8, 0.4, 0.8], size: [1.2, 0.8, 0.05] },
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

    // Преобразование из 2D координат канваса в 3D координаты сцены
    const point2DTo3D = (point: Point): THREE.Vector3 => {
        // Центрируем координаты относительно центра канваса
        const centeredX = point.x - CANVAS_SIZE / 2;
        const centeredY = point.y - CANVAS_SIZE / 2;
        
        // Масштабируем к радиусу сцены (без инверсии Y!)
        const scale = SCENE_RADIUS / CANVAS_RADIUS;
        const x = centeredX * scale;
        const z = centeredY * scale; // Не инвертируем Y!
        const y = 0.1; // Высота над полом
        
        return new THREE.Vector3(x, y, z);
    };

    // Преобразование из 3D координат сцены в 2D координаты канваса
    const point3DTo2D = (point: THREE.Vector3): Point => {
        const scale = CANVAS_RADIUS / SCENE_RADIUS;
        const x = point.x * scale + CANVAS_SIZE / 2;
        const y = point.z * scale + CANVAS_SIZE / 2; // Не инвертируем!
        
        return { x, y, z: point.y };
    };

    const updateMarkers = () => {
        if (!sceneRef.current) return;

        // Удаляем старые маркеры
        const markers: THREE.Object3D[] = [];
        sceneRef.current.children.forEach(child => {
            if (child.userData?.isMarker) {
                markers.push(child);
            }
        });
        markers.forEach(marker => sceneRef.current!.remove(marker));

        // Добавляем маркер источника звука (зеленый)
        if (showResult && soundSource) {
            const sourceGeometry = new THREE.SphereGeometry(0.1);
            const sourceMaterial = new THREE.MeshPhongMaterial({ color: 0x4ade80 });
            const sourceMarker = new THREE.Mesh(sourceGeometry, sourceMaterial);
            
            const sourcePos = point2DTo3D(soundSource);
            sourceMarker.position.copy(sourcePos);
            sourceMarker.userData = { isMarker: true };
            sceneRef.current.add(sourceMarker);

            // Добавляем свечение для источника
            const sourceLight = new THREE.PointLight(0x4ade80, 0.5, 1);
            sourceLight.position.copy(sourcePos);
            sourceLight.userData = { isMarker: true };
            sceneRef.current.add(sourceLight);
        }

        // Добавляем маркер предположения пользователя
        if (userGuess) {
            const guessGeometry = new THREE.SphereGeometry(0.08);
            const guessMaterial = new THREE.MeshPhongMaterial({
                color: showResult ? 0xf87171 : 0x60a5fa
            });
            const guessMarker = new THREE.Mesh(guessGeometry, guessMaterial);
            
            const guessPos = point2DTo3D(userGuess);
            guessMarker.position.copy(guessPos);
            guessMarker.userData = { isMarker: true };
            sceneRef.current.add(guessMarker);

            // Добавляем линию между предположением и источником
            if (showResult && soundSource) {
                const lineGeometry = new THREE.BufferGeometry();
                const sourcePos = point2DTo3D(soundSource);
                const points = [guessPos, sourcePos];
                lineGeometry.setFromPoints(points);

                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x94a3b8,
                    linewidth: 2
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
        camera.position.set(0, 3, 3);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 500);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(renderer.domElement);

        // Освещение
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Пол (круглая область)
        const floorGeometry = new THREE.CircleGeometry(SCENE_RADIUS, 32);
        const floorMaterial = new THREE.MeshPhongMaterial({
            color: 0x374151,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        floor.userData = { isFloor: true };
        floorRef.current = floor;
        scene.add(floor);

        // Сетка
        const gridHelper = new THREE.GridHelper(SCENE_RADIUS * 2, 10, 0x4b5563, 0x4b5563);
        gridHelper.position.y = 0.01;
        scene.add(gridHelper);

        // Граница сцены
        const borderGeometry = new THREE.RingGeometry(SCENE_RADIUS - 0.02, SCENE_RADIUS, 32);
        const borderMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4ade80,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.rotation.x = -Math.PI / 2;
        border.position.y = 0.02;
        scene.add(border);

        // Подписи осей для ориентации
        const createAxisLabel = (text: string, position: THREE.Vector3) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.width = 128;
            canvas.height = 64;
            context.fillStyle = '#ffffff';
            context.font = '24px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, 64, 32);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            sprite.scale.set(0.5, 0.25, 1);
            scene.add(sprite);
        };

        createAxisLabel('Перед', new THREE.Vector3(0, 0, -SCENE_RADIUS - 0.3));
        createAxisLabel('Зад', new THREE.Vector3(0, 0, SCENE_RADIUS + 0.3));
        createAxisLabel('Лево', new THREE.Vector3(-SCENE_RADIUS - 0.3, 0, 0));
        createAxisLabel('Право', new THREE.Vector3(SCENE_RADIUS + 0.3, 0, 0));

        // Создаем препятствия
        createObstacles(scene);

        // Обработчик кликов
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleClick = (event: MouseEvent) => {
            if (!mountRef.current || !cameraRef.current || !floorRef.current) return;

            const rect = mountRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / 500) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / 500) * 2 + 1;

            raycaster.setFromCamera(mouse, cameraRef.current);

            const intersects = raycaster.intersectObject(floorRef.current);

            if (intersects.length > 0) {
                const point3D = intersects[0].point;
                const point2D = point3DTo2D(point3D);
                onPointSelect(point2D);
            }
        };

        mountRef.current.addEventListener('click', handleClick);

        // Анимация
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