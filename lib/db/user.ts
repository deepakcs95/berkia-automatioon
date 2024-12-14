"user server";
import { User } from "next-auth";
import { cache } from "react";
import { generateIdFromEmail } from "@/lib/utils/utils";
import { db } from "@/lib/db/prisma";

export const onboardUser = async (user: User) => {
  if (user.email) {
    const existingUser = await getUserByEmail(user.email);

    if (!existingUser) {
      await db.user.create({
        data: {
          id: generateIdFromEmail(user.email),
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });
      console.log("User created");
    }
  } else {
    console.error("User email is null or undefined");
  }
};

export const getUserByEmail = cache(async (email: string) => {
  return await db.user.findUnique({ where: { email } });
});

 