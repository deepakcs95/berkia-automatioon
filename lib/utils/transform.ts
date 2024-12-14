import { v4 as uuidv4 } from 'uuid';
import { AutomationSchemaType } from '../validator/automation';
import { AutomationsType } from '../types';
import { ActionType } from '@prisma/client';

export function transformAutomationData(input: AutomationSchemaType): AutomationsType {
  const automationId = uuidv4();
  const now = new Date();

  return {
    id: automationId,
    name: `New Automation ${now}`,
    isActive: true,
    accountId: input.accountId,
    targetPosts: input.selectedPosts || [],
    createdAt: now,
    updatedAt: now,
    actions: [
      ...(input.commentAction ? [
        {
          id: uuidv4(),
          type: ActionType.COMMENT_REPLY,
          content: input.commentAction,
          automationId: automationId,
        },
      ] : []),
      ...(input.messageAction ? [
        {
          id: uuidv4(),
          type: ActionType.MESSAGE_REPLY,
          content: input.messageAction,
          automationId: automationId,
        },
      ] : []),
    ],
    triggers: {
      id: uuidv4(),
      type: input.triggerType,
      keyword: input.triggerKeyword,
      automationId: automationId,
    },
  };
}

export function transformAutomationEditData(
  data: AutomationSchemaType,
  existingAutomation: AutomationsType,
): AutomationsType {
  const now = new Date();

  return {
    id: existingAutomation.id,
    name: existingAutomation.name,
    isActive: existingAutomation.isActive,
    accountId: data.accountId,
    targetPosts: data.selectedPosts || existingAutomation.targetPosts,
    createdAt: existingAutomation.createdAt,
    updatedAt: now,
    actions: [
      ...(data.commentAction ? [
        {
          id: existingAutomation.actions[0]?.id || uuidv4(),
          type: ActionType.COMMENT_REPLY,
          content: data.commentAction,
          automationId: existingAutomation.id,
        },
      ] : []),
      ...(data.messageAction ? [
        {
          id: existingAutomation.actions[1]?.id || uuidv4(),
          type: ActionType.MESSAGE_REPLY,
          content: data.messageAction,
          automationId: existingAutomation.id,
        },
      ] : []),
    ],
    triggers: {
      id: existingAutomation.triggers?.id || uuidv4(),
      type: data.triggerType,
      keyword: data.triggerKeyword,
      automationId: existingAutomation.id,
    },
  };
}