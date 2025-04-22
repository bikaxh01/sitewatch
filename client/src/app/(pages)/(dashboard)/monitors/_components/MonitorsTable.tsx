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
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Lottie from "lottie-react";

import PendingAnimation from "@/../public/Pending_animation.json";
import UpAnimation from "@/../public/Up_animation.json";
import DownAnimation from "@/../public/Down_animation.json";

export interface Monitor {
  id: string;
  monitorName: string;
  url: string;
  domain: string;
  status: "UP" | "DOWN" | "PENDING";
  checkInterval: number;
  userId: string;
  isDeleted: boolean;
  isPaused: boolean;
  createdAt: boolean;
}

function MonitorsTable() {
  const [user, loading, signedIn] = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Monitor[] | []>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, loading, signedIn]);

  useEffect(() => {
    const response = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL as string
          }/url/get-all-monitors`,
          { withCredentials: true }
        );

        setData(res.data.data);
      } catch (error) {
        console.log("🚀 ~ useEffect ~ error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    response();
  }, []);

  if (loading) {
    return (
      <div className="h-[30rem] w-full  flex items-center justify-center">
        <Loader2 className=" animate-spin size-8" />
      </div>
    );
  }

  return (
    <div className=" flex flex-col gap-4  ">
      {data.length >= 0 && (
        <div className="  w-full flex items-end justify-end">
          <Link href={"/create-monitor"}>
            <Button>Create monitor</Button>
          </Link>
        </div>
      )}

      <div className=" w-full h-full  bg-card rounded-md px-6">
        {isLoading ? (
          <div className="h-[20rem]  flex items-center justify-center">
          
            <Loader2  className=" animate-spin"/>
          </div>
        ) : data.length === 0 ? (
          <div className=" h-[20rem] flex items-center justify-center gap-8  flex-col w-full ">
            <h2 className="  text-2xl font-semibold">No Monitors yet 🤔</h2>
            <Link href={"/create-monitor"} className=" w-[10rem]">
              <Button>Create Now</Button>
            </Link>
          </div>
        ) : (
          <Table className=" " >
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">SN</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Url</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((monitor, index) => (
                <TableRow
                  key={monitor.id}
                  onClick={() => router.push(`/monitor/${monitor.id}`)}
                  className="  hover:bg-gray-900 "
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{monitor.monitorName}</TableCell>
                  <TableCell>{monitor.url}</TableCell>
                  <TableCell>
                    <Lottie
                      animationData={
                        monitor.status === "UP"
                          ? UpAnimation
                          : monitor.status == "DOWN"
                            ? DownAnimation
                            : PendingAnimation
                      }
                      loop={true}
                      className=" size-6"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default MonitorsTable;
