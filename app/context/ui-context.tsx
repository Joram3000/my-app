"use client";

import { createContext, useContext, useEffect, useState } from "react";

type UIContextType = {
  rocketActive: boolean;
  toggleRocket: () => void;
  soundActive: boolean;
  toggleSound: () => void;
  splashDismissed: boolean | null;
  dismissSplash: (withSound: boolean) => void;
};

const UIContext = createContext<UIContextType>({
  rocketActive: false,
  toggleRocket: () => {},
  soundActive: false,
  toggleSound: () => {},
  splashDismissed: null,
  dismissSplash: () => {},
});

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [rocketActive, setRocketActive] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [splashDismissed, setSplashDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    setSplashDismissed(localStorage.getItem("splashDismissed") === "true");
    setSoundActive(localStorage.getItem("soundActive") === "true");
  }, []);

  function toggleRocket() {
    setRocketActive((prev) => !prev);
  }

  function toggleSound() {
    setSoundActive((prev) => {
      localStorage.setItem("soundActive", String(!prev));
      return !prev;
    });
  }

  function dismissSplash(withSound: boolean) {
    localStorage.setItem("splashDismissed", "true");
    localStorage.setItem("soundActive", String(withSound));
    setSplashDismissed(true);
    setSoundActive(withSound);
  }

  return (
    <UIContext.Provider
      value={{
        rocketActive,
        toggleRocket,
        soundActive,
        toggleSound,
        splashDismissed,
        dismissSplash,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useSplash() {
  const { splashDismissed, dismissSplash } = useContext(UIContext);
  return { splashDismissed, dismissSplash };
}

export function useCursor() {
  const { rocketActive, toggleRocket } = useContext(UIContext);
  return { rocketActive, toggleRocket };
}

export function useSound() {
  const { soundActive, toggleSound } = useContext(UIContext);
  return { soundActive, toggleSound };
}
