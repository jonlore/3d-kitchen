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

  return (
    <div
      id="sidebar"
      style={{
        padding: 16,
        borderLeft: "1px solid #e5e7eb",
        overflow: "auto",
      }}
    >
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, lineHeight: 1.2, margin: 0 }}>
          Start design your dream kitchen!
        </h1>
      </header>

      {/* Color (affects doors, frame, etc. — not the countertop) */}
      <div id="color-options" style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 600, margin: "0 0 8px" }}>Color</p>
        <div
          id="colors"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          {colors.map((c) => {
            const selected = colorHex.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.name}
                onClick={() => setColorHex(c.hex)}
                title={`${c.name} (${c.hex})`}
                aria-label={`${c.name} (${c.hex})`}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: selected ? "2px solid #111" : "1px solid #d1d5db",
                  outline: "none",
                  background: c.hex,
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Raw materials (countertop only) */}
      <div id="raw-material-options" style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 600, margin: "0 0 8px" }}>
          Raw material (countertop)
        </p>
        <div
          id="raw-materials"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          {rawMaterials.map((m) => {
            const selected = rawMaterial === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setRawMaterial(m.key)}
                title={m.name}
                aria-label={m.name}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: selected ? "2px solid #111" : "1px solid #d1d5db",
                  outline: "none",
                  background: m.preview,
                  cursor: "pointer",
                }}
              />
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
    </div>
  );
}
