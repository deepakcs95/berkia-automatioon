"use server";

import {
  createAutomation,
  deleteAutomation,
  getAllSocialAccountWithAutomations,
  updateAutomation,
} from "@/lib/db/automations";
import { revalidatePath } from "next/cache";
import { AutomationValidator } from "@/lib/validator/automation";
import { AutomationsType } from "@/lib/types";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import { getAuthSession } from "@/lib/utils/utils";
import { getUser } from "./user";
import { Action, ActionType, SubscriptionStatus } from "@prisma/client";

export async function createNewAutomation(automation: AutomationsType) {
  try {
    const id = await getAuthSession();

    const validatedData = AutomationValidator.safeParse(automation);

    if (!validatedData.success) {
      console.error("Invalid automation data:", validatedData.error);
      return { status: 400, message: "Invalid automation data" };
    }

    const user = await getUser();

    if (!user || !user.subscription) return { status: 404, message: "User not found" };

    const { isValid, message } = validateSubscriptionForUser(user.subscription, "createAutomation");
    
    if (!isValid) {
      return { status: 400, message };
    }

    const success = await createAutomation(id, automation);
    if (!success)
      return { status: 500, message: "An error occurred please try again" };

    return { status: 200, message: "Automation created successfully" };
  } catch (error) {
    return { status: 500, message: "An error occurred please try again" };
  } finally {
    revalidatePath("/dashboard/automations");
  }
}



import { Subscription, Plan } from "@prisma/client"; // Assuming Prisma Client is used
import { validateSubscriptionForUser } from "@/lib/validator/subscriptionValidator";

 

export async function updateAutomationAction(automation: AutomationsType) {
  try {
    const id = await getAuthSession();

    const validatedData = AutomationValidator.safeParse(automation);

    if (!validatedData.success) {
      console.error("Invalid automation data:", validatedData.error);
      return { status: 400, message: "Invalid automation data" };
    }

    const success = await updateAutomation(id, automation);
    if (!success)
      return { status: 500, message: "An error occurred please try again" };

    return { status: 200, message: "Automation updated successfully" };
  } catch (error) {
    return { status: 500, message: "An error occurred please try again" };
  } finally {
    console.log('✅ revalidating("/dashboard/automations");');

    revalidatePath("/dashboard/automations");
  }
}

export async function deleteAutomationAction(automation_id: string) {
  try {
    const id = await getAuthSession();

    if (!id) {
      return { status: 401, message: "Unauthorized" };
    }

    const validatedData = z.string().uuid().safeParse(automation_id);

    if (!validatedData.success) {
      console.error("Invalid automation ID:", validatedData.error);
      return { status: 400, message: "Invalid automation ID" };
    }

    const success = await deleteAutomation(id, automation_id);
    if (!success)
      return { status: 500, message: "An error occurred please try again" };

    return { status: 200, message: "Automation deleted successfully" };
  } catch (error) {
    return { status: 500, message: "An error occurred please try again" };
  } finally {
    revalidatePath("/dashboard/automations");
  }
}

export async function getAllSocialAccountAndAutomations() {
  const id = await getAuthSession();

 
  return unstable_cache(
    async (id: string) => {
      console.log("cache miss getAllSocialAccountAndAutomations, ", id);

      try {
        const automations = await getAllSocialAccountWithAutomations(id);
        if (!automations)
          return {
            status: 404,
            automations: null,
            message: "No Instagram accounts found",
          };
        return {
          status: 200,
          automations,
          message: "Instagram accounts fetched successfully",
        };
      } catch (error) {
        return {
          status: 500,
          automations: null,
          message: "An error occurred please try again",
        };
      }
    },
    ["automations"],
    {
      tags: ["automations"],
      revalidate: 60,
    }
  )(id);
}
