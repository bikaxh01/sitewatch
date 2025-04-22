"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const page = () => {
  const [email, setEmail] = useState("");

  

  


  return (
    <div className="py-4 pt- px-2 border rounded-md shadow-2xl shadow-blue-500/20 h-[13rem] w-[30%]">
      <div className="  gap-3 flex flex-col items-center  justify-center">
        <h1 className=" text-2xl  font-bold">Forget password</h1>
      </div>
      <div className="flex flex-col gap-y-1.5">
        <label className="text-xs p-1 text-muted-foreground">
          Enter email to Forget Password
        </label>
        <input
          type="email"
          className="border-2 w-full h-10 rounded-md text-sm p-2"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value.trim())}
        />
      </div>
      <Button
        type="submit"
        className="mt-2  w-full flex items-center justify-center"
      >
        login
      </Button>
    </div>
  );
};

export default page;
