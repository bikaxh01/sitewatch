"use client";

import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const UserDetails = () => {
  const [user] = useUser();
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/logout-user`,
        {
          withCredentials: true,
        }
      );
      console.log("🚀 ~ handleLogout ~ res:", res);
      toast.success(res.data.message || "Logout successful");
      router.push("/auth/sign-in");
    } catch (error) {
      console.log("🚀 ~ handleLogout ~ error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div
      className=" row-span-5 h-full  grid grid-rows-12  "
      onClick={() => setIsHovered((prev) => !prev)}
    >
      <div className=" row-span-9"> </div>
      <div className="row-span-3  ">
        <div className=" bg-sidebar-accent hover:bg-sidebar-accent/75   w-full  rounded-md flex gap-4 p-2 ">
          <div className=" rounded-full   text-black bg-sidebar-foreground size-12 items-center justify-center flex ">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="hi there"
                className=" rounded-2xl"
              />
            ) : (
              user?.firstName?.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className=" flex flex-col w-[8rem]  ">
            <div className=" truncate">{user?.firstName} </div>
            <div className=" truncate">{user?.email} </div>
          </div>
        </div>
      </div>
      {isHovered && (
        <div className="flex items-center justify-center  mt-1     ">
          <div className=" flex flex-col border-4 w-full   rounded-md p-1">
            <button
              onClick={handleLogout}
              className="w-full p-1  rounded-md my-1 "
            >
              logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
