import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useDrag, useWheel, usePinch } from '@use-gesture/react'
import * as THREE from 'three'

export function useCameraControls() {
  const { camera, gl } = useThree()
  const cameraPosition = useRef(new THREE.Vector3(0, 0, 10))
  const zoom = useRef(3)

  // Pan limits (prevent camera from going too far)
  const panLimits = { x: 20, y: 15 }
  // Zoom limits: min = furthest out (current close view), max = closest (full screen)
  const zoomLimits = { min: 3, max: 8 }

  // Initialize zoom on mount
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      zoom.current = camera.zoom
    }
  }, [camera])

  // Drag to pan (X/Y movement only)
  useDrag(
    ({ delta: [dx, dy] }) => {
      const panSpeed = 0.01 / zoom.current

      cameraPosition.current.x -= dx * panSpeed
      cameraPosition.current.y += dy * panSpeed

      // Clamp to limits
      cameraPosition.current.x = THREE.MathUtils.clamp(
        cameraPosition.current.x,
        -panLimits.x,
        panLimits.x
      )
      cameraPosition.current.y = THREE.MathUtils.clamp(
        cameraPosition.current.y,
        -panLimits.y,
        panLimits.y
      )

      camera.position.set(
        cameraPosition.current.x,
        cameraPosition.current.y,
        cameraPosition.current.z
      )
    },
    { target: gl.domElement }
  )

  // Scroll to zoom (Z movement only, via orthographic zoom)
  useWheel(
    ({ delta: [, dy] }) => {
      const zoomSpeed = 0.01
      zoom.current = THREE.MathUtils.clamp(
        zoom.current + dy * zoomSpeed,
        zoomLimits.min,
        zoomLimits.max
      )

      if (camera instanceof THREE.OrthographicCamera) {
        camera.zoom = zoom.current
        camera.updateProjectionMatrix()
      }
    },
    { target: gl.domElement }
  )

  // Pinch to zoom (mobile support)
  usePinch(
    ({ offset: [scale] }) => {
      zoom.current = THREE.MathUtils.clamp(
        scale,
        zoomLimits.min,
        zoomLimits.max
      )

      if (camera instanceof THREE.OrthographicCamera) {
        camera.zoom = zoom.current
        camera.updateProjectionMatrix()
      }
    },
    { target: gl.domElement }
  )

  return null
}
