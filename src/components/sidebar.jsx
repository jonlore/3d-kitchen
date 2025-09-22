import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({
  colorHex,
  setColorHex,
  rawMaterial,
  setRawMaterial,
  setApplyScope,
}) {
  const colors = [
    { name: "Green", hex: "#6BAA75" },
    { name: "Beige", hex: "#D9C7A1" },
    { name: "Yellow", hex: "#E6C94C" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#111111" },
  ];

  // Simple CSS previews for placeholders
  const PREVIEWS = {
    mahogny:
      "repeating-linear-gradient(45deg,#5a2a1f,#5a2a1f 6px,#6f3a2b 6px,#6f3a2b 12px)",
    pine: "repeating-linear-gradient(45deg,#e9d7b8,#e9d7b8 8px,#d7c19e 8px,#d7c19e 16px)",
    cidar:
      "repeating-linear-gradient(45deg,#c9a87a,#c9a87a 8px,#b99366 8px,#b99366 16px)",
    stone:
      "repeating-linear-gradient(45deg,#cfcfcf,#cfcfcf 6px,#bdbdbd 6px,#bdbdbd 12px)",
  };

  const FRIENDLY_TO_GLTF = {
    marble: "Marble.001",
    mahogny: "WoodFlooringMahoganyAfricanSanded001_COL_3K",
    stone: "StoneMarbleCalacatta004_COL_3K",
    // cidar/pine are placeholders right now
  };

  const rawMaterialsByView = {
    viewStart: [
      { label: "Cidar", key: "cidar", preview: PREVIEWS.cidar, gltf: null },
      {
        label: "Mahogny",
        key: "mahogny",
        preview: PREVIEWS.mahogny,
        gltf: FRIENDLY_TO_GLTF.mahogny,
      },
      { label: "Pine", key: "pine", preview: PREVIEWS.pine, gltf: null },
    ],
    viewSurface: [
      { label: "Cidar", key: "cidar", preview: PREVIEWS.cidar, gltf: null },
      {
        label: "Marble",
        key: "marble",
        preview: "#e5e7eb",
        gltf: FRIENDLY_TO_GLTF.marble,
      },
      {
        label: "Stone",
        key: "stone",
        preview: PREVIEWS.stone,
        gltf: FRIENDLY_TO_GLTF.stone,
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

  // Handlers ----------------------------------------------------------
  function handlePickColor(hex) {
    setApplyScope?.("colorTargets");
    setColorHex(hex);
    setRawMaterial(null);
  }

  // Raw material selection
  function handlePickRawMaterial(item) {
    if (currentView === "viewStart") {
      setApplyScope?.("colorTargets");
    } else if (currentView === "viewSurface") {
      setApplyScope?.("surfaceOnly");
    }
    setRawMaterial(item.key);
    setColorHex("");
  }

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
                const selected =
                  colorHex?.toLowerCase() === c.hex.toLowerCase();
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
                      onClick={() => handlePickColor(c.hex)}
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
                      data-gltf={m.gltf || ""}
                      onClick={() => handlePickRawMaterial(m)}
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
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
              Tip: In this step, materials apply to the same parts as the paint
              (doors/frames/etc.).
            </p>
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
                      data-gltf={m.gltf || ""}
                      onClick={() => handlePickRawMaterial(m)}
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
                const selected =
                  colorHex?.toLowerCase() === c.hex.toLowerCase();
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
                      onClick={() => handlePickColor(c.hex)}
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

      {currentView == "viewFinal" && (
        <>
        <div className="options-container">
          <p className="option-title">Overview</p>
          <ul className="overviewList">
            <li>Color <span>Black</span></li>
            <li>Material <span>Pine</span></li>
            <li>Handle <span>Yellow</span></li>
          </ul>
        </div>
        </>
      )}

      <div className="sidebar-navigation">
        {currentViewIndex > 0 ? (
          <button
            className="prev-button"
            onClick={() => setCurrentViewIndex((prev) => Math.max(prev - 1, 0))}
          >
            <ArrowLeft size={16} />
            <span>Prev</span>
          </button>
        ) : (
          <div style={{ width: "80px" }} /> // Empty space to maintain layout
        )}

        <div className="view-progress">
          {currentViewIndex + 1} / {views.length}
        </div>

        <button
          className="next-button"
          onClick={() =>
            setCurrentViewIndex((prev) => Math.min(prev + 1, views.length - 1))
          }
          disabled={currentViewIndex === views.length - 1}
        >
          <span>Next</span>
          <ArrowRight size={16} />
        </button>
    </div>
    </div>
  );
}
