'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { connectInstagramAccount } from '@/app/actions/instagram';
import { Loader2 } from 'lucide-react';

export default function InstagramCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      if (searchParams) {
        const code = searchParams?.get('code');

        if (code) {
          const result = await connectInstagramAccount(code);
          if (result?.success) {
            console.log('✅ Instagram account connected successfully');
            router.push('/dashboard/account?status=account_connected');
          } else {
          console.log('❌ Instagram account connection failed', result?.error);
          router.push('/dashboard/account?status=account_connection_failed');
        }
      }}
    }

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Authenticating with Instagram</h1>
        <p className="text-gray-600">Please wait while we complete the process...</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Exchanging token</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Storing credentials</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Finalizing setup</span>
          </div>
        </div>
      </div>
    </div>
  );
}