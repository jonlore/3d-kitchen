import { useState, useMemo } from "react";

export default function Sidebar({
  colorHex,
  setColorHex,
  rawMaterial,
  setRawMaterial,
}) {
  const colors = [
    { name: "Green", hex: "#6BAA75" },
    { name: "Beige", hex: "#D9C7A1" },
    { name: "Yellow", hex: "#E6C94C" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#111111" },
  ];

  // Enkla CSS-previews för placeholders (trä/sten-känsla)
  const PREVIEWS = {
    // wood-ish
    mahogny:
      "repeating-linear-gradient(45deg,#5a2a1f,#5a2a1f 6px,#6f3a2b 6px,#6f3a2b 12px)",
    pine: "repeating-linear-gradient(45deg,#e9d7b8,#e9d7b8 8px,#d7c19e 8px,#d7c19e 16px)",
    cidar:
      "repeating-linear-gradient(45deg,#c9a87a,#c9a87a 8px,#b99366 8px,#b99366 16px)",
    // stone-ish
    stone:
      "repeating-linear-gradient(45deg,#cfcfcf,#cfcfcf 6px,#bdbdbd 6px,#bdbdbd 12px)",
  };

  // Riktiga material som finns i GLB (vänlig nyckel -> glTF-materialnamn)
  // I filen: Marble.001 (Bänkskiva), Ash Wood (Ö). "Stone"/"Mahogny"/"Pine"/"Cidar" saknas.
  const FRIENDLY_TO_GLTF = {
    marble: "Marble.001",
    // mahogny: null,
    // pine: null,
    // cidar: null,
    // stone: null,
  };

  const rawMaterialsByView = {
    viewStart: [
      { label: "Cidar", key: "cidar", preview: PREVIEWS.cidar, gltf: null },
      {
        label: "Mahogny",
        key: "mahogny",
        preview: PREVIEWS.mahogny,
        gltf: "WoodFlooringMahoganyAfricanSanded001_COL_3K",
      },
      { label: "Pine", key: "pine", preview: PREVIEWS.pine, gltf: null },
    ],
    viewSurface: [
      { label: "Cidar", key: "cidar", preview: PREVIEWS.cidar, gltf: null },
      {
        label: "Marble",
        key: "marble",
        preview: "#e5e7eb",
        gltf: "Marble.001",
      },
      {
        label: "Stone",
        key: "stone",
        preview: PREVIEWS.stone,
        gltf: "StoneMarbleCalacatta004_COL_3K",
      },
    ],
  };

  const views = ["viewStart", "viewSurface", "viewHandle", "viewFinal"];
  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  const currentView = views[currentViewIndex];

  const currentRawList = useMemo(() => {
    if (currentView === "viewStart") return rawMaterialsByView.viewStart;
    if (currentView === "viewSurface") return rawMaterialsByView.viewSurface;
    return [];
  }, [currentView]);

  return (
    <div id="sidebar">
      <header>
        <h1>Start design your dream kitchen!</h1>
      </header>

      {currentView === "viewStart" && (
        <>
          <div className="options-container" id="color-options">
            <p className="option-title">Painted</p>
            <div id="colors">
              {colors.map((c) => {
                const selected = colorHex.toLowerCase() === c.hex.toLowerCase();
                return (
                  <div
                    key={c.name}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginRight: 10,
                    }}
                  >
                    <button
                      onClick={() => setColorHex(c.hex)}
                      title={`${c.name} (${c.hex})`}
                      aria-label={`${c.name} (${c.hex})`}
                      className="circle-option"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: selected
                          ? "2px solid #111"
                          : "1px solid #d1d5db",
                        background: c.hex,
                        cursor: "pointer",
                      }}
                    />
                    <span>{c.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="options-container" id="raw-material-options">
            <p className="option-title">Raw Material</p>
            <div
              id="materials"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              {currentRawList.map((m) => {
                const selected = rawMaterial === m.key;
                return (
                  <div
                    key={m.key}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <button
                      onClick={() => setRawMaterial(m.key)}
                      title={m.label}
                      aria-label={m.label}
                      className="circle-option"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: selected
                          ? "2px solid #111"
                          : "1px solid #d1d5db",
                        outline: "none",
                        background: m.preview,
                        cursor: "pointer",
                      }}
                    />
                    <span>{m.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {currentView === "viewSurface" && (
        <>
          <div className="options-container" id="surface-raw-materials">
            <p className="option-title">Material</p>
            <div
              id="materials"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              {currentRawList.map((m) => {
                const selected = rawMaterial === m.key;
                return (
                  <div
                    key={m.key}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <button
                      onClick={() => setRawMaterial(m.key)}
                      title={m.label}
                      aria-label={m.label}
                      className="circle-option"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: selected
                          ? "2px solid #111"
                          : "1px solid #d1d5db",
                        outline: "none",
                        background: m.preview,
                        cursor: "pointer",
                      }}
                    />
                    <span>{m.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {currentView === "viewHandle" && (
        <>
          <div className="options-container" id="color-options">
            <p className="option-title">Handle</p>
            <div id="colors">
              {colors.map((c) => {
                const selected = colorHex.toLowerCase() === c.hex.toLowerCase();
                return (
                  <div
                    key={c.name}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginRight: 10,
                    }}
                  >
                    <button
                      onClick={() => setColorHex(c.hex)}
                      title={`${c.name} (${c.hex})`}
                      aria-label={`${c.name} (${c.hex})`}
                      className="circle-option"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: selected
                          ? "2px solid #111"
                          : "1px solid #d1d5db",
                        background: c.hex,
                        cursor: "pointer",
                      }}
                    />
                    <span>{c.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div
        className="navigation-buttons"
        style={{ display: "flex", gap: 8, marginTop: 16 }}
      >
        <button
          onClick={() => setCurrentViewIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentViewIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentViewIndex((prev) => Math.min(prev + 1, views.length - 1))
          }
          disabled={currentViewIndex === views.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
