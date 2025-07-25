import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import mainRoutes from "./routes";

const router = createBrowserRouter(mainRoutes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
