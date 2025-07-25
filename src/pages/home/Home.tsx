import DrawingMap from "@/components/DrawingMap";
import { useHeader } from "@/contexts/header-context";
import { usePageTitle } from "@/contexts/page-title-context";
import { useEffect } from "react";

const Home = () => {
  const { setPageTitle } = usePageTitle();
  const { setHeader } = useHeader();

  useEffect(() => {
    setPageTitle("Mapish | Home");
    setHeader("Dashboard");
  }, [setPageTitle, setHeader]);

  return (
    <>
      <DrawingMap readonly />
    </>
  );
};

export default Home;
