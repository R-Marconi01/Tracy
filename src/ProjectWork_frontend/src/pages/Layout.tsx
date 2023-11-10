import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className=" bg-slate-200 ">
      <div className="mx-10 md:mx-[100px] bg-slate-400 text-white">
        <Navbar />
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
