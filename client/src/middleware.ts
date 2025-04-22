import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  // console.log("🚀 ~ middleware ~ request:", request)
  try {

      //  console.log("middle ware");
    //return NextResponse.next();
  } catch (error) {
    console.log("🚀 ~ middleware ~ error:", error);
  }
}
