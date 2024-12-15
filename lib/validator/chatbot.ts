import { ChatbotResponseTone } from "@prisma/client";
import { z } from "zod";

// Zod validation schema
export const chatbotFormSchema = z.object({
    accountId: z.string().min(1, "Account ID is required"),
    name: z.string().min(1, "Chatbot name is required"),
    context: z.string().min(1, "Context is required"),
    responseTone: z.enum([ChatbotResponseTone.Casual, ChatbotResponseTone.Friendly, ChatbotResponseTone.Professional], {
      required_error: "Please select a response tone"
    }),
    responseTemplate: z.string().min(1, "Response template is required")
  });
  
  
  export type ChatbotFormData = z.infer<typeof chatbotFormSchema>;
  