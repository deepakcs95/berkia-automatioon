import React from "react";
import {   getAllSocialAccountAndAutomations } from "@/app/actions/automations";
import { SocialAccountArrayType  } from "@/lib/db/automations";
import AutomationsPage from "./_components/AutomationsPage";
import MessageCard from "./_components/ui/NoAccountCard";

export default async function page() {
  const {automations, status, message} = await getAllSocialAccountAndAutomations();

  if(status === 404) {
    return (<MessageCard message={message} status={status} link="/dashboard/account" buttonMessage="Add Account" />)
  }else if(status === 500) {
    return (<MessageCard message={message} status={status} link="/dashboard/automations" buttonMessage="Try again" />)
  }

  return (
    <>
      <AutomationsPage accounts={automations as SocialAccountArrayType} />
    </>
  )
}