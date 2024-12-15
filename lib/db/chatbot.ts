import { cache } from "react";
import { db } from "./prisma";
import { ChatbotFormData } from "../validator/chatbot";

export const getChatbotUserId = cache(async (id: string) => {
  return await db.chatbot.findUnique({ where: { id } });
});

export const createChatBot = cache(
  async (id: string, data: ChatbotFormData) => {
    try {
      const chatBot = await db.chatbot.findFirst({
        where: {
          socialAccountId: data.socialAccountId,
          
        },
        include: {
          socialAccount: true,
        },
      });

       if (chatBot) {
       throw new Error('Chatbot already exists for this account')
      }

      

      await db.$transaction(async (transaction) => {
        await transaction.chatbot.create({
          data: {
            socialAccountId: data.socialAccountId,
            name: data.name,
            context: data.context,
            responseTone: data.responseTone,
            responseTemplate: data.responseTemplate,
          },
        });

        await transaction.subscription.update({
          where: {
            userId: id,
          },
          data: {
            chatBotsUsed: {
              increment: 1,
            },
          },
        });

      });

      return true
    } catch (error) {
      console.error(error);
      return false
    }
  }
);
