import type { BoundaryProperties } from "@/db/entities/boundary";
import type { UserProperties } from "@/db/entities/user";
import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type Data =
  | {
      type: "user-boundary";
      boundary: BoundaryProperties;
    }
  | {
      type: "boundary-user";
      user: UserProperties;
    };

interface AssignDialogContext {
  openAssign: boolean;
  setOpenAssign: (open: boolean) => any;
  setData: (data: Data | null) => any;
  data: Data | null;
}

const AssignDialogContext = createContext<AssignDialogContext>({
  openAssign: false,
  setOpenAssign: () => {},
  data: null,
  setData: () => {},
});

export const useAssignDialog = () => {
  const context = useContext(AssignDialogContext);
  if (!context) {
    throw new Error(
      "useAssignDialog must be used within a AssignDialogContext"
    );
  }

  return context;
};

export function AssignDialogProvider({ children }: PropsWithChildren) {
  const [openAssign, setOpenAssign] = useState<boolean>(false);
  const [assignData, setAssignData] = useState<Data | null>(null);

  return (
    <AssignDialogContext.Provider
      value={{
        openAssign,
        setOpenAssign,
        data: assignData,
        setData: setAssignData,
      }}
    >
      {children}
    </AssignDialogContext.Provider>
  );
}
