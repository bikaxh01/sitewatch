"use client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Fullscreen } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

function page() {
  const [showPassword, setShowPassword] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const handlePassword = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const data = {
    email,
    password,
  };

  const [user] = useUser();

  useEffect(() => {
    if (user) {
      router.push("/monitors");
    }
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
4
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/user/email-sign-in`,
        data,
        {
          withCredentials:true
        }
      );  
      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/monitors");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setDisableButton(false);
      return;
    } else {
      setDisableButton(true);
    }
    setDisableButton(true);
  }, [email, password]);

  return (
    <div className="py-4 pt- px-2 border rounded-md shadow-2xl shadow-blue-500/20 h-[25rem] w-[30%]">
      <div className="  gap-3 flex flex-col items-center  justify-center">
        <h1 className=" text-2xl font-bold">Sign In</h1>
        <p className=" text-xs text-muted-foreground/80">
          Don't have an account ?{" "}
          <Link href={"/auth/sign-up"} className="  text-blue-600 underline">
            sign up
          </Link>
        </p>
      </div>

      <form className="p-2 flex flex-col gap-3 mt-7" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-1.5">
          <label className="text-xs text-muted-foreground">Email</label>
          <input
            type="email"
            className="border-2 w-full h-10 rounded-md text-sm p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
        </div>
        <div className="flex flex-col gap-y-1.5">
          <label className="text-xs text-muted-foreground">Password</label>
          <div className="flex">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full z-10  border-2  border-r-0 flex  h-10 rounded-l-md text-sm p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
            />
            <span className="w-8 rounded-r-md border border-l-0 flex items-center justify-center">
              <button onClick={handlePassword}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </span>
          </div>
        </div>
        <Button
          type="submit"
          disabled={disableButton}
          className="mt-2 flex items-center justify-center"
        >
          login
        </Button>
        <p className=" text-xs text-muted-foreground/80  flex items-center  justify-center">
          <Link href={"/auth/forget-password"} className="  text-white text-sm hover:text-blue-700 underline">
            Forget Password?
          </Link>
        </p>
      </form>
    </div>
  );
}

export default page;
