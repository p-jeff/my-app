import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Physics, useSphere } from "@react-three/cannon"

const rfs = THREE.MathUtils.randFloatSpread

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const baubleMaterial = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.8 })

export const App = () => (
  <>
    <h1>
      Johannes Felix Lotze
    </h1>

    <Canvas shadows camera={{ position: [10, 10, 20], fov: 35, near: 1, far: 40 }}>
      <ambientLight intensity={0.25} />
      <spotLight intensity={1} angle={0.2} penumbra={1} position={[30, 30, 30]} castShadow shadow-mapSize={[512, 512]} />
      <directionalLight intensity={5} position={[-10, -10, -10]} color="purple" />
      <Physics gravity={[0, 0, 0]} iterations={3}>
        <Pointer />
        <Clump />
      </Physics>
    </Canvas >
    <h2 onClick={() => window.location.assign('/page/index.html')}>
      Work
    </h2>
    <h3 onClick={() => window.location.assign('about.html')}>
      About
    </h3>
  </>
)

function Clump({ mat = new THREE.Matrix4(), vec = new THREE.Vector3(), ...props }) {

  const [ref, api] = useSphere(() => ({ args: [2], mass: 2, angularDamping: 0.1, linearDamping: 0.65, position: [rfs(30), rfs(30), rfs(30)] }))
  useFrame((state) => {
    for (let i = 0; i < 50; i++) {
      // Get current whereabouts of the instanced sphere
      ref.current.getMatrixAt(i, mat)
      // Normalize the position and multiply by a negative force.
      // This is enough to drive it towards the center-point.
      api.at(i).applyForce(vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-5).toArray(), [0, 50, 0])
    }
  })
  return <instancedMesh ref={ref} castShadow receiveShadow args={[null, null, 80]} geometry={sphereGeometry} material={baubleMaterial} />
}

function Pointer() {
  const viewport = useThree((state) => state.viewport)
  const [, api] = useSphere(() => ({ type: "Kinematic", args: [1], position: [0, 0, 0] }))
  return useFrame((state) => api.position.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0))
}
