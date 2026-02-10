export default function Floor() {
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -2.4, 0]} 
      receiveShadow
    >
      <planeGeometry args={[25, 15]} />
      <meshStandardMaterial 
        color="#b8956a"
        roughness={0.8}
        metalness={0.0}
      />
    </mesh>
  )
}
