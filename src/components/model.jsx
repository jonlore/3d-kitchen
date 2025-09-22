import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Sidebar from "./sidebar";
import { Trash2, RotateCcw } from "lucide-react";

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

function looksLikeHandle(name = "") {
  const n = normalizeName(name);

  return (
    n.includes("handtag") ||
    n.includes("handle") ||
    n.includes("knopp") ||
    n.includes("pull")
  );
}

function findMeshesByNames(scene, names) {
  const hits = [];
  names.forEach((name) => {
    const mesh = scene.getObjectByName(name);
    if (mesh && mesh.isMesh) hits.push(mesh);
  });
  return hits;
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
  // pine / cidar not present in .glb — placeholders will be used
};

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
  } else if (key === "marble") {
    mat.color = new THREE.Color("#e5e7eb");
    mat.roughness = 0.4;
    mat.metalness = 0.05;
    mat.name = "Placeholder_Marble";
  } else {
    mat.color = new THREE.Color("#cccccc");
    mat.name = `Placeholder_${key}`;
  }
  return mat;
}

function paintTargets(scene, color) {
  const targets = findMeshesByNames(scene, TARGET_PARTS);
  targets.forEach((mesh) => {
    const newMat = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.1,
      roughness: 0.6,
    });
    newMat.name = `Paint_${mesh.name}`;
    mesh.material = newMat;
    mesh.material.needsUpdate = true;
  });
}

function applyRawMaterialToMeshes(meshes, materials, friendlyKey) {
  if (!friendlyKey) return;
  const gltfName = FRIENDLY_TO_GLTF[friendlyKey] || null;

  let sourceMat =
    gltfName && materials?.[gltfName] ? materials[gltfName] : null;

  meshes.forEach((mesh) => {
    const matToApply = sourceMat
      ? sourceMat.clone()
      : placeholderMaterialFor(friendlyKey);
    if (!sourceMat) {
      if (matToApply.roughness !== undefined) matToApply.roughness = 0.6;
      if (matToApply.metalness !== undefined) matToApply.metalness = 0.05;
    }
    matToApply.name = sourceMat
      ? `Raw_${gltfName}_for_${mesh.name}`
      : `Raw_${friendlyKey}_placeholder_for_${mesh.name}`;
    mesh.material = matToApply;
    mesh.material.needsUpdate = true;
    mesh.needsUpdate = true;
  });
}

function applyRawMaterialDependingOnScope(
  scene,
  materials,
  friendlyKey,
  scope
) {
  if (!scene || !friendlyKey) return;
  if (scope === "colorTargets") {
    const targets = findMeshesByNames(scene, TARGET_PARTS);
    applyRawMaterialToMeshes(targets, materials, friendlyKey);
  } else if (scope === "surfaceOnly") {
    const countertops = findCountertopMeshes(scene);
    applyRawMaterialToMeshes(countertops, materials, friendlyKey);
  }
}

function KitchenModel({ colorHex, rawMaterial, applyScope, handlesVisible }) {
  const { scene, materials } = useGLTF(
    import.meta.env.BASE_URL + "/models/Kitchen.glb"
  );
  const handleMeshesRef = useRef([]);

  const color = useMemo(() => new THREE.Color(colorHex), [colorHex]);

  useEffect(() => {
    if (!scene) return;
    const out = [];
    scene.traverse((obj) => {
      if (obj.isMesh && obj.name && looksLikeHandle(obj.name)) {
        out.push(obj);
      }
    });
    handleMeshesRef.current = out;
  }, [scene]);

  // Show/hide handles
  useEffect(() => {
    handleMeshesRef.current.forEach((m) => {
      m.visible = !!handlesVisible;
      if (!m.material) {
        m.material = new THREE.MeshStandardMaterial({
          color: 0x333333,
          metalness: 0.6,
          roughness: 0.4,
        });
      }
    });
  }, [handlesVisible]);

  useEffect(() => {
    if (!scene || !color) return;
    if (applyScope === "colorTargets") {
      paintTargets(scene, color);
    }
  }, [scene, color, applyScope]);

  useEffect(() => {
    if (!scene) return;

    if (rawMaterial) {
      applyRawMaterialDependingOnScope(
        scene,
        materials,
        rawMaterial,
        applyScope
      );
    } else if (applyScope === "colorTargets") {
      paintTargets(scene, color);
    }
  }, [scene, materials, rawMaterial, applyScope, color]);

  useEffect(() => {
    if (applyScope !== "handleOnly" || !colorHex) return;

    handleMeshesRef.current.forEach((m) => {
      if (m.material && !m.userData.__clonedMaterial) {
        m.material = m.material.clone();
        m.userData.__clonedMaterial = true;
      }
      if (!(m.material instanceof THREE.MeshStandardMaterial)) {
        m.material = new THREE.MeshStandardMaterial({
          metalness: 0.6,
          roughness: 0.4,
        });
      }
      m.material.color.set(colorHex);
      m.material.needsUpdate = true;
    });
  }, [applyScope, colorHex]);

  return <primitive object={scene} />;
}

export default function Model() {
  const [colorHex, setColorHex] = useState("#6BAA75");
  const [rawMaterial, setRawMaterial] = useState(null);
  const [applyScope, setApplyScope] = useState("colorTargets");
  const [handlesVisible, setHandlesVisible] = useState(true); // NEW

  return (
    <div id="configurator-model">
      <div id="model-options">
        <button className="restart" onClick={() => alert("go back")}>
          <RotateCcw size={16} />
        </button>

        <button className="restart" onClick={() => alert("restart")}>
          <Trash2 size={16} />
        </button>
      </div>

      <Canvas camera={{ position: [2, 8, 10], fov: 70 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 8, 6]} intensity={1} />
        <KitchenModel
          colorHex={colorHex}
          rawMaterial={rawMaterial}
          applyScope={applyScope}
          handlesVisible={handlesVisible}
        />
        <OrbitControls enableDamping />
      </Canvas>

      <Sidebar
        colorHex={colorHex}
        setColorHex={setColorHex}
        rawMaterial={rawMaterial}
        setRawMaterial={setRawMaterial}
        setApplyScope={setApplyScope}
        handlesVisible={handlesVisible}
        setHandlesVisible={setHandlesVisible}
      />
    </div>
  );
}
