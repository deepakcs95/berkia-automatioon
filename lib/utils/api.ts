import { ChatbotResponseTone } from "@prisma/client";

export const sendReply = async (
    postId: string,
    message: string,
    accessToken: string
  ) => {
    const response = await fetch(
      `https://graph.instagram.com/${postId}/replies?message=${message}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (data.error) {
      console.log("❌ Reply send failed", data.error);
      return false;
    }
  
    console.log("✅ Reply sent successfully");
    return true;
  };
  
  export const sendMessageForMessage = async (
    senderId: string,
    recipientId: string,
    message: string,
    accessToken: string
  ) => {
    console.log("Sending message from message:", message);
    const response = await fetch(
      `https://graph.instagram.com/v21.0/${senderId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          recipient: {
            id: recipientId,
          },
          message: {
            text: message,
          },
        }),
      }
    );
    const data = await response.json();
  
    if (data.error) {
      console.log("❌ Message send failed", data.error);
      return false;
    }
  
    console.log("✅ Message sent successfully");
    return true;
  };
  export const sendMessageForComment = async (
    senderId: string,
    recipientId: string,
    message: string,
    accessToken: string
  ) => {
    console.log("Sending message from comment:", message);
    const response = await fetch(
      `https://graph.instagram.com/v21.0/${senderId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          recipient: {
            comment_id: recipientId,
          },
          message: {
            text: message,
          },
        }),
      }
    );
    const data = await response.json();
  
    if (data.error) {
      console.log("❌ Message send failed", data.error);
      return false;
    }
  
    console.log("✅ Message sent successfully");
    return true;
  };
  
  export const generateContentGemini = async (
    context: string,
    responseTone: ChatbotResponseTone,
    responseTemplate: string,
    message: string
  ) => {
    const body = {
      contents: [
        {
          parts: [
            {
              text: `You are an AI assistant for Instagram account management. Your role is to craft concise, engaging replies to direct messages based on the provided context.
  
  Instructions:
  Tone :${responseTone}
  Message Style: Keep responses short (1-2 sentences). Use emojis when the tone permits.
  constext:${context} 
  Message: ${message}
  ResponseTemplate:${responseTemplate}
  
  Important:
   - Keep responses short.
  - Use emojis when the tone permits.
  - Respond to any other question related to the provided context with a reply acknolwledging i dont have an answer.
  - Always be respectful.`,
            },
          ],
        },
      ],
    };
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    return data;
  };
  
   