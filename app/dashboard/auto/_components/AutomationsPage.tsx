"use client";

import React, {
  useCallback,
  useMemo,
  useOptimistic,
  useRef,
  useTransition,
} from "react";
import AddAutomationCard from "./AddAutomationCard";
import { AccountList } from "./AccountList";
import { SocialAccountArrayType } from "@/lib/db/automations";
import AutomationItem from "./AutomationItem";
import { AutomationDialog } from "./ui/DialogSection";
import AutomationForm from "./AutomationFrom";
import { AutomationsType } from "@/lib/types";
import { AutomationSchemaType } from "@/lib/validator/automation";
import { toast, Toaster } from "sonner";
import { createNewAutomation } from "@/app/actions/automations";
import { transformAutomationData } from "@/lib/utils/transform";

export interface CreateEditAutomationFormProps {
  accounts: SocialAccountArrayType;
}

export default function AutomationsPage({
  accounts,
}: CreateEditAutomationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticAccounts, setOptimisticAccounts] =
    useOptimistic<SocialAccountArrayType>(accounts);
  const [pendingAutomations, setPendingAutomations] = React.useState<
    Set<string>
  >(new Set());

  const [openDialog, setOpenDialog] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  // const [automation, setAutomation] = React.useState<AutomationsType|undefined>(undefined);

  const automationRef = useRef<AutomationsType | undefined>(undefined);

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

  const onDelete = useCallback(() => {}, []);

  const onCancel = useCallback(() => {
    setOpenDialog(false);
    setIsEditing(false);
  }, []);

  const onSubmit = useCallback(async (data: AutomationSchemaType) => {
    const updatedAccounts = [...optimisticAccounts];
    const temp =[...optimisticAccounts]
    const accountIndex = updatedAccounts.findIndex(
      (account) => account.account_id === data.account_Id
    );
    console.log("updatedAccounts", accountIndex, updatedAccounts);
    const transformedAutomation = transformAutomationData(data);
    setPendingAutomations((prev) =>
        new Set(prev).add(transformedAutomation.id)
      );
    startTransition(async () => {
      if (accountIndex !== -1) {
        updatedAccounts[accountIndex].automations.unshift(
          transformedAutomation
        );

        setOptimisticAccounts(updatedAccounts);
        
        
      }
    });

    setOpenDialog(false);
    setIsEditing(false);

    const success = await createNewAutomation(transformedAutomation);
    if (success.status === 200) {
      toast.success(success.message);
    } else {
      toast.error(success.message);
    }

    setPendingAutomations(prev => {
        const newSet = new Set(prev)
        newSet.delete(transformedAutomation.id)
        return newSet
      })


  }, [optimisticAccounts]);

  console.log(optimisticAccounts,pendingAutomations);
  
  const onsaveEdit = useCallback(() => {
    setOpenDialog(false);
    setIsEditing(false);
  }, []);

  if (!optimisticAccounts) {
    return (
      <div>
        <AddAutomationCard
          onClick={onAddClick}
          message={{
            title: "Create your first automation",
            description: "Get started by creating your first automation",
            buttonText: "Create  automation",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <AddAutomationCard
        onClick={onAddClick}
        message={{
          title: "Create New Automation",
          description: "Create an automation based on a trigger and an action.",
          buttonText: "New automation",
        }}
      />

      <div className="mt-4">
        {optimisticAccounts.map(
          (account) =>
            account.automations.length > 0 && (
              <AccountList key={account.id} account={account}>
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
            )
        )}
      </div>

      <div>
        <AutomationDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          isEditing={isEditing}
        >
          <AutomationForm
            accounts={optimisticAccounts}
            onCancel={onCancel}
            onSubmit={onSubmit}
            automation={automationRef.current}
            submitText={isEditing ? "Save changes" : "Create automation"}
          />
        </AutomationDialog>
      </div>
    </div>
  );
}