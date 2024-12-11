import { db } from "@/lib/db/prisma";
import { action_type, Prisma, trigger_type } from "@prisma/client";
import { AutomationSchemaType } from "../validator/automation";
import { AutomationsType } from "../types";


 

export const getAllSocialAccountWithAutomations = async (userId: string) => {
   
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
            updated_at: "desc",
          },
        }
      },
    }
  );

    return automations   
     
   
};

 

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
              type: data.triggers?.type!!,
              keyword: data.triggers?.keyword!!,
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


export type SocialAccountArrayType =  Awaited<ReturnType<typeof getAllSocialAccountWithAutomations>>
export type SocialAccountType =  Omit<SocialAccountArrayType[number], 'automations'>;

 