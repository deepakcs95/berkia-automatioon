import { ActionType, Prisma, TriggerType } from '@prisma/client';
import { z } from 'zod';
  
 
export const AutomationSchema = z.object({
  accountId: z.string().min(1, "Account ID is required"),
  triggerType: z.enum([TriggerType.COMMENT, TriggerType.MESSAGE], { 
    errorMap: () => ({ message: "Invalid trigger type" }) }),
  triggerKeyword: z.string().min(1, "Trigger keyword is required").max(10, "Trigger keyword must be less than 10 characters"),
  commentAction: z.string().max(30, "Comment action must be less than 30 characters").optional(),
  messageAction: z.string().max(100, "Message action must be less than 100 characters").optional(),
  selectedPosts: z.array(z.string()).optional()
}).superRefine((state, ctx) => {
  const { triggerKeyword, commentAction, messageAction, triggerType, selectedPosts } = state;

  // Only validate if triggers exists
  if (triggerType && triggerKeyword) {
    if (triggerType === TriggerType.COMMENT) {
      if (!commentAction && !messageAction) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["commentAction"],
          message: "At least one action must be set for comment trigger",
        }) 
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["messageAction"],
          message: "At least one action must be set for comment trigger",
        }) 
      }
      if (!(selectedPosts && selectedPosts.length > 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["selectedPosts"],
          message: "At least one post must be selected for comment trigger",
        });
      }
    } else if (triggerType === TriggerType.MESSAGE) {
      if (!messageAction) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["messageAction"],
          message: "Message reply action must be set for message trigger",
        })
      }
      
      if (commentAction) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["commentAction"],
          message: "Comment reply action cannot be set for message trigger",
        })
      }
    }
  } else {
    // If no triggers are set, require them
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["triggerType"],
      message: "Trigger type must be set",
    });
  }
});   

export type AutomationSchemaType = z.infer<typeof AutomationSchema>
 
export const AutomationValidator = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean(),
  accountId: z.string().min(1, "Account ID is required"),
  targetPosts: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  actions: z.array(
    z.object({
      id: z.string().uuid(),
      type: z.enum([ActionType.COMMENT_REPLY, ActionType.MESSAGE_REPLY]),
      content: z.string().min(1, "Action content is required"),
      automationId: z.string().uuid(),
    })
  ),
  triggers: z.object({
    id: z.string().uuid(),
    type: z.enum([TriggerType.COMMENT, TriggerType.MESSAGE]),
    keyword: z.string().min(1, "Trigger keyword is required"),
    automationId: z.string().uuid(),
  }),
});

 
export type AutomationValidatorType = z.infer<typeof AutomationValidator>
