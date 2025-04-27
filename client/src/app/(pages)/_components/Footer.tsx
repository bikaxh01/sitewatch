"use client"
import { ChartNoAxesColumnIncreasing, TriangleAlert } from "lucide-react";
import React from "react";
import {motion} from "motion/react"

function Footer() {
  return (
    <div className=" px-[15rem] py-[8rem]  ">
      <div className=" w-full border-[0.0001rem] border-[#11152f]  "></div>
      <div className=" mt-8  w-full flex items-center  justify-center  ">
        <h1 className=" text-4xl text-center  text-[35px] max-w-[500px]   font-bold      ">
          Everything you need to ship higher‑quality software faster
        </h1>
      </div>
      <div className="flex  items-center justify-between w-full gap-3   mt-9  ">
        <div className=" py-10 px-8 h-60 border  rounded-lg w-1/2 relative">
          <div className="absolute top-3    right-3 px-2 py-1 text-shadow-sky-300 border-inherit shadow-lg  border text-muted rounded-2xl  text-xs ">
            Coming soon
          </div>
          <div className="w-10 h-11 py-2   px-2 rounded-lg border  ">
            <ChartNoAxesColumnIncreasing />
          </div>
          <h3 className="mt-5 text-2xl font-bold text-white">Tracing</h3>
          <p className="mt-3">
            OpenTelemetry-native tracing with automatic instrumentation. Get in
            touch for a private beta.
          </p>
        </div>
        <div className=" py-10 px-8 h-60 border  rounded-lg w-1/2 relative">
          <div className="absolute top-3  right-3 px-2 py-1 text-shadow-sky-300 border-inherit shadow-lg text-xs text-muted border rounded-2xl  ">
            Coming soon
          </div>
          <div className="w-10 h-11 py-2   px-2 rounded-lg border  ">
            <TriangleAlert />
          </div>
          <h3 className="mt-5 text-2xl font-bold text-white">Error tracking</h3>
          <p className="mt-3">
            Catch bugs, get root cause of every error, and create tickets on
            autopilot.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
