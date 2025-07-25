import { DataTable } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/data-context";
import { useHeader } from "@/contexts/header-context";
import { usePageTitle } from "@/contexts/page-title-context";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { userColumns } from "./user-columns";

const Users = () => {
  const { setHeader } = useHeader();
  const { setPageTitle } = usePageTitle();
  const { users } = useData();

  useEffect(() => {
    setPageTitle("Mapish | Users");
    setHeader("Users");
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full h-full p-4 mt-6 space-y-4">
      <PageHeader title="Users" description="Manage the list of users" />
      <Button className="flex items-center gap-1 ml-auto">
        <IconPlus />
        Add User
      </Button>
      {users.length ? (
        <DataTable columns={userColumns} data={users}></DataTable>
      ) : (
        <div className="flex items-center justify-center italic text-muted-foreground h-44 my-auto">
          No user has been added yet. &nbsp;
          <span className="border-b border-transparent hover:border-sky-500 text-sky-500 cursor-default">
            Add a new User.
          </span>
        </div>
      )}
    </div>
  );
};

export default Users;
