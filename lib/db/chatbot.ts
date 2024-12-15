'server only'

import { cache } from "react";
import { db } from "./prisma";
import { ChatbotFormData } from "../validator/chatbot";

export const getChatbotUserId = cache(async (id: string) => {
  return await db.chatbot.findUnique({ where: { id } });
});

export const createChatBotDb = cache(
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

export const updateChatBotDb = cache(
    async ( data: ChatbotFormData) => {
      try {

      
            const currentChatBot = await db.chatbot.findFirst({
              where: {
                socialAccountId: data.socialAccountId,
                
              },
              include: {
                socialAccount: true,
              },
            });
      
             if (!currentChatBot) {
             throw new Error('No Chatbot found for this data')
            }


            const   newchatBot = await db.chatbot.update({
          where: {
            id: currentChatBot.id,
          },
          data: {
            socialAccountId: data.socialAccountId,
            name: data.name,
            context: data.context,
            responseTone: data.responseTone,
            responseTemplate: data.responseTemplate,
          },
        });
  
        return true
      } catch (error) {
        console.error(error);
        return false
      }
    }
  );
  
  export const deleteChatBotDb = cache(
    async (id: string,socialAccountId: string) => {
      try {
        const chatBot = 
        await db.$transaction(async (transaction) => {
            
            await db.chatbot.delete({
                where: {
                    socialAccountId: socialAccountId,
                },
            });
            await transaction.subscription.update({
              where: {
                userId: id,
              },
              data: {
                chatBotsUsed: {
                  decrement: 1,
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
  
  