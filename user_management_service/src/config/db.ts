import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const formatTime = (timestamp:number) => {
  const date = new Date(timestamp);

  // Get time in 24-hour format
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const time24hr = `${hours}:${minutes}`;
  return time24hr;
};
