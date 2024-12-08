import { connectInstagramAccount } from '@/app/actions/instagram/actions';
import { redirect } from 'next/navigation';

export default  async function Page({searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const code = await (await searchParams).code as string;    

  if (code) {
   const token = await connectInstagramAccount(code);  
   if(token?.success) {
     console.log('✅ Instagram account connected successfully ');
    redirect('/dashboard/account?status=account_connected');
   }
  else {
    console.log('❌ Instagram account connection failed ',token?.error);
    redirect('/dashboard/account?status=account_connection_failed');
  }
}  


   
 }
 