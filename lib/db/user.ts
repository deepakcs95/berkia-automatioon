"user server";
import { User } from "next-auth";
import { cache } from "react";
import { generateIdFromEmail } from "@/lib/utils/utils";
import { db } from "@/lib/db/prisma";
import { Prisma, Subscription, SubscriptionPlanType } from "@prisma/client";

export const onboardUser = async (user: User) => {
  if (!user.email)    throw new Error("User email is null or undefined");
  
    const existingUser = await getUserByEmail(user.email);

    
    if (!existingUser) {
      
      await db.user.create({
        data: {
          id: generateIdFromEmail(user.email),
          email: user.email,
          name: user.name,
          image: user.image,
           subscription: {
            create: {
               
              status:"ACTIVE",
              startDate:new Date(),
              endDate:new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 
              plan:{
                connect: {
                  name: SubscriptionPlanType.FREE
                }
              }
            }
          }
        },
      });
      console.log("User created");
    }
   
};

export const getUserByEmail = cache(async (email: string) => {
  return await db.user.findUnique({ where: { email } });
});

export const findSubscriptionPlan = cache(async (plan: SubscriptionPlanType) => {
  return await db.plan.findUnique({ where: { name: plan } });
});

export const getUserByIdWithSubscription = cache(async (id: string) => {
  return await db.user.findUnique({ where: { id },include: { subscription: {
    include: {
      plan: true
    }
  } } });
});

export type  UserWithSubscription = Awaited<ReturnType<typeof getUserByIdWithSubscription>>

export const findSubscriptionPlanByUserId = cache(async (userId: string) => {
  return await db.user.findUnique({ where: { id: userId },include: { subscription: {
    include: {
      plan: true
    }
  } } });
});

export type  UserWithSubscriptionPlan = Awaited<ReturnType<typeof getUserByIdWithSubscription>>


export const updateUsageOfSubscription = cache(async (userId: string, data:Prisma.SubscriptionUpdateManyArgs['data']) => {
  return await db.subscription.update({
    where: { userId },
    data: data
  });
});