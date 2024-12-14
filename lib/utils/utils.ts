import { clsx, type ClassValue } from "clsx";
import { createHash } from "crypto";
import { twMerge } from "tailwind-merge";
import { v5 as uuidv5 } from "uuid";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateIdFromEmail(email: string) {
   
  return uuidv5(email, "e08d66bd-276a-48a4-bc7e-8eeb1b6171ad");
}


export async function getAuthSession() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return  redirect("/sign-in" );
  }
  return session.user.id;
}