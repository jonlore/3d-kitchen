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

function KitchenModel({ cabinetColorHex, handleColorHex, cabinetMaterial, surfaceMaterial, applyScope, handlesVisible }) {
  const { scene, materials } = useGLTF(
    import.meta.env.BASE_URL + "/models/kitchen3d.glb"
  );
  const handleMeshesRef = useRef([]);

  const cabinetColor = useMemo(() => new THREE.Color(cabinetColorHex), [cabinetColorHex]);
  const handleColor = useMemo(() => new THREE.Color(handleColorHex), [handleColorHex]);

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
  if (!scene || !cabinetColor) return;
  if (applyScope === "colorTargets") {
    paintTargets(scene, cabinetColor);
  }
}, [scene, cabinetColor, applyScope]);


useEffect(() => {
  if (!scene) return;

  if (applyScope === "colorTargets" && cabinetMaterial) {
    applyRawMaterialDependingOnScope(
      scene,
      materials,
      cabinetMaterial,
      "colorTargets"
    );
  } else if (applyScope === "surfaceOnly" && surfaceMaterial) {
    applyRawMaterialDependingOnScope(
      scene,
      materials,
      surfaceMaterial,
      "surfaceOnly"
    );
  } else if (applyScope === "colorTargets") {
    paintTargets(scene, cabinetColor);
  }
}, [scene, materials, cabinetMaterial, surfaceMaterial, applyScope, cabinetColor]);




  useEffect(() => {
  if (applyScope !== "handleOnly" || !handleColorHex) return;

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
    m.material.color.set(handleColor);
    m.material.needsUpdate = true;
  });
  }, [applyScope, handleColorHex, handleColor]);


  return <primitive object={scene} />;
}


export default function Model() {
  const [colorHex, setColorHex] = useState("#6BAA75");
  //const [rawMaterial, setRawMaterial] = useState(null);

  const [cabinetMaterial, setCabinetMaterial] = useState(null);
  const [surfaceMaterial, setSurfaceMaterial] = useState(null);

  const [applyScope, setApplyScope] = useState("colorTargets");
  const [handlesVisible, setHandlesVisible] = useState(true); 

  const [cabinetColorHex, setCabinetColorHex] = useState("#6BAA75");
  const [handleColorHex, setHandleColorHex] = useState("#E6C94C"); // default handle color

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  return (
    <div id="configurator-model">
       {/* SVG positioned to overlap the sidebar */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        style={{
          position: "absolute",
          top: "60px",
          right: sidebarCollapsed ? "20px" : "530px",
          zIndex: 1000,
          cursor: "pointer",
          transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease, right 0.3s ease",
        }}
      >
        <rect width="40" height="40" rx="20" fill="white" />
        <path
          d="M20 36C23.1645 36 26.2579 35.0616 28.8891 33.3035C31.5203 31.5454 33.5711 29.0466 34.7821 26.1229C35.9931 23.1993 36.3099 19.9823 35.6926 16.8786C35.0752 13.7749 33.5513 10.9239 31.3137 8.6863C29.0761 6.44866 26.2251 4.92481 23.1214 4.30744C20.0177 3.69008 16.8007 4.00693 13.8771 5.21794C10.9534 6.42894 8.45459 8.4797 6.69648 11.1109C4.93838 13.7421 4 16.8355 4 20C4.00448 24.2421 5.69163 28.3091 8.69124 31.3088C11.6908 34.3084 15.7579 35.9955 20 36ZM20 6.46155C22.6777 6.46155 25.2952 7.25556 27.5216 8.74319C29.748 10.2308 31.4832 12.3452 32.5079 14.8191C33.5326 17.2929 33.8007 20.015 33.2783 22.6412C32.7559 25.2674 31.4665 27.6798 29.5731 29.5731C27.6797 31.4665 25.2674 32.7559 22.6412 33.2783C20.015 33.8007 17.2929 33.5326 14.8191 32.5079C12.3452 31.4832 10.2308 29.748 8.74318 27.5216C7.25555 25.2952 6.46154 22.6777 6.46154 20C6.46561 16.4106 7.89329 12.9694 10.4314 10.4314C12.9694 7.89329 16.4106 6.46562 20 6.46155ZM16.6677 25.2831L21.9523 20L16.6677 14.7169C16.5533 14.6026 16.4626 14.4668 16.4007 14.3174C16.3389 14.168 16.307 14.0079 16.307 13.8462C16.307 13.6844 16.3389 13.5243 16.4007 13.3749C16.4626 13.2255 16.5533 13.0897 16.6677 12.9754C16.782 12.861 16.9178 12.7703 17.0672 12.7084C17.2166 12.6466 17.3767 12.6147 17.5385 12.6147C17.7002 12.6147 17.8603 12.6466 18.0097 12.7084C18.1591 12.7703 18.2949 12.861 18.4092 12.9754L24.5631 19.1292C24.6775 19.2435 24.7683 19.3793 24.8302 19.5287C24.8922 19.6781 24.924 19.8383 24.924 20C24.924 20.1617 24.8922 20.3219 24.8302 20.4713C24.7683 20.6207 24.6775 20.7565 24.5631 20.8708L18.4092 27.0246C18.2949 27.139 18.1591 27.2297 18.0097 27.2916C17.8603 27.3534 17.7002 27.3853 17.5385 27.3853C17.3767 27.3853 17.2166 27.3534 17.0672 27.2916C16.9178 27.2297 16.782 27.139 16.6677 27.0246C16.5533 26.9103 16.4626 26.7745 16.4007 26.6251C16.3389 26.4757 16.307 26.3156 16.307 26.1538C16.307 25.9921 16.3389 25.832 16.4007 25.6826C16.4626 25.5332 16.5533 25.3974 16.6677 25.2831Z"
          fill="black"
        />
      </svg>

      <div id="model-options">
        <button className="restart" onClick={() => window.location.reload()}>
          <Trash2 size={16} />
        </button>
      </div>

      <Canvas camera={{ position: [0, 4, 9], fov: 70 }} style={{ background: '#d4e5fdff' }} >
        <ambientLight intensity={0.5} />
        <directionalLight position={[-16, 5, 16]} intensity={1.2} castShadow />
        <KitchenModel
          cabinetColorHex={cabinetColorHex}
          handleColorHex={handleColorHex}

          cabinetMaterial={cabinetMaterial}
          surfaceMaterial={surfaceMaterial}
          
          applyScope={applyScope}
          handlesVisible={handlesVisible}
        />
        <OrbitControls enableDamping />
      </Canvas>

      {!sidebarCollapsed && (
      <Sidebar
        cabinetColorHex={cabinetColorHex}
        setCabinetColorHex={setCabinetColorHex}
        handleColorHex={handleColorHex}
        setHandleColorHex={setHandleColorHex}

        cabinetMaterial={cabinetMaterial}
        setCabinetMaterial={setCabinetMaterial}
        surfaceMaterial={surfaceMaterial}
        setSurfaceMaterial={setSurfaceMaterial}
  
        setApplyScope={setApplyScope}
        handlesVisible={handlesVisible}
        setHandlesVisible={setHandlesVisible}
      />
      )}
    </div>
  );
}