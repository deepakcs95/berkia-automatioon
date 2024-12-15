"use server";

import { getAuthSession } from "@/lib/utils/utils";
import { chatbotFormSchema } from "@/lib/validator/chatbot";
import { getUser } from "./user";
import { validateSubscriptionForUser } from "@/lib/utils/subscriptionValidator";
import {   createChatBotDb, deleteChatBotDb, updateChatBotDb } from "@/lib/db/chatbot";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createNewChatBot(chatBotFromData: unknown) {
  try {
     const user = await getUser();

    const validatedData = chatbotFormSchema.safeParse(chatBotFromData);

    if (!validatedData.success) {
      console.error("Invalid chatbot data:", validatedData.error);
      return { status: 400, message: "Invalid chatbot data" };
    }

    const data = validatedData.data;


    if (!user || !user.subscription)
      return { status: 404, message: "User not found" };

    const { isValid, message } = validateSubscriptionForUser(
      user.subscription,
      "createChatbot"
    );

    if (!isValid) {
      return { status: 400, message };
    }

    const success = await createChatBotDb(user.id, data);
    if (!success)
      return { status: 500, message: "An error occurred please try again" };

    console.log("✅ successfully created chatbot");
    revalidateTag("instagram-accounts");
    revalidateTag("user");

    return { status: 200, message: "Chatbot created successfully" };
  } catch (error) {
    console.error("error creating chatbot", error);
     
    return { status: 500, message: "An error occurred please try again" };
  } finally {
    revalidatePath("/dashboard/chatbots");
  }
}

export async function updateChatBot(chatBotFromData: unknown) {
  try {
    const user = await getUser();
 
    const validatedData = chatbotFormSchema.safeParse(chatBotFromData);

    if (!validatedData.success) {
      console.error("Invalid chatbot data:", validatedData.error);
      return { status: 400, message: "Invalid chatbot data" };
    }

    const data = validatedData.data;

 

    if (!user || !user.subscription)
      return { status: 404, message: "User not found" };

    const success = await updateChatBotDb(data);
    if (!success)
      return { status: 500, message: "An error occurred please try again" };
    
    console.log("✅ successfully updated chatbot");


    revalidateTag("instagram-accounts");
    revalidateTag("user");
    return { status: 200, message: "Chatbot updated successfully" };
  } catch (error) {
    console.error("error updating chatbot", error);
    return { status: 500, message: "An error occurred please try again" };
  } finally {
    revalidatePath("/dashboard/chatbots");
  }
}

export async function deleteChatBot(chatBoxId: string) {
  try {
 
    const user = await getUser();

    if (!user || !user.subscription)
      return { status: 404, message: "User not found" };

    const success = await deleteChatBotDb(user.id,chatBoxId);
    if (!success)
      return { status: 500, message: "An error occurred please try again" };

    console.log("✅ successfully deleted chatbot");

    revalidateTag("instagram-accounts");
    revalidateTag("user");
    return { status: 200, message: "Chatbot deleted successfully" };
  } catch (error) {
    console.error("error deleting chatbot", error);
    return { status: 500, message: "An error occurred please try again" };
  } finally {
    revalidatePath("/dashboard/chatbots");
  }
}
