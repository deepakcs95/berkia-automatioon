import { db } from "@/lib/db";
import { findTriggerAndAssociatedAutomation } from "@/lib/db/automations";
import { validateInstagramToken } from "@/lib/Integration/social-account-auth";
import { generateContentGemini, sendMessageForComment, sendMessageForMessage, sendReply } from "@/lib/utils/api";
import { extractWebhookContent, ProcessedWebhook } from "@/lib/utils/webhook";
import { validateUserPlan } from "@/lib/validator/account";
import { Action, ChatbotResponseTone, SocialAccount, TriggerType } from "@prisma/client";

export const executeAction = async (
  webhook: ProcessedWebhook,
  action: Action | { type: "ChatBot"; content: string },
  accessToken: string
): Promise<boolean> => {
  try {
    switch (action.type) {
      case "COMMENT_REPLY":
        await sendReply(webhook.id, action.content, accessToken);
        
        break;
      case "MESSAGE_REPLY":
        if (webhook.type === TriggerType.COMMENT) {
          await sendMessageForComment(
            webhook.sender_id,
            webhook.recipient_id || "",
            action.content,
            accessToken
          );
        } else {
          await sendMessageForMessage(
            webhook.sender_id,
            webhook.recipient_id || "",
            action.content,
            accessToken
          );
        }
        break;
      case "ChatBot":
        const chatBot = await db.chatbot.findFirst({
          where: {
            socialAccountId: webhook.sender_id || "",
          },
          include: {
            socialAccount: true,
          },
        });

        if (!chatBot) {
          throw new Error("No chatbot found for this account");
         }

        const data = await generateContentGemini(
          chatBot.context || "",
          chatBot.responseTone || ChatbotResponseTone.Professional,
          chatBot.responseTemplate || "",
          action.content || ""
        );
        console.log("✅ reply from ai chatbot", data);
        if (!data) {

          throw new Error("Some thing went wrong with ai chatbot");
        }

        await sendMessageForMessage(
          webhook.sender_id,
          webhook.recipient_id || "",
          data.candidates[0].content.parts[0].text,
          accessToken
        );
        break;
      default:
        console.warn("Unhandled action type", { actionType: action });
        return false;
    }
    return true;
  } catch (error) {
    console.error("Error executing action:", error);
    return false;
  }
};

export const processWebhook = async (webhook: ProcessedWebhook) => {
  console.log("➡️ Processing   trigger webhook...");

  if (!webhook) throw new Error("No trigger found");

  const { type, content } = extractWebhookContent(webhook);
  if (!content) {
    throw new Error("No content found in webhook");
  }

  const data = await findTriggerAndAssociatedAutomation({
    type: type === "COMMENT" ? TriggerType.COMMENT : TriggerType.MESSAGE,
    keyword: content,
  });

  if (!data.length) {
    if (webhook.type === "MESSAGE") {

      if(webhook.sender_id === webhook.recipient_id) return null
      
      
      const account = await db.socialAccount.findFirst({
        where: {
          accountId: webhook.sender_id,
          
         },include: {
          chatbot: true,
          user: true
        }
         
      });

      if (!account || !account.chatbot) return console.log("❌ No matching Chatbot found");;

      await validateUserPlan(account.user,'ChatBot') 

      
      const validateToken = await validateInstagramToken(
        account as SocialAccount
      );

      if (!validateToken) return null;

        const success = await executeAction(
          webhook,
          { type: "ChatBot", content: content },
          account?.accessToken || ""
        )
       }
      console.log("No matching triggers found");

      return;
  } 


    await validateUserPlan(data[0].automation.account.user,type) 
    
    
    const validateToken = await validateInstagramToken(
      data[0].automation.account
    );

    if (!validateToken) return null;

    for (const account of data) {
      for (const action of account.automation.actions) {
        await executeAction(
          webhook,
          action,
          account.automation.account.accessToken || ""
        );
      }
    }
  }

  
 