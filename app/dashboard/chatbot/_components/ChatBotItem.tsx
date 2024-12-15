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

export const ChatBotItem = memo(({ id, accountIndex }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const submitRef = React.useRef<HTMLButtonElement>(null);
  
  
  const { accounts,handleEdit } = useChatbot();

  const chatBot = useMemo(()=>accounts[accountIndex]?.chatbot, [accounts, accountIndex]);
  
  const { control, handleSubmit, formState } = useForm<ChatbotFormData>({
    resolver: zodResolver(chatbotFormSchema),
    defaultValues:{
       name: accounts[accountIndex]?.chatbot?.name || '',
      context:  accounts[accountIndex]?.chatbot?.context || '',
      responseTone: accounts[accountIndex]?.chatbot?.responseTone || 'Professional',
      responseTemplate: accounts[accountIndex]?.chatbot?.responseTemplate || '',
      socialAccountId: accounts[accountIndex]?.id || '',
    },
  });
  
  
  if(!chatBot) return null;
  

   

  const handleSubmitClick =()=>{
     submitRef.current?.click();
   }

  const onSubmit = (data: ChatbotFormData) => {
     setIsEditing(false);
    handleEdit(data);
  };

 
  return  chatBot && (
    <Card key={id} className="group">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-medium">{chatBot?.name }</h4>
              <p className="text-sm text-muted-foreground">{chatBot?.context}</p>
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
          <form   action={""}  onSubmit={handleSubmit(onSubmit)}>
            <ChatbotForm control={control} errors={formState.errors} />
            <button ref={submitRef}   type="submit">Submit</button>
          </form>
        )}
        
      </CardContent>
    </Card>
  );
});

ChatBotItem.displayName = "ChatBotList";
