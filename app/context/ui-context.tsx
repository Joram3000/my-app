"use client";

import { createContext, useContext, useState } from "react";

type UIContextType = {
  rocketActive: boolean;
  toggleRocket: () => void;
  soundActive: boolean;
  toggleSound: () => void;
};

const UIContext = createContext<UIContextType>({
  rocketActive: false,
  toggleRocket: () => {},
  soundActive: false,
  toggleSound: () => {},
});

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [rocketActive, setRocketActive] = useState(false);
  const [soundActive, setSoundActive] = useState(false);

  function toggleRocket() {
    setRocketActive((prev) => !prev);
  }

  function toggleSound() {
    setSoundActive((prev) => !prev);
  }

  return (
    <UIContext.Provider
      value={{ rocketActive, toggleRocket, soundActive, toggleSound }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useCursor() {
  const { rocketActive, toggleRocket } = useContext(UIContext);
  return { rocketActive, toggleRocket };
}

export function useSound() {
  const { soundActive, toggleSound } = useContext(UIContext);
  return { soundActive, toggleSound };
}
