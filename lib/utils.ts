import { clsx, type ClassValue } from "clsx";
import { createHash } from "crypto";
import { twMerge } from "tailwind-merge";
import { v5 as uuidv5 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateIdFromEmail(email: string) {
  return uuidv5(email, "e08d66bd-276a-48a4-bc7e-8eeb1b6171ad");
}
