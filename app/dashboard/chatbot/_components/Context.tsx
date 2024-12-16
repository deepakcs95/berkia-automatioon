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
  handleCancel: () => void;
  handleDelete: (id: string) => void;
  handleCreate: (data: ChatbotFormData) => void;
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
  const [isPending, startTransition] = useTransition();

  const [optimisticAccounts, setOptimisticAccounts] =
    useOptimistic(initialAccounts);

  const handleEdit = useCallback(async(data: ChatbotFormData) => {
    startTransition(() => {
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





  }, [optimisticAccounts]);

  const handleCreate = useCallback(async (data: ChatbotFormData) => {
    startTransition(async () => {
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
<<<<<<<<< Temporary merge branch 1
  }, []);
=========
  }, [optimisticAccounts]);
>>>>>>>>> Temporary merge branch 2

  const handleCancel = useCallback(() => {}, []);

  const handleDelete = useCallback( async (socialAccountId: string) => {
    startTransition(  ( ) => {
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



     
  }, [optimisticAccounts]);

  return (
    <ChatbotContext.Provider
      value={{
        accounts: optimisticAccounts,
        handleEdit,
        handleCancel,
        handleDelete,
        handleCreate,
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
