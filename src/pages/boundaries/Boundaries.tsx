import { DataTable } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/data-context";
import { useHeader } from "@/contexts/header-context";
import { usePageTitle } from "@/contexts/page-title-context";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { boundaryColumns } from "./boundary-column";
import { useNavigate } from "react-router-dom";

const Boundaries = () => {
  const { setHeader } = useHeader();
  const { setPageTitle } = usePageTitle();
  const { boundaries } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Mapish | Boundaries");
    setHeader("Boundaries");
  }, []);
  return (
    <div className="max-w-5xl mx-auto w-full h-full p-4 mt-6 space-y-4">
      <PageHeader
        title="Boundaries"
        description="Manage the list of boundaries"
      />
      <Button
        className="flex items-center gap-1 ml-auto"
        onClick={() => navigate("create")}
      >
        <IconPlus />
        Add Boundary
      </Button>
      {boundaries.length ? (
        <DataTable columns={boundaryColumns} data={boundaries}></DataTable>
      ) : (
        <div className="flex items-center justify-center italic text-muted-foreground h-44 my-auto">
          No boundary has been added yet. &nbsp;
          <span className="border-b border-transparent hover:border-sky-500 text-sky-500 cursor-default">
            Add a boundary.
          </span>
        </div>
      )}
    </div>
  );
};

export default Boundaries;
