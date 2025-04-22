"use client";

import React, { Dispatch, SetStateAction } from "react";
import DownAnimation from "@/../public/Down_animation.json";
import PendingAnimation from "@/../public/Pending_animation.json";
import UpAnimation from "@/../public/Up_animation.json";
import Up_animation from "@/../public/Up_animation.json";
import Lottie from "lottie-react";
import {
  BellRing,
  CirclePause,
  Settings,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Monitor } from "../../../monitors/_components/MonitorsTable";
import Link from "next/link";

interface HeaderCardProp {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  monitor: Monitor;
  loading: boolean;
  status: "UP" | "DOWN" | "PENDING";
}

function HeaderCard({ open, setOpen, monitor }: HeaderCardProp) {
  const handleEditDialog = () => {
    setOpen(true);
  };

  return (
    <div className=" border h-full  flex items-center justify-between w-full  px-4  py-8  rounded-md bg-card  border-sidebar-accent">
      <div className="  h-full flex items-center gap-2x">
        <Lottie
          animationData={
            monitor.status === "UP"
              ? UpAnimation
              : monitor.status == "DOWN"
                ? DownAnimation
                : PendingAnimation
          }
          loop={true}
          className=" size-14"
        />
        <div className=" flex flex-col ">
          <div className=" text-2xl font-semibold flex gap-2 ">
            <span>{monitor.monitorName || "example.com"}</span>

            <Link
              href={monitor.url || "https://example.com"}
              className="  py-2  text-muted-foreground hover:text-white"
            >
              <SquareArrowOutUpRight className=" size-3" />
            </Link>
          </div>

          <div className=" flex gap-1 w-full  text-muted-foreground ">
            <span className=" text-xs  ">HTTP/S monitor for:</span>
            <span className=" text-xs  max-w-48  truncate  ">
              {monitor.url || "https://example.com"}
            </span>
          </div>
        </div>
      </div>
      <div className="  h-full  flex items-center  gap-4">
        <Button disabled className=" text-secondary-foreground" variant={"secondary"}>
          <span>
            <CirclePause className=" size-4" />
          </span>
          <span>Pause</span>
        </Button>
        <Button className=" text-secondary-foreground" variant={"secondary"}>
          <span>
            <BellRing className=" size-4" />
          </span>
          <span>Test alert</span>
        </Button>
        <Button
          className=" text-secondary-foreground"
          onClick={handleEditDialog}
          variant={"secondary"}
        >
          <span>
            <Settings className=" size-4" />
          </span>
          <span>Edit</span>
        </Button>
      </div>
    </div>
  );
}

export default HeaderCard;
