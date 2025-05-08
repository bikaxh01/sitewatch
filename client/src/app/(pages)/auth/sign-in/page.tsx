"use client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Fullscreen, Globe } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { motion } from "motion/react";

function page() {
  const [showPassword, setShowPassword] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_EMAIL as string);
  const [password, setPassword] = useState(
    process.env.NEXT_PUBLIC_PASSWORD as string
  );

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const router = useRouter();

  const handlePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    4;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/user/email-sign-in`,
        data,
        {
          withCredentials: true,
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
    <div
      style={{
        backgroundImage:
          "url('https://betterstack.com/assets/auth/flare-v3-b1df91c6207d51591419bda1b1582549116182616361be4efcbc774b9ba2ee1b.jpg')",

        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className=" w-screen h-screen flex items-center justify-center"
    >
      <div className=" h-screen w-[25%] ">
        <div className=" mt-[10rem] ">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, ease: "backInOut" }}
            className="  flex flex-col gap-4 justify-center items-center"
          >
            <div className=" flex flex-col gap-2 justify-center items-center">
              <Globe />
              <h1 className=" text-3xl font-bold">Welcome back</h1>

              <p className=" text-xs text-muted-foreground/80">
                First time here ?{" "}
                <Link
                  href={"/auth/sign-up"}
                  className="  text-blue-600 underline"
                >
                  sign up
                </Link>
              </p>
            </div>
            <div className=" w-full p-2">
              <form onSubmit={handleSubmit} className=" flex flex-col gap-4 ">
                <div className="flex flex-col gap-y-2 ">
                  <label className="text-xs text-muted-foreground ">
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    className="border-3  w-full h-12 bg-better-stack-bg focus:outline-0 focus:border-better-stack-primary focus:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]    rounded-md text-sm p-2"
                    value={email}
                    placeholder="example@gmail.com"
                    onChange={(e) => setEmail(e.target.value.trim())}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <label className="text-xs text-muted-foreground">
                    Password
                  </label>
                  <div className="flex border-2 focus-within:border-better-stack-primary rounded-md  focus-within:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] ">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full z-10   border-2  focus:outline-0   flex bg-better-stack-bg  h-12 rounded-l-md text-sm p-2"
                      value={password}
                      onChange={(e) => setPassword(e.target.value.trim())}
                    />
                    <span className="w-8 rounded-r-md border border-l-0 flex items-center  bg-better-stack-bg justify-center">
                      <button onClick={handlePassword} type="button">
                        {showPassword ? (
                          <EyeOff className=" size-4" />
                        ) : (
                          <Eye className=" size-4" />
                        )}
                      </button>
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={disableButton}
                  className="mt-6 flex items-center bg-better-stack-primary text-white hover:bg-better-stack-primary/80 
                  disabled:bg-better-stack-primary/80 disabled:opacity-90 justify-center"
                >
                  login
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// <motion.div
// initial={{ scale: 0 }}
// animate={{ scale: 1 }}
// transition={{ delay: 0.5, ease: "backInOut" }}
// className="py-4 pt- px-2 border rounded-md shadow-2xl shadow-blue-500/20 h-[25rem] w-[25%] "
// >
// < className="  gap-3 flex flex-col items-center  justify-center">
//   <h1 className=" text-2xl font-bold">Welcome back</h1>
//   <p className=" text-xs text-muted-foreground/80">
//     First time here ?{" "}
//     <Link href={"/auth/sign-up"} className="  text-blue-600 underline">
//       sign up
//     </Link>
//   </p>
export default page;
