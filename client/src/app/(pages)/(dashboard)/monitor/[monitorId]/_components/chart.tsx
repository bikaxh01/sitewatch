"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import axios from "axios";

const chartConfig = {
  tls_handshake: {
    label: "TLS handshake",
    color: "hsl(var(--chart-1))",
  },
  name_lookup: {
    label: "Name lookup",
    color: "hsl(var(--chart-2))",
  },
  data_transfer: {
    label: "Data Transfer",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function ChartComponent({ monitorId }: { monitorId: string }) {
  const [stats, setStats] = useState([]);
  const [selectedDays, setSelectedDays] = useState("24h");
  const [selectedRegion, setSelectedRegion] = useState("Europe");

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/url/get-monitor-stats?monitorId=${monitorId}&days=${selectedDays}&region=${selectedRegion}`,
          {
            withCredentials: true,
          }
        );
        setStats(res.data.data);
      } catch (error) {
        console.log("🚀 ~ getStats ~ error:", error);
      }
    };
    getStats();
  }, []);
  return (
    <Card className="  300 max-h-full  !rounded-md">
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={stats}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => timestampFormatter(value)}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="name_lookup"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-name_lookup)"
              stackId="a"
            />
            <Area
              dataKey="tls_handshake"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-tls_handshake)"
              stackId="a"
            />
            <Area
              dataKey="data_transfer"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-data_transfer)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function timestampFormatter(timestamp: string) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formatted = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formatted; // e.g., "2025-04-20 22:26:07" (depends on local timezone)
}
