 
import { AddAccount } from "./_components/add-account";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getInstagramAccountsOfUser } from "@/lib/db/instagram";
import { AccountCard, AddAccountProps } from "./_components/account-card";

 

export  default async function AccountPage(){
   
  const session = await auth();

  if (!session?.user?.id) {
     redirect('/sign-in');
  }

  const accounts = await getInstagramAccountsOfUser(session.user.id);

  

  return (
    <div className="p-6 space-y-8">
      <div className=" mb-7  ">
        <h2 className="text-3xl font-bold tracking-tight">Instagram Accounts</h2>
        <p className="text-muted-foreground">
          Connect and manage your Instagram accounts
        </p>
      </div>
      <div className="grid  gap-6 ">
        <AddAccount/>

        {/* Connected Accounts */}
        <div className="grid gap-6  md:grid-cols-2 lg:grid-cols-3 ">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
    </div>
  );
}