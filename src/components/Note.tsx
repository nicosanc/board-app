import * as THREE from 'three'

interface NoteProps {
  position: [number, number, number]
  text: string
}

export default function Note({ position, text }: NoteProps) {
  return (
    <group position={position}>
      {/* Paper note - slightly raised from board */}
      <mesh castShadow receiveShadow position={[0, 0, 0.05]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshStandardMaterial
          color="#fffacd"
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Pushpin */}
      <mesh castShadow position={[0, 0.15, 0.08]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial
          color="#dc2626"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
    </group>
  )
}
