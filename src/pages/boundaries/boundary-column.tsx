import { deleteBoundary } from "@/actions/boundary-action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BoundaryProperties } from "@/db/entities/boundary";
import { useData } from "@/contexts/data-context";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useAssignDialog } from "@/contexts/assign-dialog-context";

export const boundaryColumns: ColumnDef<BoundaryProperties>[] = [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "user_ids",
    header: "Assigned Users",
    cell: ({ row }) => {
      return (row.getValue("user_ids") as number[]).length;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const boundary = row.original;
      const { fetchBoundaries } = useData();
      const { setData, setOpenAssign } = useAssignDialog();

      const handleDelete = () => {
        deleteBoundary(boundary.id).then(() => {
          toast("Boundary has been deleted");
          fetchBoundaries();
        });
      };

      const handleAssign = () => {
        setData({ type: "user-boundary", boundary });
        setOpenAssign(true);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(boundary.id);
                toast("Id copied");
              }}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem onClick={handleAssign}>
              Assign to user
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
