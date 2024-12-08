import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the code from the URL query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(new URL('/dashboard/account?error=no_code', request.url));
    }

    // Exchange the code for an access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Get user details using the access token
    const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`);
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user details');
    }

    const userData = await userResponse.json();

    // Store the account details in your database here
    // TODO: Implement your database storage logic

    // Redirect back to the accounts page with success
    return NextResponse.redirect(new URL('/dashboard/account?success=true', request.url));
  } catch (error) {
    console.error('Instagram OAuth error:', error);
    return NextResponse.redirect(new URL('/dashboard/account?error=auth_failed', request.url));
  }
}
