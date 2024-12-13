'server only'

import { cache } from 'react';
import { InstagramUser } from '../Integration/social-account-auth';
import { db } from '@/lib/db/prisma'; 
import { social_connection_status } from '@prisma/client';


export async function saveInstagramAccount(userId: string,InstagramUser : InstagramUser,accesToken: string) {

  if(!InstagramUser || !accesToken || !userId) {
    console.log(' Instagram account not saved missing data');
    return null;}

   const existingAccount = await db.socialAccount.findFirst({
        where: {
            account_id: InstagramUser.user_id,
            user_id: userId,
            social_type: 'INSTAGRAM',
      }});

      if (existingAccount) {
        const account = await db.socialAccount.update({
          where: {
            id: existingAccount.id,
          },
          data: {
            username: InstagramUser.username,
            account_id: InstagramUser.user_id,
            access_token: accesToken,
            token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: 'CONNECTED',
            profile_picture_url: InstagramUser.profile_picture_url || '',
          },
        });

        console.log(' Instagram account updated successfully ');
        return account
      } else {
        const account = await db.socialAccount.create({
          data: {
            user_id: userId,
            social_type: 'INSTAGRAM',
            username: InstagramUser.username,
            profile_picture_url: InstagramUser.profile_picture_url || '',
            status: 'CONNECTED',
            account_id: InstagramUser.user_id,
            access_token: accesToken,
            token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          },
        }); 

        console.log(' Instagram account saved successfully ');
        return account
      }
}


export const getInstagramAccountsByUserId   = cache(async (userId: string) => {
  console.log('🔃 getiing instagram accounts');
  
  const account = await db.socialAccount.findMany({
    where: { user_id: userId },
    select: {
      id: true,
      social_type: true,
      username: true,
      profile_picture_url: true,
      status: true,
      account_id: true,
      user_id: true,
      access_token: false,
      token_expires_at: false,
    },
  });
  return account;
} )


export const getAllDetailsOfInstagramAccountsByUserId   = cache(async (userId: string) => {
  const account = await db.socialAccount.findMany({
    where: { user_id: userId },
     
  });
  return account;
});


export const updateRefreshToken = cache(async (id: string, access_token: string, token_expires_at: Date,status:social_connection_status ) => {
  const account = await db.socialAccount.update({
    where: { id },
    data: {
      access_token,
      token_expires_at,
      status
    },
  });
  return account;
});


export type  InstagramAccounts = Awaited<ReturnType<typeof getInstagramAccountsByUserId>>
export type InstagramAccountItem = InstagramAccounts[number];
