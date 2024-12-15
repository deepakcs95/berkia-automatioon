import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { useChatbot } from "./Context";
import ChatbotForm from "./ChatbotForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatbotFormData, chatbotFormSchema } from "@/lib/validator/chatbot";
import { UserWithSubscription } from "@/lib/db";

interface AddHeaderProps {
  user: UserWithSubscription;
}

export const AddHeader = memo(({ user }: AddHeaderProps) => {
   const { accounts, handleCreate } = useChatbot();

  const { control, handleSubmit, formState, reset, } = useForm<ChatbotFormData>({
    resolver: zodResolver(chatbotFormSchema),
    defaultValues: {
      socialAccountId: accounts[0]?.id || '',
       name: "dee",
      context: "ss",
      responseTone: "Professional",
      responseTemplate: "ss"

    },
  });

  const [openDialog, setOpenDialog] = useState(false);

  const onSubmit = (data: ChatbotFormData) => {
    console.log("Form Data:", data);
    handleCreate(data);
    setOpenDialog(false);
    reset();
  };

    
  const hasChatbot = useMemo(() => accounts.every((account) => account.chatbot !== null),[accounts]);
 

  return hasChatbot ? null : ( <Card>
      <CardContent className="pt-6">
        <Dialog open={openDialog} onOpenChange={setOpenDialog} >
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Configure New Chatbot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto mx-auto">
          <DialogHeader>
              <DialogTitle>Configure Chatbot</DialogTitle>
              <DialogDescription>
                Set up your Instagram chatbot responses. You can only have one
                chatbot per account.
              </DialogDescription>
            </DialogHeader>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <ChatbotForm control={control} errors={formState.errors} />
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="reset" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Configuration</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
});

AddHeader.displayName = "AddHeader";
