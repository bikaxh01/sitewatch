import React from "react";
import { formatDistanceToNow } from "date-fns";
import { stat } from "fs";
interface StatusCardProp {
  status: "UP" | "DOWN" | "PENDING";
  lastChecked: number;
  totalUpTime: string;
  incidentCount: number;
  checkInterval:string
}

function StatusCard({
  status,
  lastChecked,
  totalUpTime,
  incidentCount,
  checkInterval
}: StatusCardProp) {
  return (
    <div className="  rounded-md h-full    grid grid-cols-3 gap-3  ">
      <div className="  bg-card  border border-sidebar-accent items-start rounded-md flex flex-col gap-1  h-[90%]  py-5 px-6 ">
        <span className=" text-1xl  text-neutral-300">Current status</span>
        <span className={`font-bold text-2xl ${status === "UP" ? "text-green-400" :status=== "DOWN" ? "text-red-400" :"text-gray-400"}`}>{status}</span>
        
      </div>
      <div className="  bg-card  border border-sidebar-accent items-start rounded-md flex flex-col gap-1  h-[90%]  py-5 px-6 ">
        <span className=" text-1xl  text-neutral-300">Last checked</span>
        <span className=" font-bold text-xl ">
          {formatDistanceToNow(new Date(lastChecked ? lastChecked: Date.now()), { addSuffix: true })}
        </span>
        <span className=" text-neutral-300 text-xs">Checking every {checkInterval} min</span>
      </div>
      <div className=" bg-card   border border-sidebar-accent items-start rounded-md flex flex-col gap-1  h-[90%]  py-5 px-6 ">
        <span className=" text-1xl  text-neutral-300">Incidents</span>
        <span className=" font-bold text-2xl ">
          {incidentCount}
        </span>
      </div>
      {/* <div className=" bg-card   border border-sidebar-accent items-start rounded-md flex flex-col gap-1  h-[90%]  py-5 px-6 ">
        <span className=" text-1xl  text-neutral-300">Up Time</span>
        <span className=" font-bold text-2xl ">{totalUpTime}</span>
        <span className=" text-neutral-300 text-xs">
          In last 30 days
        </span>
      </div> */}
    </div>
  );
}

export default StatusCard;
