import React from "react";
import { Outlet } from "react-router-dom";
import Login from "./components/Auth/Login";
import Homepage from "./components/Home/Home";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Layout;
