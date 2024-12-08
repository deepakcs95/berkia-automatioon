import { connectInstagramAccount } from '@/app/actions/account/actions';
import { redirect } from 'next/navigation';

export default  async function Page({searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const code = await(await searchParams).code as string;    

  if (code) {
   const token = await connectInstagramAccount(code);  
   if(token?.success) {
    redirect('/dashboard/account?success=account_connected');

   }
  else {
    redirect('/dashboard/account?error=account_connection_failed');
  }
}  


   
 }
 