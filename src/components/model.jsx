import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const TARGET_PARTS = [
  "luckor",
  "luckor001",
  "luckor002",
  "Stomme",
  "Stomme001",
  // "Bänkskiva",
  // "Bänksikva_ö",
  "Kylskåp",
  // "vinkyl",
  "Ö",
  // "Golv", //
];

function recolorTargets(scene, color) {
  TARGET_PARTS.forEach((name) => {
    const mesh = scene.getObjectByName(name);
    if (mesh && mesh.isMesh) {
      const newMat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.1,
        roughness: 0.6,
      });
      newMat.name = `Override_${name}`;
      mesh.material = newMat;
      mesh.material.needsUpdate = true;
    }
  });
}

function KitchenModel({ colorHex }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + "/models/kitchen.glb");
  const color = useMemo(() => new THREE.Color(colorHex), [colorHex]);

  useEffect(() => {
    if (!scene) return;
    console.log("GLB object:", scene);
    recolorTargets(scene, color);
  }, [scene, color]);

  return <primitive object={scene} />;
}

export default function Model({ colorHex }) {
  return (
    <div id="configurator-model" style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [-10, 10, 10], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 8, 6]} intensity={1} />
        <KitchenModel colorHex={colorHex} />
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}
