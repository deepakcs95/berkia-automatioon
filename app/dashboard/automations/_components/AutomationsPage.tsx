"use client";

import React, {
  useCallback,
  useRef,
    
} from "react";
import AddAutomationCard from "./AddAutomationCard";
import { AccountList } from "@/components/global/AccountList";
import { SocialAccountArrayType } from "@/lib/db/automations";
import AutomationItem from "./AutomationItem";
import { AutomationsType } from "@/lib/types";
import { useAutomationOptimistic } from "@/hooks/useOptimisticAutomations";
import { AutomationSchemaType } from "@/lib/validator/automation";
import dynamic from "next/dynamic";

import AutomationDialog from "@/components/global/DialogSection";
import FormSkeleton from "@/components/skeleton/FormSkeleton";

export const LazyAutomationForm = dynamic(() => import("./AutomationFrom"), {
  ssr: false,
  loading: () => <AutomationDialog openDialog={true} isEditing={false} setOpenDialog={() => {} }><FormSkeleton/></AutomationDialog>,
});

export interface CreateEditAutomationFormProps {
  accounts: SocialAccountArrayType;
}

export default function AutomationsPage({
  accounts,
}: CreateEditAutomationFormProps) {
    
    
    const [openDialog, setOpenDialog] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    // const [automation, setAutomation] = React.useState<AutomationsType|undefined>(undefined);
    const automationRef = useRef<AutomationsType | undefined>(undefined);
    
    
 

    const {
        optimisticAccounts,
        pendingAutomations,
        handleCreateAutomation,
        handleUpdateAutomation,
        handleDeleteAutomation
      } = useAutomationOptimistic(accounts);
  








      
  const onAddClick = useCallback(() => {
    automationRef.current = undefined;
    setIsEditing(false);
    setOpenDialog(true);
  }, []);

  const onEdit = useCallback((automation: AutomationsType) => {
    automationRef.current = automation;
    setOpenDialog(true);
    setIsEditing(true);
  }, []);

  
  const onCancel = useCallback(() => {
    setOpenDialog(false);
    setIsEditing(false);
  }, []);

  const onSubmit = useCallback(async (data: AutomationSchemaType, automation: AutomationsType) => {
     handleCreateAutomation(data);
   
      setOpenDialog(false);
      setIsEditing(false);
    
  }, [handleCreateAutomation]);
 
  const onSaveEdit = useCallback(async (data: AutomationSchemaType, automation: AutomationsType) => {
         handleUpdateAutomation(data, automation);
 
      setOpenDialog(false);
      setIsEditing(false);
      
    }, [handleUpdateAutomation])
    
    const onDelete = useCallback((automation: AutomationsType) => {
        handleDeleteAutomation(automation)
    }, [handleDeleteAutomation]);

 

  return (
    <div>
      <AddAutomationCard
        onClick={onAddClick}
        message={{
          title:   "Create New Automation",
          description:    "Create an automation based on a trigger and an action.",
          buttonText:   "Create  automation",
        }}
      />

       
      {optimisticAccounts.length > 0 && (
        <div  className="mt-4">
           {optimisticAccounts
      .filter(account => account.automations.length > 0)
      .map((account) => (
        <AccountList 
          key={account.accountId} 
          username={account.username}
          status={account.status}
        >
          {account.automations.map((automation) => (
            <AutomationItem
              key={automation.id}
              onDelete={onDelete}
              onEdit={onEdit}
              automation={automation}
              isPending={pendingAutomations.has(automation.id)}
            />
          ))}
        </AccountList>
      ))
    }
        </div>
      )}

      <div>
        <AutomationDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          isEditing={isEditing}
        >
          <LazyAutomationForm
            accounts={optimisticAccounts}
            onCancel={onCancel}
            onSubmit={isEditing ? onSaveEdit : onSubmit}
            automation={automationRef.current}
            submitText={isEditing ? "Save changes" : "Create automation"}
          />
        </AutomationDialog>
      </div>
       
    </div>
  );
}
