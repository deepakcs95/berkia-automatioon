import { getAuthSession } from "@/lib/utils/utils";
import { chatbotFormSchema } from "@/lib/validator/chatbot";
import { getUser } from "./user";
import { validateSubscriptionForUser } from "@/lib/utils/subscriptionValidator";
import { createChatBot } from "@/lib/db/chatbot";
import { revalidatePath, revalidateTag } from "next/cache";


export async function createNewChatBot(chatBotFromData: unknown) {

    try {
      const id = await getAuthSession();
  
      const validatedData = chatbotFormSchema.safeParse(chatBotFromData);

      if (!validatedData.success) {
        console.error("Invalid chatbot data:", validatedData.error);
        return { status: 400, message: "Invalid chatbot data" };
      }
    
      const data = validatedData.data;

      const user = await getUser();
  
      if (!user || !user.subscription) return { status: 404, message: "User not found" };
      
      const { isValid, message } = validateSubscriptionForUser(user.subscription, "createChatbot");
      
      if (!isValid) {
        return { status: 400, message };
      }
  
      const success = await createChatBot(id, data);
      if (!success)
        return { status: 500, message: "An error occurred please try again" };
  
      return { status: 200, message: "Chatbot created successfully" };
    } catch (error) {
      return { status: 500, message: "An error occurred please try again" };
    } finally {
        revalidateTag("instagram-accounts");
        revalidateTag("user");
      revalidatePath("/dashboard/automations");
    }
  }