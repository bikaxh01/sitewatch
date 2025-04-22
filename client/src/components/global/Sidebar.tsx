import { useUser } from "@/hooks/useUser";
import { Globe, icons, Settings, ShieldAlert } from "lucide-react";
import Link from "next/link";
import React from "react";
import UserDetails from "./userDetails";

const sidebarLinks = [
  {
    title: "Monitors",
    href: "/monitors",
    icon: Globe,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Incidents",
    href: "/incidents",
    icon: ShieldAlert,
  },
];

function Sidebar() {

  return (
    <div className="  h-full grid grid-rows-12      bg-sidebar  p-4  ">
      <div className=" row-span-1   flex items-start  ">
        <span className="text-secondary-foreground text-1xl  font-semibold">
          Site watch.
        </span>
      </div>
      <div className=" row-span-6 flex flex-col gap-2  ">
        {sidebarLinks.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className=" h-8    px-3 rounded-md hover:bg-sidebar-accent flex gap-2 items-center "
          >
            <item.icon className=" size-4" />
            <span className=" text-sm">{item.title}</span>
          </Link>
        ))}
      </div>
      <UserDetails  />
    </div>
  );
}

export default Sidebar;
