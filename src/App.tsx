import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'

// Fondo 360: esfera gigante con la imagen pegada por DENTRO
function Fondo360() {
  const textura = useTexture('/360.jpg')
  textura.colorSpace = THREE.SRGBColorSpace

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={textura} side={THREE.BackSide} />
    </mesh>
  )
}

// Triángulo: un cono de 3 lados (pirámide triangular)
function Triangulo() {
  const ref = useRef<THREE.Mesh>(null!)
  const [hover, setHover] = useState(false)

  useFrame((_, delta) => {
    ref.current.rotation.y += delta
  })

  return (
    <mesh
      ref={ref}
      position={[-2, 0, -4]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <coneGeometry args={[1, 1.5, 3]} />
      <meshStandardMaterial color={hover ? 'yellow' : 'red'} />
    </mesh>
  )
}

// Esfera
function Esfera() {
  const ref = useRef<THREE.Mesh>(null!)
  const [activa, setActiva] = useState(false)

  useFrame((state) => {
    // sube y baja suavemente
    ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5
  })

  return (
    <mesh
      ref={ref}
      position={[2, 0, -4]}
      scale={activa ? 1.4 : 1}
      onClick={() => setActiva(!activa)}
    >
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="deepskyblue" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      <Suspense fallback={null}>
        <Fondo360 />
      </Suspense>

      <Triangulo />
      <Esfera />

      {/* Arrastra para mirar alrededor */}
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.4} />
    </Canvas>
  )
}
