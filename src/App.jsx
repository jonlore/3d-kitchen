import { useState } from "react";
import Sidebar from "./components/sidebar";
import Model from "./components/model";
import "./App.css";

export default function App() {
  const [colorHex, setColorHex] = useState("#6BAA75"); // startfärg

  return (
    <main
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px", // modell till vänster, sidebar till höger
        height: "100vh",
      }}
    >
      <Model colorHex={colorHex} />
      <Sidebar colorHex={colorHex} setColorHex={setColorHex} />
    </main>
  );
}
