import { processWebhook } from "@/app/actions/webhooks";
import { db } from "../db/prisma";

export interface CommentWebhook {
    id: string;
    time: number;
    changes: Array<{
      value: {
        from: {
          id: string;
          username?: string;
        };
        media?: {
          id: string;
          media_product_type: string;
        };
        id: string;
        parent_id?: string;
        text: string;
      };
      field: string;
    }>;
  }
  
  export interface MessageWebhook {
    time: number;
    id: string;
    messaging: Array<{
      sender: {
        id: string;
      };
      recipient: {
        id: string;
      };
      timestamp: number;
      message: {
        mid: string;
        text: string;
      };
    }>;
  }

  export interface ProcessedCommentWebhook {
    type: 'comment';
    id: string;
    comment: string | undefined;
    sender_id: string  
    recipient_id: string | undefined;
  }
  
  export interface ProcessedMessageWebhook {
    type: 'message';
    id: string;
    message: string | undefined;
    sender_id: string;
    recipient_id: string;
    timestamp: number;
  }
  
  export type ProcessedWebhook = ProcessedCommentWebhook | ProcessedMessageWebhook;

  
  export function matchWebhookTriggerType(webhookData: CommentWebhook | MessageWebhook): ProcessedWebhook | null {
    try {
      // Check if it's a comment webhook
      if ('changes' in webhookData && Array.isArray(webhookData.changes)) {
        const commentData = webhookData.changes[0]?.value;
        
        // Ignore nested replies by checking for parent_id
        if (commentData?.parent_id) {
          return null;
        }
        
        const processedComment: ProcessedCommentWebhook = {
          type: 'comment',
          id:  webhookData?.id  ?? '',
          comment: commentData?.text ?? '',
          sender_id: webhookData?.id ?? '',
          recipient_id: commentData?.id
        };
        
        return processedComment;
      }
      
      // Check if it's a message webhook
      if ('messaging' in webhookData && Array.isArray(webhookData.messaging)) {
        const messageData = webhookData.messaging[0];
        
        if (!messageData) {
          throw new Error('No message data found in the webhook');
        }
        
        const processedMessage: ProcessedMessageWebhook = {
          type: 'message',
          id: webhookData?.id  ?? '',
          message: messageData.message.text,
          sender_id:webhookData?.id ?? '',
          recipient_id: messageData.sender.id ?? '',
          timestamp: messageData.timestamp
        };
        
        return processedMessage;
      }
      
      // Invalid or unrecognized webhook
      throw new Error('Invalid or unrecognized webhook format');
    } catch (error) {
      console.error('Error processing webhook:', error);
      return null;
    }
  }
  // Example usage and test cases
  async function main() {
    // Comment webhook (non-nested)
    const commentWebhook: CommentWebhook = {
      id: "17841470800772554",
      time: 1733997837,
      changes: [
        {
          value: {
            from: { id: "1082475449920958", username: "deepak_cs" },
            media: { id: "18045458246139896", media_product_type: "FEED" },
            id: "18029288096609816",
            text: "comment"
          },
          field: "comments"
        }
      ]
    };
  
    // Comment webhook (nested reply - should be ignored)
    const nestedCommentWebhook: CommentWebhook = {
      id: "17841470800772554",
      time: 1733997837,
      changes: [
        {
          value: {
            from: { id: "1082475449920958", username: "deepak_cs" },
            media: { id: "18045458246139896", media_product_type: "FEED" },
            id: "18029288096609816",
            parent_id: "17890681704136818", // This will cause the webhook to be ignored
            text: "sdsdsd"
          },
          field: "comments"
        }
      ]
    };
  
    // Message webhook
    const messageWebhook: MessageWebhook = {
      time: 1733998064122,
      id: "17841470800772554",
      messaging: [
        {
          sender: { id: "1082475449920958" },
          recipient: { id: "17841470800772554" },
          timestamp: 1733998063523,
          message: {
            mid: "message_mid",
            text: "Hi"
          }
        }
      ]
    };
  
    // Demonstrating webhook processing
    console.log("Comment Webhook:");
    console.log(  matchWebhookTriggerType(commentWebhook));
    
    // // console.log("\nNested Comment Webhook:");
    // console.log(matchWebhookTriggerType(nestedCommentWebhook));
    
    // // console.log("\nMessage Webhook:");
    // console.log(matchWebhookTriggerType(messageWebhook));
    const  Webhook =   matchWebhookTriggerType(commentWebhook);
    if(!Webhook) throw new Error('No trigger found');
    await processWebhook(Webhook)
  }
  
//  main();
  