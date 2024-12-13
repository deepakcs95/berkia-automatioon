import React, { Suspense } from "react";
import {   getAllSocialAccountAndAutomations } from "@/app/actions/automations";
import { SocialAccountArrayType  } from "@/lib/db/automations";
import AutomationsPage from "./_components/AutomationsPage";
import MessageCard from "./_components/ui/NoAccountCard";
import AutomationSkeleton from "@/components/skeleton/AutomationSkeleton";
import { stat } from "fs";


export default async function page() {
  const {automations, status, message} = await getAllSocialAccountAndAutomations();
 

  return (
    <Suspense fallback={<AutomationSkeleton/>}>
      {status === 404 || status === 500  && (
        <MessageCard message={message} status={status} link="/dashboard/account" buttonMessage={Number(status) === 404 ? "Add Account" : "Try again"} />
      )}
       
      {status === 200 &&   <AutomationsPage accounts={automations as SocialAccountArrayType} />
      }
      </Suspense>
  )
}