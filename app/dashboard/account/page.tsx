 
import { AddAccount } from "./_components/AddAccount";
import { AccountCard  } from "./_components/AccountCard";
import { getCurrentUserInstagramAccounts } from "@/app/actions/instagram";
import { Suspense } from "react";
import AccountsPageSkeletion from "@/components/skeleton/AccountsPageSkeletion";
import { revalidateTag } from "next/cache";

 

export  default async function AccountPage({searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const status = await (await searchParams).status as string;    

 
  
   
  const {accounts} = await getCurrentUserInstagramAccounts()  

  

  return (
    <Suspense fallback={<AccountsPageSkeletion/>}>

      <div className="grid  gap-6 ">
        <AddAccount status={status}/>

        {/* Connected Accounts */}
        <div className="grid gap-6  md:grid-cols-2 lg:grid-cols-3 ">
          { accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
      </Suspense>

  );
}