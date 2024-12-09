import { z } from 'zod';
  
  // Schemas
  const InstagramAccountSchema = z.object({
    id: z.string().min(1, "Instagram account must be selected"),
  });
  
  const TriggerSchema = z.object({
    type: z.enum(['comment', 'message'], { 
      errorMap: () => ({ message: "Invalid trigger type" }) 
    }),
    keyword: z.string().min(1, "Trigger keyword is required")
  });
  
  const ActionSchema = z.object({
    type: z.enum(['commentReply', 'messageReply'], { 
      errorMap: () => ({ message: "Invalid action type" }) 
    }),
    content: z.string().min(1, "Reply content is required") 
  });
  
  const MultiActionSchema = z.object({
    commentReply: z.optional(ActionSchema),
    messageReply: z.optional(ActionSchema)
  });
  
  // State Type
 
  

  export const AutomationSchema = z.object({
    account: InstagramAccountSchema,
    trigger: TriggerSchema,
    actions:MultiActionSchema,
    postSelection: z.discriminatedUnion('triggerType', [
      z.object({
        triggerType: z.literal('message'),
        postIds: z.array(z.string()).optional()
      }),
      z.object({
        triggerType: z.literal('comment'),
        postIds: z.array(z.string()).min(1, "At least one post must be selected for comment trigger")
      })
    ])
  }).superRefine((state, ctx) => {
    const { trigger, actions } = state;

    if (trigger?.type === "comment") {
      if (!actions.commentReply && !actions.messageReply) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actions"],
          message: "At least one action must be set for comment trigger",
        }) 
      }
    }else if (trigger?.type === "message") {
      if(!actions.messageReply) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actions"],
          message: "Message reply action must be set for message trigger",
        })
      }
      if(actions.commentReply) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actions"],
          message: "Comment reply action cannot be set for message trigger",
        })
      }
    }
  });   