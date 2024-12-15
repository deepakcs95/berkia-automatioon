"use client";

 import { InstagramAccountItem, UserWithSubscription } from "@/lib/db";
 
 
   import { AddHeader } from "./AddHeader";
   import { ChatBotList } from "./ChatBotList";
import { ChatbotProvider } from "./Context";

interface Props {
  user: UserWithSubscription;
  accounts: InstagramAccountItem[];
}

export default function ChatBotPage({ user, accounts }: Props) {
   


  return (
    <>
    <ChatbotProvider initialAccounts={accounts}>

      <AddHeader />
      <ChatBotList     />
    </ChatbotProvider>
    </>
  );
}
