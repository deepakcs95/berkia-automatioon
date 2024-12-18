"use client";

 import { InstagramAccountItem, UserWithSubscription } from "@/lib/db";
 
 
   import { AddHeader } from "./AddHeader";
   import { ChatBotList } from "./ChatBotList";
import { ChatbotProvider } from "../../../../hooks/useChatBot";

interface Props {
   accounts: InstagramAccountItem[];
}

export default function ChatBotPage({ accounts }: Props) {
   


  return (
    <>
    <ChatbotProvider initialAccounts={accounts}>
      <AddHeader  />
      <ChatBotList     />
    </ChatbotProvider>
    </>
  );
}
