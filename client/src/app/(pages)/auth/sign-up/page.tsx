"use client";
import { Button } from "@/components/ui/button";
import { CircleChevronRight, Eye, EyeOff, Globe, Save } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import { setMaxListeners } from "events";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { motion } from "motion/react";
function page() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const debouncedEmail = useDebounce(email, 500);
  const [emailMessage, setEmailMessage] = useState<any>(null);

  const router = useRouter();

  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // check email

    if (debouncedEmail) {
      async function validateEmail() {
        try {
          const res = await axios.get(
            `${
              process.env.NEXT_PUBLIC_API_BASE_URL as string
            }/user/validate-email?email=${debouncedEmail}`
          );
          setEmailMessage({
            type: "Success",
            message: res.data.message,
          });
        } catch (error: any) {
          setEmailMessage({
            type: "Error",
            message: error.response.data.message,
          });
        }
      }
      validateEmail();
    }
  }, [debouncedEmail]);

  const [user] = useUser();
  useEffect(() => {
    if (user) {
      router.push("/monitors");
    }
  }, [user]);

  const handleShowPassword = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleConfirmPassword = (e: any) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    if (
      firstName.length > 0 &&
      email.length > 0 &&
      password.length > 7 &&
      confirmPassword.length > 0
    ) {
      if (password === confirmPassword) {
        setDisableButton(false);
        return;
      }
    }

    setDisableButton(true);
  }, [password, confirmPassword, firstName, email]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const inputData = {
        firstName,
        lastName,
        email,
        password,
        signUpType: "PASSWORD",
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/user/email-sign-up`,
        inputData
      );
      toast.success(res.data.message, { id: "sign-up toast" });
      router.push("/auth/sign-in");
    } catch (error: any) {
      toast.error(error.response.data.message, { id: "sign-up toast" });
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://betterstack.com/assets/auth/flare-v3-b1df91c6207d51591419bda1b1582549116182616361be4efcbc774b9ba2ee1b.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="w-screen h-screen flex items-center justify-center"
    >
      <div className="h-screen w-[30%]">
        <div className="mt-[5rem]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, ease: "backInOut" }}
            className="flex flex-col gap-4 justify-center items-center"
          >
            <div className="flex flex-col gap-2 justify-center items-center">
              <Globe />
              <h1 className="text-3xl font-bold">Sign up for free</h1>
              <p className="text-xs text-muted-foreground/80">
                Already have an account?{" "}
                <Link
                  href={"/auth/sign-in"}
                  className="text-blue-600 underline"
                >
                  Sign In
                </Link>
              </p>
            </div>

            <div className="w-full p-2">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* First Name and Last Name in same row */}
                <div className="flex gap-4">
                  <div className="flex flex-col gap-y-2 flex-1">
                    <label className="text-xs text-muted-foreground">
                      First name
                    </label>
                    <input
                      ref={firstNameRef}
                      type="text"
                      placeholder="John"
                      className="border-2 w-full h-12 bg-better-stack-bg focus:outline-0 focus:border-better-stack-primary focus:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] rounded-md text-sm p-2"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value.trim())}
                    />
                  </div>

                  <div className="flex flex-col gap-y-2 flex-1">
                    <label className="text-xs text-muted-foreground">
                      Last name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="border-2 w-full h-12 bg-better-stack-bg focus:outline-0 focus:border-better-stack-primary focus:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] rounded-md text-sm p-2"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value.trim())}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-y-2">
                  <label className="text-xs text-muted-foreground">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="border-2 w-full h-12 bg-better-stack-bg focus:outline-0 focus:border-better-stack-primary focus:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] rounded-md text-sm p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                  />
                  {emailMessage && (
                    <span
                      className={`${
                        emailMessage.type === "Success"
                          ? "text-green-400"
                          : "text-red-400"
                      } text-xs`}
                    >
                      {emailMessage.message}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-y-2">
                  <label className="text-xs text-muted-foreground">
                    Password
                  </label>
                  <div className="flex border-2 focus-within:border-better-stack-primary rounded-md focus-within:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full z-10 border-2 focus:outline-0 flex bg-better-stack-bg h-12 rounded-l-md text-sm p-2"
                      value={password}
                      onChange={(e) => setPassword(e.target.value.trim())}
                    />
                    <span className="w-8 rounded-r-md border border-l-0 flex items-center bg-better-stack-bg justify-center">
                      <button onClick={handleShowPassword} type="button">
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </span>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-y-2">
                  <label className="text-xs text-muted-foreground">
                    Confirm password
                  </label>
                  <div className="flex border-2 focus-within:border-better-stack-primary rounded-md focus-within:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full z-10 border-2 focus:outline-0 flex bg-better-stack-bg h-12 rounded-l-md text-sm p-2"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value.trim())
                      }
                    />
                    <span className="w-8 rounded-r-md border border-l-0 flex items-center bg-better-stack-bg justify-center">
                      <button onClick={handleConfirmPassword} type="button">
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={disableButton || emailMessage?.type === "Error"}
                  className="mt-4 flex items-center bg-better-stack-primary text-white hover:bg-better-stack-primary/80 
                  disabled:bg-better-stack-primary/80 disabled:opacity-90 justify-center"
                >
                  <span>Create Account</span>
                  <CircleChevronRight className="size-4 ml-2" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default page;
