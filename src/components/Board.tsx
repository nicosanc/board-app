import { useLoader } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

export default function Board() {
  const boardWidth = 2.5
  const boardHeight = 2
  const boardDepth = 0.08 // Increased thickness for more presence
  const frameThickness = 0.05
  const frameDepth = 0.04
  const corkInset = 0.02 // How far back the cork sits from the frame front

  const colorMap = useLoader(THREE.TextureLoader, '/textures/cork-color.png')
  const normalMap = useLoader(THREE.TextureLoader, '/textures/cork-normal.png')
  const roughnessMap = useLoader(THREE.TextureLoader, '/textures/cork-roughness.png')

  useEffect(() => {
    [colorMap, normalMap, roughnessMap].forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(2, 2)
      texture.anisotropy = 16
    })
  }, [colorMap, normalMap, roughnessMap])

  // Create frame as a single extruded shape with bevel
  const frameShape = new THREE.Shape()
  const outerWidth = boardWidth + frameThickness * 2
  const outerHeight = boardHeight + frameThickness * 2

  // Outer rectangle
  frameShape.moveTo(-outerWidth / 2, -outerHeight / 2)
  frameShape.lineTo(outerWidth / 2, -outerHeight / 2)
  frameShape.lineTo(outerWidth / 2, outerHeight / 2)
  frameShape.lineTo(-outerWidth / 2, outerHeight / 2)
  frameShape.lineTo(-outerWidth / 2, -outerHeight / 2)

  // Inner rectangle (hole for cork board)
  const holePath = new THREE.Path()
  holePath.moveTo(-boardWidth / 2, -boardHeight / 2)
  holePath.lineTo(-boardWidth / 2, boardHeight / 2)
  holePath.lineTo(boardWidth / 2, boardHeight / 2)
  holePath.lineTo(boardWidth / 2, -boardHeight / 2)
  holePath.lineTo(-boardWidth / 2, -boardHeight / 2)
  frameShape.holes.push(holePath)

  const extrudeSettings = {
    depth: frameDepth,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3
  }

  return (
    <group position={[0, 1.6, -0.4]}> {/* Positioned at eye height, close to wall */}
      {/* Cork board surface - recessed behind frame with bevel */}
      <mesh receiveShadow castShadow position={[0, 0, -corkInset]}>
        <boxGeometry args={[boardWidth, boardHeight, boardDepth, 1, 1, 1]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* Aluminum frame - with beveled edges */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[frameShape, extrudeSettings]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  )
}
