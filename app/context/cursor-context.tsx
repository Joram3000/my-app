"use client";

import { createContext, useContext, useState } from "react";

type CursorContextType = {
  rocketActive: boolean;
  toggleRocket: () => void;
};

const CursorContext = createContext<CursorContextType>({
  rocketActive: false,
  toggleRocket: () => {},
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [rocketActive, setRocketActive] = useState(false);

  function toggleRocket() {
    setRocketActive((prev) => !prev);
  }

  return (
    <CursorContext.Provider value={{ rocketActive, toggleRocket }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
