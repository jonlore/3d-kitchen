import { useEffect, useMemo, useRef } from "react";
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
    (n.includes("o_") && (n.includes("bank") || n.includes("bansk")))
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
    if (o.isMesh && isCountertopLike(o.name)) hits.push(o);
  });
  return hits;
}

const FRIENDLY_TO_GLTF = {
  marble: "Marble.001",
  mahogny: "WoodFlooringMahoganyAfricanSanded001_COL_3K",
  stone: "StoneMarbleCalacatta004_COL_3K",
  // pine och cidar finns inte i .glb, kör placeholders
};

// Placeholder-material (enkla “lookalikes” tills riktiga texturer finns)
function placeholderMaterialFor(key) {
  const mat = new THREE.MeshStandardMaterial({
    metalness: 0.05,
    roughness: 0.6,
  });
  if (key === "mahogny") {
    mat.color = new THREE.Color("#6b3a2b");
    mat.name = "Placeholder_Mahogny";
  } else if (key === "pine") {
    mat.color = new THREE.Color("#e7d2aa");
    mat.name = "Placeholder_Pine";
  } else if (key === "cidar" /*cedar*/) {
    mat.color = new THREE.Color("#b88a58");
    mat.name = "Placeholder_Cedar";
  } else if (key === "stone") {
    mat.color = new THREE.Color("#c8c8c8");
    mat.roughness = 0.9;
    mat.metalness = 0.0;
    mat.name = "Placeholder_Stone";
  } else {
    mat.color = new THREE.Color("#cccccc");
    mat.name = `Placeholder_${key}`;
  }
  return mat;
}

function applyRawMaterialToCountertops(scene, materials, friendlyKey) {
  if (!friendlyKey) return;

  const gltfName = FRIENDLY_TO_GLTF[friendlyKey] || null;

  let srcMaterial = null;
  if (gltfName && materials?.[gltfName]) {
    srcMaterial = materials[gltfName];
  }

  const targets = findCountertopMeshes(scene);
  if (targets.length === 0) {
    console.warn("[kitchen] No countertop meshes found by name.");
  }

  targets.forEach((mesh) => {
    const matToApply = srcMaterial
      ? srcMaterial.clone()
      : placeholderMaterialFor(friendlyKey);
    if (matToApply.roughness !== undefined && !srcMaterial)
      matToApply.roughness = 0.6;
    if (matToApply.metalness !== undefined && !srcMaterial)
      matToApply.metalness = 0.05;

    matToApply.name = srcMaterial
      ? `Raw_${gltfName}_for_${mesh.name}`
      : `Raw_${friendlyKey}_placeholder_for_${mesh.name}`;

    mesh.material = matToApply;
    mesh.material.needsUpdate = true;
    mesh.needsUpdate = true;
  });

  if (gltfName) {
    scene.traverse((o) => {
      if (
        o.isMesh &&
        o.material?.name?.toLowerCase() === gltfName.toLowerCase()
      ) {
        o.material = o.material.clone();
        o.material.needsUpdate = true;
      }
    });
  }

  console.log(
    `[kitchen] Applied raw material "${friendlyKey}" (${
      gltfName || "placeholder"
    }) to:`,
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
  const [colorHex, setColorHex] = useState("#6BAA75");
  const [rawMaterial, setRawMaterial] = useState(null);

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
