import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface PageTitleContext {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContext>({
  pageTitle: "",
  setPageTitle: () => {},
});

export const usePageTitle = () => {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }

  return context;
};

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState<string>("Mapish");

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <PageTitleContext.Provider value={{ setPageTitle, pageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}
