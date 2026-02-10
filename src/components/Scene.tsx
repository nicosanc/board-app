import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, CameraControls, Environment } from '@react-three/drei'
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing'
import Board from './Board'
import Wall from './Wall'
import Floor from './Floor'
import Plant from './Plant'
import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import CameraControlsImpl from 'camera-controls'

CameraControlsImpl.install({ THREE })

function CameraRig() {
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const timer = setTimeout(() => {
      // Set camera position and target - SAME Y VALUE = looking straight, not down
      controls.setLookAt(
        0, 1.6, 3.5,     // camera position
        0, 1.6, -0.4,    // target (SAME Y = perpendicular to wall)
        false
      )
      
      // Lock angles after setting position
      setTimeout(() => {
        controls.minPolarAngle = Math.PI / 2
        controls.maxPolarAngle = Math.PI / 2
        controls.minAzimuthAngle = 0
        controls.maxAzimuthAngle = 0
        
        controls.minDistance = 2.0
        controls.maxDistance = 4.5
        
        // Board: center y=1.6, height=2, so top=2.6, bottom=0.6
        // FOV 40, distance ~3.5, visible height ≈ 2.55 units (±1.275 from camera y)
        // Floor limit: board top (2.6) at top of viewport → camera_y ≈ 1.3
        // Ceiling limit: board bottom (0.6) at bottom of viewport → camera_y ≈ 1.9
        controls.setBoundary(
          new THREE.Box3(
            new THREE.Vector3(-5, 1.3, -10),   // left, bottom (floor), back
            new THREE.Vector3(5, 1.9, 10)      // right, top (ceiling), front
          )
        )
      }, 50)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <CameraControls 
      ref={controlsRef}
      azimuthRotateSpeed={0}
      polarRotateSpeed={0}
      truckSpeed={2}
      dollySpeed={1}
      mouseButtons={{
        left: CameraControlsImpl.ACTION.TRUCK,
        middle: CameraControlsImpl.ACTION.NONE,
        right: CameraControlsImpl.ACTION.NONE,
        wheel: CameraControlsImpl.ACTION.DOLLY
      }}
      touches={{
        one: CameraControlsImpl.ACTION.TOUCH_TRUCK,
        two: CameraControlsImpl.ACTION.TOUCH_DOLLY,
        three: CameraControlsImpl.ACTION.NONE
      }}
    />
  )
}

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ fov: 40, near: 0.1, far: 100, position: [0, 1.6, 3.5] }}
      style={{ width: '100vw', height: '100vh', background: '#d4d0c8' }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      <CameraRig />

      <Environment
        files="/hdri/room.hdr"
        background={false}
        backgroundBlurriness={0.1}
        environmentIntensity={0.3}
      />

      {/* Main directional light from upper left (window light) */}
      <directionalLight
        position={[-3, 3, 3]}
        target-position={[0, 1.6, 0]} // Aim at board center
        intensity={3.5}
        color="#fff9e6"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={4}
        shadow-camera-bottom={-1}
        shadow-bias={-0.001}
        shadow-radius={2}
      />

      {/* Ambient light - subtle base illumination */}
      <ambientLight intensity={0.15} color="#f5f5f0" />

      <Floor />
      <Wall />
      <Board />
      <Plant />

      <EffectComposer>
        <SSAO
          samples={31}
          radius={0.15}
          intensity={30}
          luminanceInfluence={0.6}
        />
        <Bloom
          intensity={0.2}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </Canvas>
  )
}
