export default function Sidebar({ colorHex, setColorHex }) {
  const colors = [
    { name: "Green", hex: "#6BAA75" },
    { name: "Beige", hex: "#D9C7A1" },
    { name: "Yellow", hex: "#E6C94C" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#111111" },
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

      {/* Färgval – byter färg på ALLA valda delar samtidigt */}
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
    </div>
  );
}
