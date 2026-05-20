"use client";

import { useEffect } from "react";
import { useCursor } from "@/context/ui-context";

export function RocketCursor() {
  const { rocketActive } = useCursor();

  useEffect(() => {
    if (!rocketActive) return;

    const style = document.createElement("style");
    document.head.appendChild(style);

    let prevX = 0;
    let prevY = 0;
    let angle = 0;
    let raf = 0;

    function render() {
      const svg = encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text y='26' font-size='26' transform='rotate(${angle},16,13)'>🚀</text></svg>`,
      );
      style.textContent = `* { cursor: url("data:image/svg+xml,${svg}") 16 16, auto !important; }`;
    }

    function onMove(e: MouseEvent) {
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      if (Math.hypot(dx, dy) < 3) return;

      // +45° because the rocket emoji naturally points upper-right
      angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    }

    let hideTimeout = 0;

    render();
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      clearTimeout(hideTimeout);
      document.head.removeChild(style);
      document.body.style.cursor = "";
    };
  }, [rocketActive]);

  return null;
}
