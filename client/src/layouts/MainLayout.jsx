import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <BottomNav />

    </>
  );
};

export default MainLayout;