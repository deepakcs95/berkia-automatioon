import { db } from "@/lib/db/prisma";
import {  SocialConnectionStatus, SocialType,TriggerType } from "@prisma/client";
 import { AutomationsType } from "../types";
import { cache } from "react";


 

export const getAllSocialAccountWithAutomations =  async (userId: string) => {
   console.log('🔃 getiing instagram accounts with automation');
   
    const automations = await db.socialAccount.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        socialType: true,
        username: true,
        profilePictureUrl: true,
        status: true,
        accountId: true,
        userId: true,
        automations:{
          include: {
            actions: true,
            triggers: true,
          },
          orderBy: {
            createdAt: "desc",
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
        accountId: data.accountId,
        userId: userId,
      },
    });
 
    if (!socialAccount) {
      console.error(
        `No social account found for user with id ${userId} and account id ${data.accountId} 🤔`
      );
      throw new Error(`No social account found for the user `)
    }

    data.accountId = socialAccount.id
    await db.$transaction(async (transaction) => {
      await transaction.automation.create({
      data : {
        id: data.id,
        accountId: socialAccount.id,
        name: data.name,
        isActive: data.isActive,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        targetPosts: data.targetPosts,
        triggers: data.triggers ? {
          create: {
              id: data.triggers?.id ,
              type: data.triggers?.type || TriggerType.COMMENT,
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

    await transaction.subscription.update({
      where: {
        userId: userId,
      },
      data: {
        automationsUsed: {
          increment: 1,
        },
        
      },
    });

    
  })
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
        accountId: data.accountId,
        userId: userId,
      },
    });
 
    if (!socialAccount) {
      console.error(
        `No social account found for user with id ${userId} and account id ${data.accountId} 🤔`
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


    data.accountId = socialAccount.id

    const updatedAutomation = await db.$transaction(async (transaction) => {
      
      const automation = await transaction.automation.update({
        where: { id: data.id },
        data: {
          name: data.name,
          isActive: data.isActive,
          updatedAt: new Date(),
          targetPosts: data.targetPosts,
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
              automationId: data.id,
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

export const deleteAutomation = async ( userId: string, automationId: string) => {
  try {

    await db.$transaction(async (transaction) => {
      await transaction.automation.delete({
        where: {
          id: automationId,
          
        },
      });


      await transaction.subscription.update({
        where: {
          userId: userId,
        },
        data: {
          automationsUsed: {
            decrement: 1,
          },
          
        },
      });
    })
      
    console.log(`Automation deleted for user with id ${automationId} 🎉`);
    return true
  } catch (error) {
    console.error("Error deleting automation:", error);
    throw new Error('An error occurred please try again')
  }
};

export const  findTriggerAndAssociatedAutomation = cache(async ({type, keyword}: {type:TriggerType, keyword: string}) => {
  return   await db.trigger.findMany({
     where: {
       type: type,
       keyword:{ equals: keyword,
        mode: 'insensitive'},

       automation: {
         isActive: true,
         account: {
           status: SocialConnectionStatus.CONNECTED
         }
       }
     },
     include: {
       automation: {
         include: {
           account: {
             include: {
               user: true
             },
           },
           actions: true
         }
       }
     }
   });}
  )


export type SocialAccountArrayType =  Awaited<ReturnType<typeof getAllSocialAccountWithAutomations>>
export type SocialAccountType =  Omit<SocialAccountArrayType[number], 'automations'>;

 