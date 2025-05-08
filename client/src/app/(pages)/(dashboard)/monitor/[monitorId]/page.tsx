"use client";
import React, { useEffect, useState } from "react";
import HeaderCard from "./_components/HeaderCard";
import StatusCard from "./_components/StatusCard";
import ChartComponent from "./_components/chart";
import IncidentTable from "./_components/IncidentTable";
import EditDialog from "./_components/EditDialog";
import axios from "axios";
import { Monitor } from "../../monitors/_components/MonitorsTable";
import { toast } from "sonner";
import { AsteriskIcon } from "lucide-react";

interface MonitorPageParams {
  params: Promise<{ monitorId: string }>;
}

function Monitors({ params }: MonitorPageParams) {
  const { monitorId } = React.use(params);
  const [isInitialLoading, setInitialLoading] = useState<boolean>(false);
  const [monitorDetail, setMonitorDetail] = useState<Monitor | "">("");
  

  const [status, setStatus] = useState<"UP" | "DOWN" | "PENDING">("PENDING");
  const [incidentCount, setIncidentCount] = useState<number>(0);
  const [lastChecked, setLastChecked] = useState<number>(0);
  const [totalUpTime, setTotalUpTime] = useState("4 days");

  if (!monitorId) {
    return <div>Id not Found</div>;
  }

  useEffect(() => {
    const getMonitorDetail = async () => {
      try {
        setInitialLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/url/get-monitor?monitorId=${monitorId}`,
          {
            withCredentials: true,
          }
        );

        setMonitorDetail(res.data.data.monitorDetails);
        setStatus(res.data.data.status);
        setIncidentCount(res.data.data.incidentCount);
        setLastChecked(res.data.data.lastChecked);
      } catch (error) {
        toast.error("Oops something went wrong");
      } finally {
        setInitialLoading(false);
      }
    };
    getMonitorDetail();
  }, [monitorId]);

  useEffect(() => {
    const getStatus = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/url/get-monitor-status?monitorId=${monitorId}`,
        {
          withCredentials: true,
        }
      );

      setStatus(res.data.data.status);
      setIncidentCount(res.data.data.incidentCount);
      setLastChecked(res.data.data.lastChecked);
    };
    // getStatus()
    const intervalId = setInterval(getStatus, 1000 * 60);
    () => clearInterval(intervalId);
  }, [monitorId]);
  
  
  type StatusCardProp = {
    checkInterval: string;
  };


  const [open, setOpen] = useState(false);
  return (
    <div className="grid gap-2   grid-flow-row auto-rows-min">
      <div className="row-span-2  min-h-34">
        <HeaderCard
          ///@ts-ignore
          monitor={monitorDetail}
          status={status}
          loading={isInitialLoading}
          open={open}
          setOpen={setOpen}
        />
        {monitorDetail && (
          <EditDialog
            open={open}
            setOpen={setOpen}
            monitorDetail={monitorDetail }
          />
        )}
      </div>
      <div className="row-span-3  min-h-34   ">
        <StatusCard
          checkInterval={monitorDetail ? String(monitorDetail.checkInterval) : ""}
          incidentCount={incidentCount}
          lastChecked={lastChecked}
          status={status}
          totalUpTime={totalUpTime}
        />
      </div>
      <div className="row-span-4 max-h-[25rem]  ">
        <ChartComponent monitorId={monitorId} />
      </div>
      <div className="row-span-3 min-h-[25rem]">
        <IncidentTable monitorId={monitorId} />
      </div>
    </div>
  );
}

export default Monitors;
