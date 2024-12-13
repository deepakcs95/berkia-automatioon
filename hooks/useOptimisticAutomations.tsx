"use client";

import { SocialAccountArrayType } from "@/lib/db/automations";
import { AutomationsType } from "@/lib/types";
import { AutomationSchemaType } from "@/lib/validator/automation";
import { useOptimistic, useState, useTransition, useCallback } from "react";
import { toast } from "sonner";
import { createNewAutomation, deleteAutomationAction, updateAutomationAction } from "@/app/actions/automations";
import { transformAutomationData, transformAutomationEditData } from "@/lib/utils/transform";

export function useAutomationOptimistic(initialAccounts: SocialAccountArrayType) {
  const [isPending, startTransition] = useTransition();
  const [optimisticAccounts, setOptimisticAccounts] = useOptimistic<SocialAccountArrayType>(initialAccounts);
  const [pendingAutomations, setPendingAutomations] = useState<Set<string>>(new Set());

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
      account => account.account_id === accountId
    );

    if (accountIndex !== -1) {
      updatedAccounts[accountIndex].automations.unshift(automation);
      setOptimisticAccounts(updatedAccounts);
    }
  }, [optimisticAccounts]);

  const updateOptimisticAutomation = useCallback((accountId: string, automation: AutomationsType) => {
    const updatedAccounts = [...optimisticAccounts];
    const accountIndex = updatedAccounts.findIndex(
      account => account.account_id === accountId
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

    startTransition(() => {
      addOptimisticAutomation(data.account_Id, transformedAutomation);
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

    startTransition(() => {
      updateOptimisticAutomation(data.account_Id, transformedAutomation);
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
    const accountId = automation.account_id;
    
    setPendingAutomation(automationId);

    startTransition(() => {
      removeOptimisticAutomation(accountId, automationId);
    });

    try {
      const success = await deleteAutomationAction(automationId);
      if (success.status === 200) {
        toast.success(success.message);
      } else {
        toast.error(success.message);
         const account = optimisticAccounts.find(acc => acc.account_id === accountId);
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

  return {
    isPending,
    optimisticAccounts,
    pendingAutomations,
    handleCreateAutomation,
    handleUpdateAutomation,
    handleDeleteAutomation
  };
}