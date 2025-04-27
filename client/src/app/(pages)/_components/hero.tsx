"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import NavComponent from "./Nav";
import Link from "next/link";
const stackList = [
  { title: "Redis" },
  { title: "PostgreSQL" },
  { title: "MongoDB" },
  { title: "MySQL" },
  { title: "React" },
  { title: "Vue.js" },
  { title: "Angular" },
  { title: "Next.js" },
  { title: "Node.js" },
  { title: "Express.js" },
  { title: "Tailwind CSS" },
  { title: "Bootstrap" },
  { title: "GraphQL" },
  { title: "REST API" },
  { title: "TypeScript" },
  { title: "JavaScript" },
  { title: "REST API" },
  { title: "TypeScript" },
  { title: "JavaScript" },
  { title: "REST API" },
  { title: "TypeScript" },
  { title: "JavaScript" },
];

function HeroSection() {
  return (
    <div>
      <div
        style={{
          backgroundImage:
            "url('https://betterstack.com/assets/v2/homepage-v3/hero-bg-408d1e858d0c9969863b4116bf2ad625e96cb10643f5868768c35b604208b9ad.jpg')",
          width: "100%",
          height: "47rem",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "backOut" }}
          className="  flex gap-5 items-center justify-center  h-[40rem]  "
        >
          <div className="   flex w-[45rem] gap-5 items-center justify-center flex-col">
            <div>
              <h2 className=" text-2xl font-semibold">SiteWatch.</h2>
            </div>
            <div className=" text-7xl font-semibold flex flex-col items-center justify-center gap-2">
              <h1>Radically better</h1>
              <h1>observability stack</h1>
            </div>
            <div className=" flex flex-col items-center justify-center">
              <h2 className="  text-gray-400 text-[1.2rem] ">
                Ship higher-quality software faster.
              </h2>
              <h2 className="  text-gray-400 text-[1.2rem] ">
                Be the hero of your engineering teams.
              </h2>
            </div>
            <div>
              <Link href={"/auth/sign-in"}>
                <Button>Get started</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <div className=" flex items-center justify-center  h-[7rem] mask-x-from-70% mask-x-to-90%">
        <div className=" flex overflow-hidden   w-[80rem]">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="  flex  flex-shrink-0"
          >
            {stackList.map((item) => (
              <motion.h2 className=" pr-4 text-2xl font-semibold text-gray-600">
                {item.title}
              </motion.h2>
            ))}
          </motion.div>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="  flex  flex-shrink-0 "
          >
            {stackList.map((item) => (
              <motion.h2 className=" pr-4 text-2xl font-semibold text-gray-600">
                {item.title}
              </motion.h2>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
