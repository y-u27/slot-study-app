"use client";

import { useEffect, useState } from "react";

const LIGHT_COLORS = [
  "#ff5252",
  "#ffd740",
  "#69f0ae",
  "#40c4ff",
  "#ffd740",
  "#ff5252",
  "#69f0ae",
];

interface CabinetLightsProps {
  active: boolean;
}

export function CabinetLights({ active }: CabinetLightsProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setFrame((f) => f + 1), 140);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="flex justify-center gap-2 mb-2">
      {LIGHT_COLORS.map((color, i) => {
        const on = !active || frame % 2 === i % 2;
        return (
          <div
            key={i}
            className="rounded-full transition-all duration-100"
            style={{
              width: 10,
              height: 10,
              background: color,
              opacity: on ? 1 : 0.25,
              boxShadow: on ? `0 0 6px ${color}, 0 0 14px ${color}` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
