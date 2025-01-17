import { ActionType, Plan, Subscription, SubscriptionStatus } from "@prisma/client";

export type userActions = "createAccount" | "createAutomation" | "createChatbot";
// Define the validation function
type ValidationFunction = {
  subscription: Subscription,
  plan: Plan,
  action: ActionType | userActions,
  requiredCredits?: number
}

export function validateSubscriptionForUser(
  {subscription , 
  plan ,
  action ,
  requiredCredits = 1  }: ValidationFunction
): { isValid: boolean; message: string } {

  
  
  
   const currentDate = new Date();
  if ( subscription.status !== SubscriptionStatus.ACTIVE || subscription.startDate > currentDate || subscription.endDate < currentDate) {
    return {
      isValid: false,
      message: "Your subscription is inactive or expired. Please renew to continue.",
    };
  }

  switch(action) {
    case "createAutomation":
      if(plan.maxAutomations < subscription.automationsUsed + 1) {
        return {
          isValid: false,
          message: "You have reached your account limit for this subscription.",
        };
      }
      break;
    case "createAccount":
    if(plan.maxAccounts < subscription.accountsUsed + 1) {
        return {
          isValid: false,
          message: "You have reached your account limit for this subscription.",
        };
      }
      break;  
    case "createChatbot":
      if(plan.maxChatBots < subscription.chatBotsUsed + 1) {
        return {
          isValid: false,
          message: "You have reached your chatbot limit for this subscription.",
        };
      }
      break;  

    case "COMMENT_REPLY": {
      if (subscription.commentsUsed >=  plan.maxComments) {
        return {
          isValid: false,
          message: "You have reached your comment limit for this subscription.",
        };
      }
      break;
    }
    case "MESSAGE_REPLY": {
      if (subscription.messagesUsed >=  plan.maxMessages) {
        return {
          isValid: false,
          message: "You have reached your message limit for this subscription.",
        };
      }
      break;
    }
    
    default: {
      return {
        isValid: false,
        message: "Invalid action type.",
      };
    }
  }

  // // If all validations pass
  return {
    isValid: true,
    message: "Action is allowed under your current subscription plan.",
  };
}
