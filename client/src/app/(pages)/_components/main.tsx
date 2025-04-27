"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "motion/react";

const items = [
  {
    title: "ScreenShorts for errors",
    description:
      "We record the api errors and take a screenshot of your app begin down",
    image:
      "https://betterstack.com/assets/v2/homepage-v3/mtr-beaf2545f3c5afe201c51b53bc0da7a5696a3152c792f3d1f8ce1c737c2415f1.jpg",
  },

  {
    title: "ScreenShorts for errors",
    description:
      "We record the api errors and take a screenshot of your app begin down",
    image:
      "https://betterstack.com/assets/v2/homepage-v3/mtr-beaf2545f3c5afe201c51b53bc0da7a5696a3152c792f3d1f8ce1c737c2415f1.jpg",
  },

  {
    title: "ScreenShorts for errors",
    description:
      "We record the api errors and take a screenshot of your app begin down",
    image:
      "https://betterstack.com/assets/v2/homepage-v3/mtr-beaf2545f3c5afe201c51b53bc0da7a5696a3152c792f3d1f8ce1c737c2415f1.jpg",
  },
];

function Main() {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(2);

  const handlePrev = () => {
    if (startIndex == 0) return;
    setStartIndex((prev) => prev - 1);
    setEndIndex((prev) => prev - 1);
  };
  const handleNext = () => {
    if (endIndex == items.length - 1) return;
    setStartIndex((prev) => prev + 1);
    setEndIndex((prev) => prev + 1);
  };

  return (
    <div className=" pl-[15rem] flex flex-col gap-4 mt-[10rem] ">
      <div className=" flex justify-between items-center pr-44">
        <h1 className=" font-bold text-4xl">Uptime monitoring</h1>
        <div className=" flex gap-3">
          <Button
            variant={"outline"}
            className=" rounded-full size-9"
            onClick={handlePrev}
          >
            <ChevronLeft />
          </Button>

          <Button
            variant={"outline"}
            className=" rounded-full size-9"
            onClick={handleNext}
          >
            <ChevronRight />
          </Button>

          <Button variant={"outline"} className=" rounded-full text-xs">
            Explore Sitewatch Monitoring
          </Button>
        </div>
      </div>

      <div className=" flex  gap-4">
        {items.slice(startIndex, endIndex).map((item, index) => (
          <motion.div
              whileHover={{ scale: 0.8 }}

            key={index}
            className="relative w-fit p-2 rounded-2xl border border-gray-800   overflow-hidden "
          >
            <div className=" flex flex-col justify-between h-full ">
              <img
                src={`${item.image}`}
                alt="Screenshot"
                className="mx-auto mb-6 rounded-lg shadow-lg w-full max-h-[22rem]"
              />

              <div className=" flex p-4 flex-col ">
                <h2 className="text-white text-lg font-semibold mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Main;
