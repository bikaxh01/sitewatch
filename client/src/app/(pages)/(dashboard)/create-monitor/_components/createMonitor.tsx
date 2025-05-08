"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { ChevronDown } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function CreateMonitor() {
  const [disableButton, setDisableButton] = useState(true);
  const [monitorName, setMonitor] = useState("");
  const [url, setUrl] = useState("https://");
  const [checkInterval, setCheckInterval] = useState("3");

  useEffect(() => {
    if (monitorName.length > 0 && url.length > 0 && checkInterval.length > 0) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [monitorName, url, checkInterval]);

  const router = useRouter()
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const body = {
        monitorName,
        url,
        checkInterval,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/url/register-monitor`,
        body,
        {
          withCredentials: true,
        }
      );
      toast.success("Monitor created");
      router.push("/monitors")
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className=" h-full w-full grid grid-cols-12 p-12 ">
      <div className=" py-4 px-6 col-span-5 h-full ">
        <div className=" flex flex-col gap-4">
          <h1 className=" font-semibold text-2xl">Create Monitor</h1>
          <div className=" flex flex-col gap-2">
            <h3 className="  text-1xl font-semibold">What to monitor</h3>
            <p className=" text-xs text-gray-400">
              Configure the target website you want to monitor. You'll find the
              advanced configuration below, in the advanced settings section.
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-7 h-full w-full">
        <div className="rounded-md bg-sidebar-accent p-4">
          <form
            className="h-[20rem] flex flex-col items-start px-1 pb-2 space-y-2"
            onSubmit={handleSubmit}
          >
            <label>Monitor name :</label>
            <input
              className="border-2 w-full rounded-md p-1"
              value={monitorName}
              onChange={(e) => setMonitor(e.target.value)}
            />

            <label>URL to monitor:</label>
            <input
              className="border-2 w-full rounded-md p-1"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <label className="pt-2">Check Interval:</label>
            <select
              name="interval"
              id="check status"
              defaultValue="3"
              value={checkInterval}
              onChange={(e) => setCheckInterval(e.target.value)}
              className="w-60 border-2 rounded-md p-2 bg-accent"
            > 
           
              <option value="3">3</option>
              <option value="5">5</option>
            </select>
            <Button className="mt-4" type="submit" disabled={disableButton}>
              Create Monitor
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateMonitor;
