import { useState } from "react";
import { ArrowRight, ArrowLeft } from 'lucide-react';

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

  const rawMaterials = [
    {
      name: "Marble.001",
      key: "Marble.001",
      preview:
        "repeating-linear-gradient(45deg, #e5e7eb, #e5e7eb 6px, #d1d5db 6px, #d1d5db 12px)",
    },
    {
      name: "Ash Wood",
      key: "Ash Wood",
      preview: "#693b36",
    },
  ];

  const views = ["viewLucka", "viewBankskiva", "viewHandtag", "viewFinal"]
  const [currentViewIndex, setCurrentViewIndex] = useState(0)
  const currentView = views[currentViewIndex];

  return (
    <div id="sidebar">
      <header>
        <h1>
          Start design your dream kitchen!
        </h1>
      </header>

      {currentView == "viewLucka" && (
        <>
        <div className="options-container" id="color-options">
          <p className="option-title">Color</p>
          <div id="colors">
            {colors.map((c) => {
              const selected = colorHex.toLowerCase() === c.hex.toLowerCase();
              return (
                <div>
                  <button
                    key={c.name}
                    onClick={() => setColorHex(c.hex)}
                    title={`${c.name} (${c.hex})`}
                    aria-label={`${c.name} (${c.hex})`}
                    className="circle-option"
                    style={{
                      border: selected ? "2px solid #111" : "1px solid #d1d5db",
                      background: c.hex,
                    }} />
                  <span>{c.name}</span>
                </div>
              );
            })}
          </div>
        </div><div className="options-container" id="raw-material-options">
            <p className="option-title">
              Raw material
            </p>
            <div id="materials">
              {rawMaterials.map((m) => {
                const selected = rawMaterial === m.key;
                return (
                  <div>
                    <button
                      key={m.key}
                      onClick={() => setRawMaterial(m.key)}
                      title={m.name}
                      aria-label={m.name}
                      className="circle-option"
                      style={{
                        border: selected ? "2px solid #111" : "1px solid #d1d5db",
                        outline: "none",
                        background: m.preview,
                      }} />
                    <span>{m.name}</span>
                  </div>
                );
              })}

              {/* Reset */}
              <button
                onClick={() => setRawMaterial(null)}
                title="Reset countertop material"
                aria-label="Reset countertop material"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: !rawMaterial ? "2px solid #111" : "1px solid #d1d5db",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                ⨯
              </button>
            </div>
          </div>
          </>
      )}
      
      {currentView == "viewBankskiva" && (
        <>
          <div className="options-container" id="color-options">
            <p className="option-title">Surface</p>
            <div id="colors">
              {colors.map((c) => {
                const selected = colorHex.toLowerCase() === c.hex.toLowerCase();
                return (
                  <div>
                    <button
                      key={c.name}
                      onClick={() => setColorHex(c.hex)}
                      title={`${c.name} (${c.hex})`}
                      aria-label={`${c.name} (${c.hex})`}
                      className="circle-option"
                      style={{
                        border: selected ? "2px solid #111" : "1px solid #d1d5db",
                        background: c.hex,
                      }} />
                    <span>{c.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {currentView == "viewHandtag" && (
        <>
          <div className="options-container" id="color-options">
            <p className="option-title">Handle</p>
            <div id="colors">
              {colors.map((c) => {
                const selected = colorHex.toLowerCase() === c.hex.toLowerCase();
                return (
                  <div>
                    <button
                      key={c.name}
                      onClick={() => setColorHex(c.hex)}
                      title={`${c.name} (${c.hex})`}
                      aria-label={`${c.name} (${c.hex})`}
                      className="circle-option"
                      style={{
                        border: selected ? "2px solid #111" : "1px solid #d1d5db",
                        background: c.hex,
                      }} />
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
