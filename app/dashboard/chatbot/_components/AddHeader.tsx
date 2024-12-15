 import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import {  memo, useState } from "react"
import { useChatbot } from "./Context";
import   ChatbotForm  from "./ChatbotForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChatbotFormData, chatbotFormSchema } from "@/lib/validator/chatbot"

 
export const AddHeader = memo(() => {
    console.log("AddHeader")

    const { 
        control, 
        handleSubmit, 
        formState 
      } = useForm<ChatbotFormData>({
        resolver: zodResolver(chatbotFormSchema),
        defaultValues: {
          responseTone: "Professional",
        }
      });



    const [openDialog, setOpenDialog] = useState(false);
    const { handleCreate } = useChatbot();

    
    const onSubmit = (data: ChatbotFormData) => {
        // Handle form submission logic
        console.log(data);
        setOpenDialog(false);
      };



  return (
    
    <Card >
        <CardContent className="pt-6">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Configure New Chatbot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md ">
              <DialogHeader>
                <DialogTitle>Configure Chatbot</DialogTitle>
                <DialogDescription>
                  Set up your Instagram chatbot responses. You can only have one
                  chatbot per account.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
              <ChatbotForm 
                     control={control} 
                     errors={formState.errors} 
          />
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Configuration</Button>
              </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
  )
})

AddHeader.displayName = 'AddHeader'