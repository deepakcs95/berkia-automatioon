import { z } from 'zod';
  
 
export const AutomationSchema = z.object({
  account_Id: z.string().min(1, "Account ID is required"),
  trigger_type: z.enum(['comment', 'message'], { 
    errorMap: () => ({ message: "Invalid trigger type" }) }),
  trigger_keyword:z.string().min(1, "Trigger keyword is required").max(10, "Trigger keyword must be less than 10 characters"),
  comment_action:z.string().max(30, "Comment action must be less than 30 characters").optional(),
  message_action:z.string().max(100, "Message action must be less than 100 characters").optional(),
  selectedPosts: z.array(z.string()).optional()
}).superRefine((state, ctx) => {
  const { trigger_keyword, comment_action,message_action ,trigger_type,selectedPosts} = state;

  // Only validate if triggers exists
  if (trigger_type && trigger_keyword) {
    if (trigger_type === "comment") {
      if (!comment_action && !message_action) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["comment_action"],
          message: "At least one action must be set for comment trigger",
        }) 
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["message_action"],
          message: "At least one action must be set for comment trigger",
        }) 
      }
      if (!(selectedPosts &&selectedPosts?.length > 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["selectedPosts"],
          message: "At least one post must be selected for comment trigger",
        });
      }
    } else if (trigger_type === "message") {
      if (!message_action) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["message_action"],
          message: "Message reply action must be set for message trigger",
        })
      }
      
      if (comment_action   ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["comment_action"],
          message: "Comment reply action cannot be set for message trigger",
        })
      }
    }
  } else {
    // If no triggers are set, require them
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["trigger_type"],
      message: "Trigger type must be set",
    });
  }
});   

export type AutomationSchemaType = z.infer<typeof AutomationSchema>




