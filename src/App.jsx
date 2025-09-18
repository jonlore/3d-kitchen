import { useState } from "react";
import Sidebar from "./components/sidebar";
import Model from "./components/model";
import "./App.css";

export default function App() {
  const [colorHex, setColorHex] = useState("#6BAA75"); // startfärg
  const [rawMaterial, setRawMaterial] = useState(null); // "Marble.001" | "Color.004" | null

  return (
    <main
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        height: "100vh",
      }}
    >
      <Model colorHex={colorHex} rawMaterial={rawMaterial} />
      <Sidebar
        colorHex={colorHex}
        setColorHex={setColorHex}
        rawMaterial={rawMaterial}
        setRawMaterial={setRawMaterial}
      />
    </main>
  );
}
