import { SocialAccount } from '@prisma/client';
import {z} from 'zod'
import { updateRefreshToken } from '../db/instagram';
import { log } from 'console';
import {   PostItemResponse } from '../types';

const InstagramUserResponseSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  profile_picture_url: z.string().optional(),
})

 
export type InstagramUserResponseType = z.infer<typeof InstagramUserResponseSchema>
 

export async function  getInstagramToken(code: string) {
   
  
  code = code.split('#')[0];

  const formData = getFormData({
    client_id: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID!,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    redirect_uri: `${process.env.NEXT_PUBLIC_URL}/callback/instagram`,
    code
  });

  console.log('📝 Sending token request');
  const tokenResponse = await fetch(
    `${process.env.INSTAGRAM_BASE_URL!}/oauth/access_token`, 
    { method: 'POST', body: formData }
  );

  const tokenData = await tokenResponse.json();

  
  if (!tokenData?.access_token) {
    throw new Error('Failed to exchange code for token');
  }
  console.log('💡 Received token response', tokenData);

  return tokenData

   
}




export async function getLongLivedToken(accessToken: string) {
   
    const tokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET!}&access_token=${accessToken}`
    );

    const tokenData = await tokenResponse.json();

    // Validate the response
    
    console.log('📝 Received long-lived token response',tokenData);

    if (!tokenData?.access_token) {
      throw new Error('Invalid long-lived token response');
    }

    return tokenData;
  
}

export async function  refreshToken(refreshToken: string) {
    const tokenResponse = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${refreshToken}`
    );

    const tokenData = await tokenResponse.json();

    // Validate the response
    
    if (!tokenData?.access_token) {
      throw new Error('Invalid refresh token response');
      
    }
    console.log('📝 Received refresh token response');
    return tokenData;
   
}

export async function getInstagramUser(accessToken: string) {
  
    const userResponse = await fetch(
      `https://graph.instagram.com/v21.0/me?fields=user_id,username,profile_picture_url&access_token=${accessToken}`
    );

    const userData = await userResponse.json();

 
    // Validate the response
    const userSchema = InstagramUserResponseSchema.safeParse(userData);
    if (!userSchema.success) {
      throw new Error('Invalid Instagram user response');
    }

    
    console.log('📝 Received Instagram user details response' , userData);
    return userData as InstagramUserResponseType
   
}




export async function validateInstagramToken(account:SocialAccount): Promise<SocialAccount | null> {

const {accessToken, tokenExpiresAt} = account

  if (!accessToken || !tokenExpiresAt) {
    console.log('❌ Instagram token/token_expires_at is missing');
    return  null;
  }

  if(isTokenExpiringSoon(tokenExpiresAt))  {
    try {
     const refreshedToken = await refreshToken(accessToken)
     
  // "access_token":"{long-lived-user-access-token}",
  // "token_type": "bearer",
  // "expires_in": 5183944  // Number of seconds until token expires
 
      if(refreshedToken.access_token) {
        account.accessToken = refreshedToken.access_token
        account.tokenExpiresAt =  new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        account.status =  'CONNECTED'
        await updateRefreshToken(account.id, refreshedToken.access_token, account.tokenExpiresAt ,account.status)
        log('✅ Instagram token refreshed successfully')
        return account
      }
    }catch (error) {
      console.log(' ❌ Error refreshing Instagram token:', error);
      await updateRefreshToken(account.id, "", new Date(Date.now()) ,'DISCONNECTED')
      return null
    }

    }

    console.log('✅Instagram token is already valid');
 return account;
}

export async function getInstagramPosts(access_token: string, cursor?: string, limit: number = 2) {
  console.log('📝 Sending Instagram posts request');
  
  const posts = await fetch(
    `https://graph.instagram.com/me/media?fields=id,media_url,media_type,thumbnail_url&access_token=${access_token}&limit=${limit}${cursor ? `&after=${cursor}` : ''}`
  );
  const postsData = await posts.json();

  if (!Array.isArray(postsData?.data)) {
    throw new Error('Invalid Instagram posts response');
  }

  console.log(`📝 Received Instagram posts response for cursor ${cursor} and limit ${limit} with posts ${postsData?.data?.length} and has next ${postsData?.paging?.next ? 'yes' : 'no'}`);
  
  return {
    posts: postsData.data,
    after:postsData?.paging?.next && postsData?.paging?.cursors?.after
  } as PostItemResponse;
}




function getFormData(params: Record<string, string>) {
  const formData = new FormData();
  for (const key in params) {
    formData.append(key, params[key]);
  }
  return formData;
}

export function isTokenExpiringSoon(expiresAt: Date | null): boolean {
  if (!expiresAt) return true;
  
  const now = new Date();
  const expiryThreshold = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
  
  return expiresAt <= expiryThreshold;
}