import { v4 as uuidv4 } from 'uuid';
import { AutomationSchemaType } from '../validator/automation';
import { AutomationsType } from '../types';
import { action_type } from '@prisma/client';

export function transformAutomationData(input: AutomationSchemaType): AutomationsType {
  const automationId = uuidv4();
  const now = new Date()

  return {
    id: automationId,
    name: `New Automation ${now}`,
    isActive: true,
    account_id: input.account_Id,
    target_posts: input.selectedPosts || [],
    created_at: now,
    updated_at: now,
    actions: [
      ...(input.comment_action ? [
        {
          id: uuidv4(),
          type: action_type.commentReply,
          content: input.comment_action,
          automation_id: automationId
        }
      ] : []),
      ...(input.message_action ? [
        {
          id: uuidv4(),
          type: action_type.messageReply,
          content: input.message_action,
          automation_id: automationId
        }
      ] : []),
    ],
    triggers: {
      id: uuidv4(),
      type: input.trigger_type,
      keyword: input.trigger_keyword,
      automation_id: automationId,
    },
  };
}

 