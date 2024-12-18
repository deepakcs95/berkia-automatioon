"use client";

import { SocialAccountArrayType } from "@/lib/db/automations";
import { AutomationsType } from "@/lib/types";
import { AutomationSchemaType } from "@/lib/validator/automation";
import { useOptimistic, useState, useTransition, useCallback, ReactNode, useRef } from "react";
import { toast } from "sonner";
import { createNewAutomation, deleteAutomationAction, updateAutomationAction } from "@/app/actions/automations";
import { transformAutomationData, transformAutomationEditData } from "@/lib/utils/transform";
import { createContext, useContext } from "react";

interface AutomationContextType {
  openForm:boolean
  isEditing:boolean,
  isPending:boolean,
  editingAutomation:AutomationsType|null
  setOpenForm:(open:boolean)=>void,
  openCreateAutomationForm: ()=>void,
  openEditAutomationForm: (automation:AutomationsType)=>void,
    optimisticAccounts:SocialAccountArrayType,
    pendingAutomations:Set<string>,
    handleCreateAutomation:(automation:AutomationSchemaType)=>void,
    handleUpdateAutomation:(data: AutomationSchemaType, automation: AutomationsType)=>void,
    handleDeleteAutomation:(automation: AutomationsType )=>void
}


 export const AutomationContext = createContext<AutomationContextType | undefined>(
  undefined
);



export function AutomationProvider({children, initialAccounts}: {children: ReactNode, initialAccounts: SocialAccountArrayType}) {
 
  const [openForm, setOpenForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const editingAutomation = useRef<AutomationsType | null>(null);
  const [pendingAutomations, setPendingAutomations] = useState<Set<string>>(new Set());
 

  const [isPending, startTransition] = useTransition();
  const [optimisticAccounts, setOptimisticAccounts] = useOptimistic<SocialAccountArrayType>(initialAccounts);

 const openCreateAutomationForm = useCallback(() => {
    setOpenForm(true);
    setIsEditing(false);
    editingAutomation.current = null;
  }, []);

 const closeAutomationForm = useCallback(() => {
    setOpenForm(false);
    setIsEditing(false);
  }, []);

  const openEditAutomationForm = useCallback((automation:AutomationsType) => {
 
    if (automation){
        editingAutomation.current = automation  
        setOpenForm(true);
        setIsEditing(true);
    }else console.log('no automation found');
    
  }, []);


  
 
  const setPendingAutomation = useCallback((automationId: string) => {
    setPendingAutomations(prev => new Set(prev).add(automationId));
  }, []);

  const removePendingAutomation = useCallback((automationId: string) => {
    setPendingAutomations(prev => {
      const newSet = new Set(prev);
      newSet.delete(automationId);
      return newSet;
    });
  }, []);

  const addOptimisticAutomation = useCallback((accountId: string, automation: AutomationsType) => {
    const updatedAccounts = [...optimisticAccounts];
    const accountIndex = updatedAccounts.findIndex(
      account => account.accountId === accountId
    );

    if (accountIndex !== -1) {
      updatedAccounts[accountIndex].automations.unshift(automation);
      setOptimisticAccounts(updatedAccounts);
    }
  }, [optimisticAccounts]);

  const updateOptimisticAutomation = useCallback((accountId: string, automation: AutomationsType) => {
    const updatedAccounts = [...optimisticAccounts];
    const accountIndex = updatedAccounts.findIndex(
      account => account.accountId === accountId
    );

    if (accountIndex !== -1) {
      const automationIndex = updatedAccounts[accountIndex].automations.findIndex(
        auto => auto.id === automation.id
      );

      if (automationIndex !== -1) {
        updatedAccounts[accountIndex].automations[automationIndex] = automation;
        setOptimisticAccounts(updatedAccounts);
      }
    }
  }, [optimisticAccounts]);

  const removeOptimisticAutomation = useCallback((accountId: string, automationId: string) => {
    const updatedAccounts = [...optimisticAccounts];
    const accountIndex = updatedAccounts.findIndex(
      account => account.id === accountId
    );

    
    if (accountIndex !== -1) {
      updatedAccounts[accountIndex].automations = updatedAccounts[accountIndex].automations.filter(
        automation => automation.id !== automationId
      );
      setOptimisticAccounts(updatedAccounts);
    }
  }, [optimisticAccounts]);

  const handleCreateAutomation = useCallback(async (data: AutomationSchemaType) => {
    const transformedAutomation = transformAutomationData(data);
    setPendingAutomation(transformedAutomation.id);
    closeAutomationForm()
    startTransition(() => {
      addOptimisticAutomation(data.accountId, transformedAutomation);
    });

    const success = await createNewAutomation(transformedAutomation);
    if (success.status === 200) {
      toast.success(success.message);
    } else {
      toast.error(success.message);
    }
    
    removePendingAutomation(transformedAutomation.id);
    return success;
  }, [addOptimisticAutomation, setPendingAutomation, removePendingAutomation]);

  const handleUpdateAutomation = useCallback(async (data: AutomationSchemaType, automation: AutomationsType) => {
    const transformedAutomation = transformAutomationEditData(data, automation);
    setPendingAutomation(transformedAutomation.id);
    closeAutomationForm()

    startTransition(() => {
      updateOptimisticAutomation(data.accountId, transformedAutomation);
    });

    const success = await updateAutomationAction(transformedAutomation);
    if (success.status === 200) {
      toast.success(success.message);
    } else {
      toast.error(success.message);
    }

    removePendingAutomation(transformedAutomation.id);
    return success;
  }, [updateOptimisticAutomation, setPendingAutomation, removePendingAutomation]);



  const handleDeleteAutomation = useCallback(async (automation: AutomationsType ) => {
   const automationId = automation.id;
    const accountId = automation.accountId;
    
    setPendingAutomation(automationId);
    closeAutomationForm()

    startTransition(() => {
      removeOptimisticAutomation(accountId, automationId);
    });

    try {
      const success = await deleteAutomationAction(automationId);
      if (success.status === 200) {
        toast.success(success.message);
      } else {
        toast.error(success.message);
         const account = optimisticAccounts.find(acc => acc.accountId === accountId);
        if (account) {
          const automation = account.automations.find(auto => auto.id === automationId);
          if (automation) {
            addOptimisticAutomation(accountId, automation);
          }
        }
      }
      return success;
    } finally {
      removePendingAutomation(automationId);
    }
  }, [removeOptimisticAutomation, setPendingAutomation, removePendingAutomation]);

  return  (
    <AutomationContext.Provider value={{
    isPending,
    openForm,
    isEditing,
    setOpenForm,
    optimisticAccounts,
    editingAutomation : editingAutomation.current,
    pendingAutomations,
    handleCreateAutomation,
    handleUpdateAutomation,
    handleDeleteAutomation,
    openEditAutomationForm,
    openCreateAutomationForm
  }}
  >
    {children}
  </AutomationContext.Provider>)
}

export function useAutomation() {
  const context = useContext(AutomationContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a AutomationContextProvider");
  }
  return context;
}
