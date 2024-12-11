"use server";

import { auth } from "@/lib/auth";
import { createAutomation, getAllSocialAccountWithAutomations, updateAutomation } from "@/lib/db/automations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {  AutomationSchema, AutomationSchemaType } from "@/lib/validator/automation";
import { AutomationsType } from "@/lib/types";
import { X } from "lucide-react";

export async function createNewAutomation(automation: AutomationsType) {
  try {
    const id = await getAuthSession();

    // const validatedData = AutomationSchema.safeParse(automation);

    // if (!validatedData.success) {
    //   console.error("Invalid automation data:", validatedData.error);
    //   return {status: 400, message: "Invalid automation data"};
    // }

   const success = await createAutomation(id, automation);
      if(!success) return {status: 500, message: "An error occurred please try again"};

      return {status:200, message:"Automation created successfully"}
  } catch (error) {
    return {status:500, message:"An error occurred please try again"}
  }finally{
    revalidatePath("/dashboard/automations");
  }
}

export async function updateAutomationAction(automation: AutomationsType) {
  try {
    const id = await getAuthSession();

     
   const success = await updateAutomation(id, automation);
      if(!success) return {status: 500, message: "An error occurred please try again"};

      return {status:200, message:"Automation updated successfully"}
  } catch (error) {
    return {status:500, message:"An error occurred please try again"}
  }finally{
    revalidatePath("/dashboard/automations");
  }
}




export async function getAllSocialAccountAndAutomations() {
  const id = await getAuthSession();
  try {
    const automations = await getAllSocialAccountWithAutomations(id);
    if(!automations) return {status:404,automations:null, message:"No Inistagram accounts found"}

    return {status:200,automations, message:"Instagram accounts fetched successfully"}
  } catch (error) {
    return {status:500,automations:null, message:"An error occurred please try again"}
  }
}

const example = {
  account: {
    id: "17841470800772554",
  },
  trigger: {
    type: "comment",
    keyword: "sds",
  },
  actions: {
    messageReply: {
      type: "messageReply",
      content: "sd",
    },
    commentReply: {
      type: "commentReply",
      content: "sdsd",
    },
  },
  selectedPosts: ["17862159981290952"],
};


export async function getAuthSession() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return  redirect("/sign-in" );
  }
  return session.user.id;
}