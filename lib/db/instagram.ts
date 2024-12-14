'server only'

import { cache } from 'react';
import { InstagramUser } from '../Integration/social-account-auth';
import { db } from '@/lib/db/prisma'; 
import { SocialConnectionStatus, SocialType } from '@prisma/client';


export async function saveInstagramAccount(userId: string,instagramUser : InstagramUser,accesToken: string) {

  if(!instagramUser || !accesToken || !userId) {
    console.log(' Instagram account not saved missing data');
    return null;}

   const existingAccount = await db.socialAccount.findFirst({
        where: {
            accountId: instagramUser.userId,
            userId,
            socialType: SocialType.INSTAGRAM,
      }});

      if (existingAccount) {
        const account = await db.socialAccount.update({
          where: {
            id: existingAccount.id,
          },
          data: {
            username: instagramUser.userName,
            accountId: instagramUser.userId,
            accessToken: accesToken,
            tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: SocialConnectionStatus.CONNECTED,
            profilePictureUrl: instagramUser.profilePictureUrl || '',
          },
        });

        console.log(' Instagram account updated successfully ');
        return account
      } else {
        const account = await db.socialAccount.create({
          data: {
              userId,
            socialType: SocialType.INSTAGRAM,
            username: instagramUser.userName,
            profilePictureUrl: instagramUser.profilePictureUrl || '',
            status: SocialConnectionStatus.CONNECTED,
            accountId: instagramUser.userId,
            accessToken: accesToken,
            tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          },
        }); 

        console.log(' Instagram account saved successfully ');
        return account
      }
}


export const getInstagramAccountsByUserId   = cache(async (userId: string) => {
  console.log('🔃 getiing instagram accounts');
  
  const account = await db.socialAccount.findMany({
    where: {  userId },
    select: {
      id: true,
      socialType: true,
      username: true,
      profilePictureUrl: true,
      status: true,
      accountId: true,
      userId: true,
      accessToken: false,
      tokenExpiresAt: false,
    },
  });
  return account;
} )


export const getAllDetailsOfInstagramAccountsByUserId   = cache(async (userId: string) => {
  const account = await db.socialAccount.findMany({
    where: {   userId },
     
  });
  return account;
});


export const updateRefreshToken = cache(async (id: string, accessToken: string, tokenExpiresAt: Date,status:SocialConnectionStatus ) => {
  const account = await db.socialAccount.update({
    where: { id },
    data: {
      accessToken,
      tokenExpiresAt,
      status
    },
  });
  return account;
});


export type  InstagramAccounts = Awaited<ReturnType<typeof getInstagramAccountsByUserId>>
export type InstagramAccountItem = InstagramAccounts[number];
