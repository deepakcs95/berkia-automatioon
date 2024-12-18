import { createNewChatBot, deleteChatBot, updateChatBot } from "@/app/actions/chatbot";
 import { InstagramAccountItem } from "@/lib/db";
import { ChatbotFormData } from "@/lib/validator/chatbot";
import { Chatbot } from "@prisma/client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useOptimistic,
  useTransition,
} from "react";
import { toast } from "sonner";

interface ChatbotContextType {
  accounts: InstagramAccountItem[];
  handleEdit: (data: ChatbotFormData) => void;
   handleDelete: (id: string) => void;
  handleCreate: (data: ChatbotFormData) => void;
  accountId: string;
  isPending: boolean
}

export const ChatbotContext = createContext<ChatbotContextType | undefined>(
  undefined
);

export function ChatbotProvider({
  children,
  initialAccounts,
}: {
  children: ReactNode;
  initialAccounts: InstagramAccountItem[];
}) {

  const [accountId, setAccountId] = useState("");
  const [isPending, startTransition] = useTransition();

  const [optimisticAccounts, setOptimisticAccounts] =
    useOptimistic(initialAccounts);

  const handleEdit = useCallback(async(data: ChatbotFormData) => {
    startTransition(() => {
      setAccountId(data.socialAccountId);
      const index = optimisticAccounts.findIndex(
        (account) => account.accountId === data.socialAccountId
      );

      console.log(data, index);

      setOptimisticAccounts((prev) => {
        const newAccounts = [...prev];
        newAccounts[index].chatbot = { id: "", ...data } as unknown as Chatbot;
        return newAccounts;
      });

    });

      try {
        const response = await updateChatBot(data);
        if (response.status === 200) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error updating chatbot:", error);
        toast.error("Error updating chatbot");
      }





  }, []);

  const handleCreate = useCallback(async (data: ChatbotFormData) => {
    startTransition(async () => {
      setAccountId(data.socialAccountId);
      const index = optimisticAccounts.findIndex(
        (account) => account.accountId === data.socialAccountId
      );

      console.log(data, index);

      setOptimisticAccounts((prev) => {
        const newAccounts = [...prev];
        newAccounts[index].chatbot = { id: "", ...data } as unknown as Chatbot;
        return newAccounts;
      });
    });

      try {
       const response = await createNewChatBot(data);

        if (response.status === 200) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error creating chatbot:", error);
        toast.error("Error creating chatbot");
      }
   }, []);
 
 
  const handleDelete = useCallback( async (socialAccountId: string) => {
    startTransition(  ( ) => {
      setAccountId(socialAccountId);
      setOptimisticAccounts((prev) => {
        const newAccounts = [...prev];
        const index = newAccounts.findIndex(account => account.accountId === socialAccountId);
        if (index !== -1) {
          newAccounts[index].chatbot = null;
        }
        console.log(newAccounts);
        
        return newAccounts;
      });
    });
       


try {
        const response = await deleteChatBot(socialAccountId);
        if (response.status === 200) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error deleting chatbot:", error);
        toast.error("Error deleting chatbot");
      }



     
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        accounts: optimisticAccounts,
        handleEdit,
         handleDelete,
        handleCreate,
        accountId,
        isPending
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}
