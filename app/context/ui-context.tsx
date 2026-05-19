"use client";

import { createContext, useContext, useState } from "react";

type UIContextType = {
  rocketActive: boolean;
  toggleRocket: () => void;
  soundActive: boolean;
  toggleSound: () => void;
  splashDismissed: boolean;
  dismissSplash: (withSound: boolean) => void;
};

const UIContext = createContext<UIContextType>({
  rocketActive: false,
  toggleRocket: () => {},
  soundActive: false,
  toggleSound: () => {},
  splashDismissed: false,
  dismissSplash: () => {},
});

type UIProviderProps = {
  children: React.ReactNode;
  initialSplashDismissed: boolean;
  initialSoundActive: boolean;
};

export function UIProvider({ children, initialSplashDismissed, initialSoundActive }: UIProviderProps) {
  const [rocketActive, setRocketActive] = useState(false);
  const [soundActive, setSoundActive] = useState(initialSoundActive);
  const [splashDismissed, setSplashDismissed] = useState(initialSplashDismissed);

  function toggleRocket() {
    setRocketActive((prev) => !prev);
  }

  function toggleSound() {
    setSoundActive((prev) => !prev);
  }

  function dismissSplash(withSound: boolean) {
    setSoundActive(withSound);
    setSplashDismissed(true);
    document.cookie = "splashDismissed=true; path=/; samesite=strict";
    document.cookie = `splashSound=${withSound}; path=/; samesite=strict`;
  }

  return (
    <UIContext.Provider
      value={{ rocketActive, toggleRocket, soundActive, toggleSound, splashDismissed, dismissSplash }}
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

export function useSplash() {
  const { splashDismissed, dismissSplash } = useContext(UIContext);
  return { splashDismissed, dismissSplash };
}
