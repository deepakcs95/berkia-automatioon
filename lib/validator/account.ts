import { User, SocialAccount, Trigger, TriggerType } from '@prisma/client';
import { findSubscriptionPlanByUserId, findTriggerAndAssociatedAutomation, UserWithSubscriptionPlan } from '../db';

interface PlanValidationResult {
  isValid: boolean;
  error?: string;
}

export async function validateUserPlan(recivedUser: User , type:TriggerType | 'ChatBot') {
 
  const user = await findSubscriptionPlanByUserId(recivedUser.id)

  if (!user?.subscription || !user?.subscription?.plan ) {
    throw new Error('User is not subscribed to a plan')
  }

 switch (type) {
    case 'ChatBot':
      if (user.subscription.plan.maxChatBots < user.subscription.chatBotsUsed + 1 || user.subscription.plan.creditLimit < user.subscription.creditsUsed + 0) {
        throw new Error('You have reached your account limit for this subscription')
      }
      break;
    case 'COMMENT':
      if (user.subscription.plan.maxComments < user.subscription.commentsUsed + 1) {
        throw new Error('You have reached your account limit for this subscription')
      }
      break; 
   case 'MESSAGE':
      if (user.subscription.plan.maxMessages < user.subscription.messagesUsed + 1) {
        throw new Error('You have reached your account limit for this subscription')
      }
      break;
    default:
      throw new Error('Invalid trigger type');  
  }
 
  return    true
  
}

export async function validateUserCredits(user: User): Promise<PlanValidationResult> {
  // TODO: Implement credit validation logic
  // This would check if the user has enough credits for the action
  return {
    isValid: true
  };
}

export async function validateSocialToken(account: SocialAccount): Promise<PlanValidationResult> {
  if (!account.accessToken) {
    return {
      isValid: false,
      error: 'No access token found for social account'
    };
  }

  if (account.tokenExpiresAt && account.tokenExpiresAt < new Date()) {
    return {
      isValid: false,
      error: 'Social account token has expired'
    };
  }

  return {
    isValid: true
  };
}