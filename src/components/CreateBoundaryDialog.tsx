import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type ChangeEvent } from "react";
import MaplibreDraw from "maplibre-gl-draw";
import { createBoundary } from "@/actions/boundary-action";
import { toast } from "sonner";
import { useData } from "@/contexts/data-context";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => any;
  draw: MaplibreDraw | null;
};

export function CreateBoundaryDialog({ open, setOpen, draw }: Props) {
  const [name, setName] = useState<string>("");
  const { fetchBoundaries } = useData();
  const navigate = useNavigate();

  if (!open) {
    return null;
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    if (draw) {
      const drawnFeature = draw.getAll().features?.[0];
      if (drawnFeature && name.length) {
        createBoundary({
          name,
          geometry: drawnFeature.geometry as any,
          properties: { name, type: drawnFeature.type },
        }).then(() => {
          toast("Boundary has been added.");
          fetchBoundaries();
          navigate("/boundaries");
        });
      }
    }
  };

  const handleCancel = () => {
    if (draw) {
      const drawnFeature = draw.getAll().features?.[0];
      if (drawnFeature && drawnFeature.id) {
        draw.delete(drawnFeature.id as string);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Boundary Details</DialogTitle>
          <DialogDescription>Enter boundary details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Enter Boundary Name</Label>
            <Input
              id="name-1"
              name="name"
              defaultValue="Pedro Duarte"
              onChange={handleNameChange}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={!name.length} onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
