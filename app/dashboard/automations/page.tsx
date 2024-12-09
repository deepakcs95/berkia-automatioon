import React from 'react'
import AutomationsCard from './_components/automation-card'
import { getCurrentUserInstagramAccounts } from '@/app/actions/instagram/actions';

export default async function page() {

const initialAccounts = await getCurrentUserInstagramAccounts();
// const initialAutomations = await getAutomations();

  return (
    <AutomationsCard initialAccounts={initialAccounts} />
       
  )
}
