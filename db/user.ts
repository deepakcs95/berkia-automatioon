"user server";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import db from "@/lib/drizzle";
import { User } from "next-auth";
import { cache } from "react";
import { generateIdFromEmail } from "@/lib/utils";

export const onboardUser = async (user: User) => {
  if (user.email) {
    const existingUser = await getUserByEmail(user.email);

    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: generateIdFromEmail(user.email),
        email: user.email,
        name: user.name,
        image: user.image,
      });
      console.log("User created");
    }
  } else {
    console.error("User email is null or undefined");
  }
};

export const getUserByEmail = cache(async (email: string) => {
  return await db.select().from(users).where(eq(users.email, email)).execute();
});
