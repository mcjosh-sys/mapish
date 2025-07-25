import { createContext, useContext, useState, type ReactNode } from "react";

interface HeaderContext {
  header: string;
  setHeader: (title: string) => void;
}

const HeaderContext = createContext<HeaderContext>({
  header: "",
  setHeader: () => {},
});

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<string>("");

  return (
    <HeaderContext.Provider value={{ setHeader, header }}>
      {children}
    </HeaderContext.Provider>
  );
}
