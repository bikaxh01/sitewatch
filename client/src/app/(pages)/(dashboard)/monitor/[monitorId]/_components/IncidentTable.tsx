"use client";

import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { timestampFormatter } from "@/lib/formtter";

export interface Incident {
  id: string;
  urlId: string;
  startTime: string;
  endTime: string;
  duration: string;
  url?: string;
}

function IncidentTable({ monitorId }: { monitorId: string }) {
  const [incidents, setIncidents] = useState<Incident[] | []>([]);
 

  useEffect(() => {
    const getIncidents = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/url/get-monitor-incidents?monitorId=${monitorId}`,
          { withCredentials: true }
        );
        setIncidents(res.data.data);
      } catch (error) {
        console.log("🚀 ~ getIncidents ~ error:", error);
      }
    };

    getIncidents();
  }, []);

  return (
    <div className=" h-full  bg-card rounded-md">
      {incidents.length <= 0 ? (
        <div className=" h-[20rem] flex items-center justify-center gap-8  flex-col w-full ">
          <h2 className="  text-2xl font-semibold">No Incident's 😎</h2>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident, index) => (
              <TableRow key={incident.id} className="  hover:bg-gray-900 ">
                <TableCell className="font-medium">{index + 1}</TableCell>

                <TableCell>
                  {" "}
                  {(incident.startTime &&
                    timestampFormatter(incident.startTime)) ||
                    "ON-GOING"}
                </TableCell>
                <TableCell>
                  {(incident.endTime && timestampFormatter(incident.endTime)) ||
                    "ON-GOING"}
                </TableCell>
                <TableCell>{incident.duration || "ON-GOING"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default IncidentTable;
