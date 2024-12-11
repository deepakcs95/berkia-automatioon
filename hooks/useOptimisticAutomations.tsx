"use client";

import { SocialAccountArrayType } from "@/lib/db/automations";
import { AutomationsType } from "@/lib/types";
import { useOptimistic, useState } from "react";

export function useAutomationOptimistic(initialAccounts: SocialAccountArrayType) {
  const [optimisticAccounts, setOptimisticAccounts] = useOptimistic<SocialAccountArrayType>(initialAccounts);
  const [pendingAutomations, setPendingAutomations] = useState<Set<string>>(new Set());

  const setPendingAutomation = (automationId: string) => {
    setPendingAutomations(prev => new Set(prev).add(automationId));
  };

  const removePendingAutomation = (automationId: string) => {
    setPendingAutomations(prev => {
      const newSet = new Set(prev);
      newSet.delete(automationId);
      return newSet;
    });
  };

  const addOptimisticAutomation = (accountId: string, automation: AutomationsType) => {
    const updatedAccounts = [...optimisticAccounts];
    const accountIndex = updatedAccounts.findIndex(
      account => account.account_id === accountId
    );

    if (accountIndex !== -1) {
      updatedAccounts[accountIndex].automations.unshift(automation);
      setOptimisticAccounts(updatedAccounts);
    }
  };

  const updateOptimisticAutomation = (accountId: string, automation: AutomationsType) => {
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
  };

  return {
    optimisticAccounts,
    pendingAutomations,
    setPendingAutomation,
    removePendingAutomation,
    addOptimisticAutomation,
    updateOptimisticAutomation
  };
}