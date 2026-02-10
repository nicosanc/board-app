export default function Wall() {
  const wallWidth = 25  // Extended for room feel
  const wallHeight = 8

  return (
    <mesh position={[0, 1.6, -0.5]} receiveShadow> {/* Centered at eye height */}
      <planeGeometry args={[wallWidth, wallHeight]} />
      <meshStandardMaterial
        color="#f5f5f0"
        roughness={0.85}
        metalness={0.0}
      />
    </mesh>
  )
}
