import { db } from "@/lib/db/prisma";
import {   trigger_type } from "@prisma/client";
 import { AutomationsType } from "../types";
import { cache } from "react";


 

export const getAllSocialAccountWithAutomations = cache(async (userId: string) => {
   
    const automations = await db.socialAccount.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
        social_type: true,
        username: true,
        profile_picture_url: true,
        status: true,
        account_id: true,
        user_id: true,
        automations:{
          include: {
            actions: true,
            triggers: true,
          },
          orderBy: {
            created_at: "desc",
          },
        }
      },
    }
  );

    return automations   
     
   
});

 

export const createAutomation = async (userId: string, data: AutomationsType) => {
  try {
    

    const socialAccount = await db.socialAccount.findFirst({
      where: {
        account_id: data.account_id,
        user_id: userId,
      },
    });
 
    if (!socialAccount) {
      console.error(
        `No social account found for user with id ${userId} and account id ${data.account_id} 🤔`
      );
      throw new Error(`No social account found for the user `)
    }

    data.account_id = socialAccount.id

      await db.automation.create({
      data : {
        id: data.id,
        account_id: socialAccount.id,
        name: data.name,
        isActive: data.isActive,
        created_at: data.created_at,
        updated_at: data.updated_at,
        target_posts: data.target_posts,
        triggers: data.triggers ? {
          create: {
              id: data.triggers?.id ,
              type: data.triggers?.type || trigger_type.comment,
              keyword: data.triggers?.keyword || '',
            },
        } : undefined,
        actions: {
          createMany: {
            data: data.actions.map(action => ({
              id: action.id,
              type: action.type,
              content: action.content,
            }))
          }
        }
      }
      },   
      
    );

    console.log(`Automation created for user with id ${userId} 🎉`);
   return true
    
  } catch (error) {
    console.error("Error creating automation:", error);
    throw new Error('An error occurred please try again')
  }
};


export const updateAutomation = async (userId: string, data: AutomationsType) => {
  try {
    

    const socialAccount = await db.socialAccount.findFirst({
      where: {
        account_id: data.account_id,
        user_id: userId,
      },
    });
 
    if (!socialAccount) {
      console.error(
        `No social account found for user with id ${userId} and account id ${data.account_id} 🤔`
      );
      throw new Error(`No social account found for the user `)
    }
    
    
    const existingAutomation = await db.automation.findUnique({
      where: { id: data.id },
      include: { triggers: true }
    });

    if (!existingAutomation) {
      throw new Error(`Automation with id ${data.id} not found`);
    }


    data.account_id = socialAccount.id

    const updatedAutomation = await db.$transaction(async (transaction) => {
      
      const automation = await transaction.automation.update({
        where: { id: data.id },
        data: {
          name: data.name,
          isActive: data.isActive,
          updated_at: new Date(),
          target_posts: data.target_posts,
          actions: {
            deleteMany: {},  
            create: data.actions.map((action) => ({
              id: action.id,
              type: action.type,
              content: action.content,
            })),
          },
        },
        include: {
          actions: true,
          triggers: true,
        },
      });
    
      if (data.triggers) {
        if (automation.triggers) {
          await transaction.trigger.update({
            where: { id: automation.triggers.id },
            data: {
              type: data.triggers.type,
              keyword: data.triggers.keyword,
            },
          });
        } else {
          await transaction.trigger.create({
            data: {
              id: data.triggers.id,
              type: data.triggers.type,
              keyword: data.triggers.keyword,
              automation_id: data.id,
            },
          });
        }
      } else if (automation.triggers) {
        await transaction.trigger.delete({
          where: { id: automation.triggers.id },
        });
      }
      
      
      return true;
    })

    console.log(`Automation updated for user with id ${userId} 🎉`);
   return true
    
  } catch (error) {
    console.error("Error updating automation:", error);
    throw new Error('An error occurred please try again')
  }
};

export const deleteAutomation = async ( automationId: string) => {
  try {
      await db.automation.delete({
      where: {
        id: automationId,
        
      },
    });
    console.log(`Automation deleted for user with id ${automationId} 🎉`);
    return true
  } catch (error) {
    console.error("Error deleting automation:", error);
    throw new Error('An error occurred please try again')
  }
};

export type SocialAccountArrayType =  Awaited<ReturnType<typeof getAllSocialAccountWithAutomations>>
export type SocialAccountType =  Omit<SocialAccountArrayType[number], 'automations'>;

 