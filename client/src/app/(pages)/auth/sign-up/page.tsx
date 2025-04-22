"use client";
import { Button } from "@/components/ui/button";
import { CircleChevronRight, Eye, EyeOff, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import { setMaxListeners } from "events";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
function page() {
  const [showPassword, setShowPassword] = useState(true);
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
    <div className=" py-4 px-2   border rounded-md shadow-2xl shadow-blue-500/20  h-[32rem] w-[30%] ">
      <div className="  gap-3 flex flex-col items-center  justify-center">
        <h1 className=" text-2xl font-bold">Sign up for free</h1>
        <p className=" text-xs text-muted-foreground/80">
          Already have an account ?{" "}
          <Link href={"/auth/sign-in"} className="  text-blue-600 underline">
            sign In
          </Link>
        </p>
      </div>
      <div>
        <form className="  p-2 flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className=" flex flex-col gap-y-1.5">
            <label className=" text-xs  text-muted-foreground">
              First name
            </label>
            <input
              className="  border-2 w-full  h-10 rounded-md text-sm p-2"
              placeholder="John"
              name="FullName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value.trim())}
            />
          </div>
          <div className=" flex flex-col gap-y-1.5">
            <label className=" text-xs text-muted-foreground">Last name</label>
            <input
              className=" w-full border-2 h-10 rounded-md text-sm p-2"
              placeholder="Doe"
              type="text"
              name="LastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value.trim())}
            />
          </div>
          <div className=" flex flex-col gap-y-1.5">
            <label className=" text-xs text-muted-foreground">Email</label>
            <input
              className=" w-full border-2  h-10 rounded-md text-sm p-2"
              placeholder="john@example.com"
              type="email"
              name="Email"
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
          <div className=" flex flex-col gap-y-1.5 ">
            <label className=" text-xs text-muted-foreground">Password</label>
            <div className="flex">
              <input
                className=" w-full z-10  border-2  border-r-0 flex  h-10 rounded-l-md text-sm p-2"
                name="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                type={showPassword ? "text" : "password"}
              />
              <span className=" w-8 rounded-r-md  border  border-l-0  flex items-center justify-center">
                <button onClick={handleShowPassword}>
                  {showPassword ? (
                    <EyeOff className=" size-4" />
                  ) : (
                    <Eye className=" size-4" />
                  )}
                </button>
              </span>
            </div>
          </div>
          <div className=" flex flex-col gap-y-1.5">
            <label className=" text-xs text-muted-foreground">
              Confirm password
            </label>
            <div className="flex">
              <input
                className=" w-full z-10  border-2  border-r-0 flex  h-10 rounded-l-md text-sm p-2"
                name="ConfirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.trim())}
                type={showConfirmPassword ? "text" : "password"}
              />
              <span className=" w-8 rounded-r-md  border  border-l-0  flex items-center justify-center">
                <button onClick={handleConfirmPassword}>
                  {showConfirmPassword ? (
                    <EyeOff className=" size-4" />
                  ) : (
                    <Eye className=" size-4" />
                  )}
                </button>
              </span>
            </div>
          </div>

          <Button
            disabled={disableButton || emailMessage.type === "Error`"}
            type="submit"
            className=" mt-2 flex items-center justify-center"
          >
            <span>Create Account</span>
            <CircleChevronRight className=" size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default page;
