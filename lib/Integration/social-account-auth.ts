import {z} from 'zod'

const InstagramUserSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  profile_picture_url: z.string().optional(),
})

export type InstagramUser = z.infer<typeof InstagramUserSchema>
 

export async function  getInstagramToken(code: string) {
   
  
  code = code.split('#')[0];

  const formData = getFormData({
    client_id: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID!,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    redirect_uri: `${process.env.NEXTAUTH_URL}/callback/instagram`,
    code
  });

  console.log('📝 Sending token request');
  const tokenResponse = await fetch(
    `${process.env.INSTAGRAM_BASE_URL!}/oauth/access_token`, 
    { method: 'POST', body: formData }
  );

  const tokenData = await tokenResponse.json();

  console.log('💡 Received token response', tokenData);

  if (!tokenData?.access_token) {
    throw new Error('Failed to exchange code for token');
  }

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
    const userSchema = InstagramUserSchema.safeParse(userData);
    if (!userSchema.success) {
      throw new Error('Invalid Instagram user response');
    }

    
    console.log('📝 Received Instagram user details response' , userData);
    return userData;
   
}




function getFormData(params: Record<string, string>) {
  const formData = new FormData();
  for (const key in params) {
    formData.append(key, params[key]);
  }
  return formData;
}

export function isTokenExpiringSoon(expiresAt?: Date | null): boolean {
  if (!expiresAt) return true;
  
  const now = new Date();
  const expiryThreshold = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
  
  return expiresAt <= expiryThreshold;
}