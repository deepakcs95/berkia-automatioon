'use client'

import { AutomationProvider } from '@/hooks/useAutomation'
import { SocialAccountArrayType } from '@/lib/db';
import React from 'react'
import AddAutomationCard from './AddAutomationCard';
import AutomationDialog from './AutomationDialogSection';
import { AccountList } from '@/components/global/AccountList';
import AutomationItem from './AutomationItem';
import AutomationList from './AutomationList';

interface Props {
  accounts: SocialAccountArrayType;
}

export default function AutomationPage({ accounts }: Props) {
  return (
    <AutomationProvider initialAccounts={accounts}>
        <AddAutomationCard  
          title= "Create New Automation"
          description="Create an automation based on a trigger and an action."
          buttonText="Create  automation"
        />
      <AutomationList/>
        <AutomationDialog/>
    </AutomationProvider>
  )
}

