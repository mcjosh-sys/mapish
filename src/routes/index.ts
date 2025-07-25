import type { RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/home/Home";
import React from "react";
import Users from "@/pages/users/Users";
import User from "@/pages/users/user/User";
import Boundaries from "@/pages/boundaries/Boundaries";
import Boundary from "@/pages/boundaries/boundary/Boundary";
import CreateBoundary from "@/pages/boundaries/boundary/CreateBoundary";

const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: React.createElement(MainLayout),
    children: [
      {
        index: true,
        element: React.createElement(Home),
      },
      {
        path: "users",
        element: React.createElement(Users),
      },
      {
        path: "users/:userId",
        element: React.createElement(User),
      },
      {
        path: "boundaries",
        element: React.createElement(Boundaries),
      },
      {
        path: "boundaries/create",
        element: React.createElement(CreateBoundary),
      },
      {
        path: "boundaries/:boundaryId",
        element: React.createElement(Boundary),
      },
    ],
  },
];

export default mainRoutes;
