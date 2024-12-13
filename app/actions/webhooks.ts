import { db } from "@/lib/db/prisma";
import { validateInstagramToken } from "@/lib/Integration/social-account-auth";
import { CommentWebhook, matchWebhookTriggerType, MessageWebhook, ProcessedCommentWebhook, ProcessedMessageWebhook, ProcessedWebhook } from "@/lib/utils/webhook"
import { validateUserPlan } from "@/lib/validator/account";
import { Action, social_connection_status, trigger_type } from "@prisma/client";
import { Award } from "lucide-react";




 


export const processWebhook = async (webhook: ProcessedWebhook) => {
 
  console.log('➡️ Processing   trigger webhook...');
   
 
  if(!webhook) throw new Error('No trigger found');
  
  const { type, content } = extractWebhookContent(webhook);
  if (!content) {
    throw new Error('No content found in webhook');
  }

 const data = await findTriggerAndAssociatedAutomation({ type: type === 'comment' ? trigger_type.comment : trigger_type.message, keyword: content}) 

 if (!data.length) {
  console.log('No matching triggers found');
  return;
}
 
 
 if(!validateUserPlan(data[0].automation.account.user)) throw new Error('User plan is not valid');
    
    const validateToken =await validateInstagramToken(data[0].automation.account)

    if(!validateToken) return null


    for(const account of data ){
      for(const action of account.automation.actions) {
        await executeAction(webhook,action,account.automation.account.access_token || '')
      }
    }
     
    
  }
  
  
  export async  function findTriggerAndAssociatedAutomation({type, keyword}: {type:trigger_type, keyword: string}) {
   return  await db.trigger.findMany({
      where: {
        type: type,
        keyword: keyword,
        automation: {
          isActive: true,
          account: {
            status: social_connection_status.CONNECTED
          }
        }
      },
      include: {
        automation: {
          include: {
            account: {
              include: {
                user: true
              },
            },
            actions: true
          }
        }
      }
    });}



function extractWebhookContent(webhook: ProcessedWebhook): {
  type: trigger_type;
  content: string | undefined;
} {
  if (webhook.type === trigger_type.comment) {
    return {
      type: trigger_type.comment,
      content: webhook.comment
    };
  } else {
    return {
      type: trigger_type.message,
      content: webhook.message
    };
  }
}


export const executeAction = async (webhook: ProcessedWebhook,action: Action, accessToken: string) => {

    switch(action.type) {
      case 'commentReply':
        sendReply(webhook.id, action.content,   accessToken);
        break;
      case 'messageReply':
        if(webhook.type === 'comment'){sendMessageForComment(webhook.sender_id, webhook.recipient_id || '',action.content,  accessToken)}
       else {sendMessageForMessage(webhook.sender_id, webhook.recipient_id || '',action.content,  accessToken);}
        break;
      default:
        console.warn('Unhandled action type', { actionType: action.type });
    }

}

const sendReply = async (postId: string, message: string,   accessToken: string) => {
  const response = await fetch(`https://graph.instagram.com/${postId}/replies?message=${message}`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${accessToken}`,
     },
      
   });

   const data = await response.json();

   if(data.error) {
    console.log('❌ Reply send failed', data.error);
    return false
   }

   console.log('✅ Reply sent successfully');
   return true
};

const sendMessageForMessage = async (senderId: string, recipientId: string, message: string, accessToken: string) => {
   console.log('Sending message from message:', message);
  const response = await fetch(`https://graph.instagram.com/v21.0/${senderId}/messages`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${accessToken}`,
     },
     body: JSON.stringify({
       recipient: {
        id: recipientId,
       },
       message: {
         text: message,
       },
     }),
      
   });
  const data = await response.json();

  if(data.error) {
    console.log('❌ Message send failed', data.error);
    return false
   }

   console.log('✅ Message sent successfully');
   return true
   
}; 
const sendMessageForComment = async (senderId: string, recipientId: string, message: string, accessToken: string) => {
   console.log('Sending message from comment:', message);
  const response = await fetch(`https://graph.instagram.com/v21.0/${senderId}/messages`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${accessToken}`,
     },
     body: JSON.stringify({
       recipient: {
        comment_id: recipientId,
       },
       message: {
         text: message,
       },
     }),
      
   });
  const data = await response.json();

  if(data.error) {
    console.log('❌ Message send failed', data.error);
    return false
   }

   console.log('✅ Message sent successfully');
   return true
   
}; 
 

 
 