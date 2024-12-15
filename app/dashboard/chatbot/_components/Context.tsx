 



import { InstagramAccountItem } from '@/lib/db';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ChatbotContextType {
  accounts: InstagramAccountItem[];
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  handleEdit: (id: string) => void;
  handleCancel: () => void;
  handleDelete: (id: string) => void;
  handleCreate: (id: string) => void;
}

export const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children, initialAccounts }: { children: ReactNode, initialAccounts: InstagramAccountItem[] }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = useCallback((id: string) => {
    setEditingId(id);
  }, []);
  
  
  const handleCreate = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
  }, []);

  return (
    <ChatbotContext.Provider value={{
      accounts,
      editingId,
      setEditingId,
      handleEdit,
      handleCancel,
      handleDelete,
      handleCreate
    }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}