import { memo, useState, useCallback } from 'react';
import { ChatBotItem } from './ChatBotItem';
import { AccountList } from '@/components/global/AccountList';
import { InstagramAccountItem } from '@/lib/db';
import ChatbotForm  from './ChatbotForm';
import { useChatbot } from './Context';

 

export const ChatBotList = memo(( ) => {


const {accounts} = useChatbot()

  
  return (
    <div className="space-y-8">
       { accounts.map((account,index) =>{ return account.chatbot && (
        
        <AccountList
          key={account.id}
          username={account.username}
          status={account.status}
        >
          <ChatBotItem
          id={account.id}
          accountIndex={index}
             username={account.username}
          />
         </AccountList>
      )})}
    </div>
  );
});

ChatBotList.displayName = 'ChatBotList';