import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import React, { memo, useMemo, useState } from "react";
import { AccountActions } from "./AccountActions";
import  ChatbotForm from "./ChatbotForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChatbot } from "./Context";
import { ChatbotFormData, chatbotFormSchema } from "@/lib/validator/chatbot";

interface Props {
  id: string;
  accountIndex: number;
  username: string;
}

export const ChatBotItem = memo(({ id, accountIndex, username }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const { accounts } = useChatbot();

  const defaultValues = useMemo(
    () =>
      accounts && accounts.length > 0
        ? {
            accountId: accounts[accountIndex].id || '',
            name: accounts[accountIndex].chatbot?.name || '',
            context: accounts[accountIndex].chatbot?.context || '',
            responseTone: accounts[accountIndex].chatbot?.responseTone || 'Professional',
            responseTemplate: accounts[accountIndex].chatbot?.responseTemplate || ''
          }
        : {
            accountId: '',
            name: '',
            context: '',
            responseTone: 'Professional',
            responseTemplate: ''
          } as ChatbotFormData,
    [accounts, accountIndex]
  );

  console.log(defaultValues);
  
  const { control, handleSubmit, formState } = useForm<ChatbotFormData>({
    resolver: zodResolver(chatbotFormSchema),
    defaultValues,
  });

  const handleSubmitClick =()=>{
    console.log("edit clicked");

    handleSubmit(onSubmit)();
  }

  const onSubmit = (data: ChatbotFormData) => {
    console.log(data);
    setIsEditing(false);
  };

  return (
    <Card key={id} className="group">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-medium">{username}</h4>
              <p className="text-sm text-muted-foreground"></p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AccountActions
              id={id}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleSubmitClick={handleSubmitClick}
            />
          </div>
        </div>
        {isEditing && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ChatbotForm control={control} errors={formState.errors} />
          </form>
        )}
      </CardContent>
    </Card>
  );
});

ChatBotItem.displayName = "ChatBotList";
