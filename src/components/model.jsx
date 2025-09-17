import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";

function KitchenModel() {
  const gltf = useGLTF("/models/kitchen.glb");
  console.log("GLTF-modell:", gltf);
  return <primitive object={gltf.scene} />;
}

export default function Model() {
  return (
    <div id="configurator-model">
      <Canvas camera={{ position: [-10, 10, 10], fov: 100 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 5, 5]} intensity={1} />
        <KitchenModel />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
