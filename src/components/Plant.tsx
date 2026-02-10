export default function Plant() {
  return (
    <group position={[-1.5, -2.4, 1.2]} scale={2}> {/* Left of board, bigger, closer to camera */}
      {/* Pot */}
      <mesh castShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.3, 16]} />
        <meshStandardMaterial 
          color="#8b7355"
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>
      
      {/* Main stem */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.5, 8]} />
        <meshStandardMaterial 
          color="#2d5016"
          roughness={0.6}
        />
      </mesh>
      
      {/* Leaves - simple spheres */}
      <mesh castShadow position={[-0.08, 0.6, 0.05]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial 
          color="#4a7c2c"
          roughness={0.5}
        />
      </mesh>
      
      <mesh castShadow position={[0.06, 0.65, -0.04]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial 
          color="#5a8c3c"
          roughness={0.5}
        />
      </mesh>
      
      <mesh castShadow position={[0.02, 0.75, 0.08]}>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshStandardMaterial 
          color="#4d8030"
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}
