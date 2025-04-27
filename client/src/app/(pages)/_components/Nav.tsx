// import { Mountain } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";

const NavComponent = () => {
  return (
    <div className="flex items-center justify-between fixed top-0  right-0 left-0 z-20   backdrop-filter backdrop-blur-sm bg-opacity-40   max-w-7xl mx-auto">
      <div className="flex  items-center  justify-between gap-4 py-4  text-md">
        <a href="/" className="text-lg font-bold">
          Sitewatch.
        </a>
        <div className="text-sm ">
          <ul className="flex gap-4">
            <li className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
              Platform <ChevronDown size={13} />
            </li>
            <li className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
              Community <ChevronDown size={13} />
            </li>
            <li className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
              Company <ChevronDown size={13} />
            </li>
          </ul>
        </div>
      </div>
      <div className=" gap-2 flex">
        <Link href="/auth/sign-in">
          <Button variant={"outline"}> Sign-in</Button>
        </Link>
        <Link href={"/auth/sign-up"}>
          <Button> Sign-up</Button>
        </Link>
      </div>
    </div>
  );
};

export default NavComponent;
