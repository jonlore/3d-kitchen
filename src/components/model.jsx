import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Sidebar from "./sidebar";
import { useState } from "react";

const TARGET_PARTS = [
  "luckor",
  "luckor001",
  "luckor002",
  "Stomme",
  "Stomme001",
  "Kylskåp",
  "Ö",
];
function normalizeName(s = "") {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

// Anything that looks like a countertop node name
function isCountertopLike(name = "") {
  const n = normalizeName(name);

  return (
    n.includes("bankskiva") ||
    n.includes("banksikva") ||
    n.includes("banskiva") ||
    n.includes("benkskiva") ||
    (n.includes("o_") && (n.includes("bank") || n.includes("bansk"))) //
  );
}

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

function findCountertopMeshes(scene) {
  const hits = [];
  scene.traverse((o) => {
    if (o.isMesh && isCountertopLike(o.name)) {
      hits.push(o);
    }
  });
  return hits;
}

function applyRawMaterialToCountertops(scene, materials, materialKey) {
  if (!materialKey) return;

  const srcMat = materials?.[materialKey];
  if (!srcMat) {
    console.warn(
      `[kitchen] Raw material "${materialKey}" not found. Available:`,
      Object.keys(materials || {})
    );
    return;
  }

  const targets = findCountertopMeshes(scene);
  if (targets.length === 0) {
    console.warn(
      "[kitchen] No countertop meshes found by name. Enable logs to verify mesh names."
    );
  }

  targets.forEach((mesh) => {
    const cloned = srcMat.clone();
    cloned.name = `Raw_${materialKey}_for_${mesh.name}`;
    if (cloned.roughness !== undefined) cloned.roughness = 0.5;
    if (cloned.metalness !== undefined) cloned.metalness = 0.1;

    mesh.material = cloned;
    mesh.material.needsUpdate = true;
    mesh.needsUpdate = true;
  });

  scene.traverse((o) => {
    if (
      o.isMesh &&
      o.material?.name?.toLowerCase() === materialKey.toLowerCase()
    ) {
      o.material = o.material.clone();
      o.material.needsUpdate = true;
    }
  });

  console.log(
    `[kitchen] Applied raw material "${materialKey}" to:`,
    targets.map((t) => t.name)
  );
}

function KitchenModel({ colorHex, rawMaterial }) {
  const { scene, materials } = useGLTF(
    import.meta.env.BASE_URL + "/models/kitchennew.glb"
  );
  const color = useMemo(() => new THREE.Color(colorHex), [colorHex]);

  useEffect(() => {
    if (!scene) return;
    recolorTargets(scene, color);
  }, [scene, color]);

  useEffect(() => {
    if (!scene) return;
    applyRawMaterialToCountertops(scene, materials, rawMaterial);
  }, [scene, materials, rawMaterial]);

  return <primitive object={scene} />;
}

export default function Model() {
    const [colorHex, setColorHex] = useState("#6BAA75"); // startfärg
    const [rawMaterial, setRawMaterial] = useState(null); // "Marble.001" | "Color.004" | null
  return (
    <div id="configurator-model">

      <Canvas camera={{ position: [2, 8, 10], fov: 70 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 8, 6]} intensity={1} />
        <KitchenModel colorHex={colorHex} rawMaterial={rawMaterial} />
        <OrbitControls enableDamping />
      </Canvas>
      <Sidebar
        colorHex={colorHex}
        setColorHex={setColorHex}
        rawMaterial={rawMaterial}
        setRawMaterial={setRawMaterial}
      />
      
    </div>
  );
}
