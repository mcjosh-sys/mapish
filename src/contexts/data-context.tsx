import { getAllBoundaries } from "@/actions/boundary-action";
import { getUsers } from "@/actions/user-actions";
import type { BoundaryProperties } from "@/db/entities/boundary";
import type { UserProperties } from "@/db/entities/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface DataContext {
  boundaries: BoundaryProperties[];
  users: UserProperties[];
  fetchUsers: () => void;
  fetchBoundaries: () => void;
}

const DataContext = createContext<DataContext>({
  boundaries: [],
  users: [],
  fetchBoundaries: () => {},
  fetchUsers: () => {},
});

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [boundaries, setBoundaries] = useState<BoundaryProperties[]>([]);
  const [users, setUsers] = useState<UserProperties[]>([]);

  const fetchUsers = () => {
    getUsers().then(setUsers);
  };

  const fetchBoundaries = () => {
    getAllBoundaries().then(setBoundaries);
  };

  useEffect(() => {
    fetchBoundaries();
    fetchUsers();
  }, []);

  return (
    <DataContext.Provider
      value={{ boundaries, users, fetchBoundaries, fetchUsers }}
    >
      {children}
    </DataContext.Provider>
  );
}
