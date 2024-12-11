import React from "react";
import {   getAllSocialAccountAndAutomations } from "@/app/actions/automations";
import NoAccountAdded from "./_components/ui/NoAccountAdded";
import { SocialAccountArrayType  } from "@/lib/db/automations";
import AutomationsPage from "./_components/AutomationsPage";

export default async function page() {

  
  const {automations, status, message} = await getAllSocialAccountAndAutomations()  

  
  if(status === 404) {
    return (<NoAccountAdded message={message} status={status}/>)
  }

  return (
    <>
      <AutomationsPage   accounts={automations as SocialAccountArrayType} />
    </>
  )
  
}


   
 

 