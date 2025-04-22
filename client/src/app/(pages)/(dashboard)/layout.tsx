import Sidebar from "@/components/global/Sidebar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className=" h-screen   grid grid-cols-12">
      <div className="col-span-2">
        <Sidebar />
      </div>
      <div className=" p-2 col-span-10 bg-sidebar ">
        <div className=" bg-[#202020] rounded-2xl p-2    h-[calc(100vh-1rem)]   overflow-auto ">
          {children}
        </div>
      </div>
    </div>
  );
}

export default layout;
