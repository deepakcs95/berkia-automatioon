"use server";

import { getUserByIdWithSubscription } from "@/lib/db";
import { getAuthSession } from "@/lib/utils/utils";
import { unstable_cache } from "next/cache";

export async function getUser() {
  const userId = await getAuthSession();
  console.log("fetching user");

  const user = await getCachedUser(userId);

  return user;
}

export const getCachedUser = unstable_cache(
  async (userId: string) => {
    console.log("cache miss getting instagram accounts");
    const user = await getUserByIdWithSubscription(userId);
    return user;
  },
  [`user`],
  {
    tags: ["user"],
    revalidate: 60,
  }
);
