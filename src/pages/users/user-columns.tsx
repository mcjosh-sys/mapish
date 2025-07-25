import { deleteUser } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAssignDialog } from "@/contexts/assign-dialog-context";
import { useData } from "@/contexts/data-context";
import type { UserProperties } from "@/db/entities/user";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export const userColumns: ColumnDef<UserProperties>[] = [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "boundry_ids",
    header: "Assigned Boundaries",
    cell: ({ row }) => {
      return (row.getValue("boundry_ids") as number[]).length;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const { fetchUsers } = useData();
      const { setData, setOpenAssign } = useAssignDialog();

      const handleDelete = () => {
        deleteUser(user.id).then(() => {
          toast("User has been removed");
          fetchUsers();
        });
      };

      const handleAssign = () => {
        setData({ type: "boundary-user", user });
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
                navigator.clipboard.writeText(user.id);
                toast("Id copied");
              }}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem onClick={handleAssign}>
              Assign to boundary
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
