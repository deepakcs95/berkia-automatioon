"use server";

import { auth } from "@/lib/auth";
import {
  getAllDetailsOfInstagramAccountsByUserId,
  getInstagramAccountsByUserId,
  saveInstagramAccount,
} from "@/lib/db/instagram";
import { db } from "@/lib/db/prisma";
import {
  getInstagramPosts,
  getInstagramToken,
  getInstagramUser,
  getLongLivedToken,
  validateInstagramToken,
} from "@/lib/Integration/social-account-auth";
import { SocialAccount } from "@prisma/client";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

export async function connect(code: string) {
  console.log(code);

  return code;
}

export const getCachedAccounts = unstable_cache(
  async (userId: string) => {
    console.log("cache miss getting instagram accounts");
    const result = await getInstagramAccountsByUserId(userId);
    return result;
  },
  // Include userId in the cache key to make it unique per user
  [`instagram-accounts`],
  {
    tags: ["instagram-accounts"],
    revalidate: 60,
  }
);

export async function connectInstagramAccount(code: string) {
  const session = await auth();

  if (!session?.user) return redirect("/sign-in");

  try {
    const token = await getInstagramToken(code);
    const longLivedToken = await getLongLivedToken(token.access_token);
    const user = await getInstagramUser(longLivedToken.access_token);
    const account = await saveInstagramAccount(
      session.user?.id || "",
      user,
      longLivedToken.access_token
    );

    if (account) {
      console.log("✅ Instagram account connected successfully ");
      revalidateTag("instagram-accounts");
      revalidatePath("/dashboard/account");
      return { success: true, account };
    }
  } catch (error) {
    console.error("❌ Error connecting Instagram account:", error);
    return { success: false, error };
  }
}

export async function deleteConnectedInstagramAccount(accountId: string) {
  const session = await auth();

  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const accounts = await getCachedAccounts(session.user.id);
    const accountToDelete = accounts.find(
      (account) => account.accountId === accountId
    );

    if (!accountToDelete) {
      return { success: false, error: "Instagram account not found" };
    }

    await db.socialAccount.delete({ where: { id: accountToDelete.id } });
    console.log("✅ Instagram account deleted successfully ");
    revalidateTag("instagram-accounts");
    revalidatePath("/dashboard/account");
    return { success: true, message: "Instagram account deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting Instagram account:", error);
    return { success: false, message: "An error occurred please try again" };
  } finally {
    revalidateTag("instagram-accounts");
    revalidatePath("/dashboard/account");
  }
}

export async function disconnectInstagramAccount(accountId: string) {
  const session = await auth();

  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    // First, find the specific Instagram account with the given account_id
    const accounts = await getCachedAccounts(session.user.id);
    const accountToDisconnect = accounts.find(
      (account) => account.accountId === accountId
    );

    if (!accountToDisconnect) {
      return {
        success: false,
        message: "Instagram account not found",
      };
    }

    // Disconnect the account using its unique id
    await db.socialAccount.update({
      where: { id: accountToDisconnect.id },
      data: {
        status: "DISCONNECTED",
        accessToken: null,
        tokenExpiresAt: null,
      },
    });
    revalidateTag("instagram-accounts");
    revalidatePath("/dashboard/account");
    console.log("✅ Instagram account disconnected successfully");

    return {
      success: true,
      message: "Instagram account disconnected successfully",
    };
  } catch (error) {
    console.error("Error disconnecting Instagram account:", error);
    return {
      success: false,
      message: "An error occurred please try again",
    };
  }
}

export async function getCurrentUserInstagramAccounts() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  try {
    const accounts = await getCachedAccounts(session.user.id);

    if (!(accounts.length > 0)) {
      return {
        status: 404,
        accounts: null,
        message: "No Instagram accounts found",
      };
    }

    return {
      status: 200,
      accounts,
      message: "Instagram accounts fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching Instagram accounts:", error);
    return {
      status: 500,
      accounts: null,
      message: "An error occurred please try again",
    };
  }
}

export async function getInstagramPostsByAccountId(
  instgramAccountId: string,
  cursor?: string,
  limit: number = 2
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  try {
    const accounts = await getAllDetailsOfInstagramAccountsByUserId(
      session.user.id
    );

    const account = accounts.find(
      (account) => account.accountId === instgramAccountId
    );

    if (!account) {
      return { success: false, message: "Instagram account not found" };
    }

    const validatedAccount = await validateInstagramToken(
      account as SocialAccount
    );

    if (!validatedAccount) {
      revalidateTag("instagram-accounts");
      return { success: false, message: "token is not valid" };
    }

    const data = await getInstagramPosts(
      validatedAccount.accessToken || "",
      cursor,
      limit
    );

    if (!data) {
      return { success: false, message: "Failed to fetch Instagram posts" };
    }

    return {
      success: true,
      posts: data.posts,
      nextCursor: data.after || null,
    };
  } catch (error) {
    return { success: false, message: "Failed to fetch Instagram posts" };
  }
}
