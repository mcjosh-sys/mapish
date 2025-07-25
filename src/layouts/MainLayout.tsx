import { AppSidebar } from "@/components/app-sidebar";
import AssignDialog from "@/components/AssignDialog";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AssignDialogProvider } from "@/contexts/assign-dialog-context";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <AssignDialogProvider>
              <Outlet />
              <AssignDialog />
            </AssignDialogProvider>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
