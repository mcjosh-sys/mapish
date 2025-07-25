import { assignUserToBoundary } from "@/actions/boundary-action";
import type { BoundaryProperties } from "@/db/entities/boundary";
import type { UserProperties } from "@/db/entities/user";
import { useData } from "@/contexts/data-context";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAssignDialog } from "@/contexts/assign-dialog-context";
import { assignBoundaryToUser } from "@/actions/user-actions";

// type Data =
//   | {
//       type: "user-boundary";
//       boundary: BoundaryProperties;
//     }
//   | {
//       type: "boundary-user";
//       user: UserProperties;
//     };

// type Props = {
//   open: boolean;
//   setOpen: (open: boolean) => any;
//   data: Data;
// };

const AssignDialog = () => {
  const [selected, setSelected] = useState<
    UserProperties | BoundaryProperties | null
  >(null);
  const { boundaries, users, fetchBoundaries, fetchUsers } = useData();
  const { openAssign: open, setOpenAssign: setOpen, data } = useAssignDialog();

  if (!data || !open) {
    return null;
  }

  const handleValueChange = (id: string) => {
    switch (data.type) {
      case "boundary-user":
        const boundary = boundaries.find((b) => b.id === id) ?? null;
        setSelected(boundary);
        break;
      case "user-boundary":
        const user = users.find((b) => b.id === id) ?? null;
        setSelected(user);
        break;
      default:
        break;
    }
  };

  const handleAssign = () => {
    const fetch = () => {
      setOpen(false);
      fetchBoundaries();
      fetchUsers();
    };
    if (selected) {
      switch (data.type) {
        case "boundary-user":
          assignBoundaryToUser(data.user.id, selected.id).then(() => {
            toast(`Boundary has be assign to ${data.user.name}`);
            fetch();
          });
          break;
        case "user-boundary":
          assignUserToBoundary(selected.id, data.boundary.id).then(() => {
            toast(`User has be assign to ${data.boundary.name}`);
            fetch();
          });
          break;
        default:
          break;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {data.type === "user-boundary" ? "Assign User" : "Assign Boundary"}
          </DialogTitle>
          <DialogDescription>
            Assign {data.type === "user-boundary" ? "user" : "boundary"}
            &nbsp; to a &nbsp;
            {data.type === "user-boundary" ? "boundary" : "user"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label>
              Select &nbsp;
              {data.type === "user-boundary" ? "user" : "boundary"}
            </Label>
            <Select
              defaultValue={selected?.name}
              onValueChange={handleValueChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    data.type === "user-boundary" ? "user" : "boundary"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {(data.type === "boundary-user" ? boundaries : users).map(
                  (item) => (
                    <SelectItem value={item.id} key={item.id}>
                      <span onClick={() => setSelected(item)}>{item.name}</span>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={!selected} onClick={handleAssign}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDialog;
