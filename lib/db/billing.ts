'server only';

import { cache } from "react";
import { db } from "./prisma";
 

export const getAllPlans = cache(async () => {
    return await db.plan.findMany();
});

export const getCurrentPlan = cache(async (userId: string) => {
   const user =    await db.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            subscription: true,
        },
    });
    if(!user?.subscription ) return null
    return user?.subscription  
});

export const getExistingPaypalCertificate = cache(async (certUrl: string) => {
    console.log('getExistingPaypalCertificate from db');
    
    return await db.payPalCertificate.findUnique({
        where: { certUrl }
      });
     
});


export const createPaypalCertificate = cache(async (certUrl: string, certPem: string) => {
      return await db.payPalCertificate.upsert({
          where: {
            certUrl
          },
          update: {
            certPem
          },
          create: {
            certUrl,
            certPem
          }
        });
      
});