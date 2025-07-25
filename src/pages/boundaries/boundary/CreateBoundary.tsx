import DrawingMap from "@/components/DrawingMap";
import { useHeader } from "@/contexts/header-context";
import { usePageTitle } from "@/contexts/page-title-context";
import { useEffect } from "react";

const CreateBoundary = () => {
  const { setPageTitle } = usePageTitle();
  const { setHeader } = useHeader();
  useEffect(() => {
    setPageTitle("Mapish | Create Boundary");
    setHeader("Create Boundary");
  }, []);
  return <DrawingMap />;
};

export default CreateBoundary;
