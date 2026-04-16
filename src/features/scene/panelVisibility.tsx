import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PanelVisibilityValue {
  hidden: boolean;
  setHidden: (value: boolean) => void;
}

const PanelVisibilityContext = createContext<PanelVisibilityValue>({
  hidden: false,
  setHidden: () => {},
});

export function PanelVisibilityProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  return (
    <PanelVisibilityContext.Provider value={{ hidden, setHidden }}>
      {children}
    </PanelVisibilityContext.Provider>
  );
}

export function usePanelVisibility() {
  return useContext(PanelVisibilityContext);
}
