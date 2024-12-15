 
import { AddAccount } from "./_components/AddAccount";
import { AccountCard  } from "./_components/AccountCard";
import { getCurrentUserInstagramAccounts } from "@/app/actions/instagram";
import { Suspense } from "react";
import AccountsPageSkeletion from "@/components/skeleton/AccountsPageSkeletion";
import { revalidateTag } from "next/cache";
import { getUser } from "@/app/actions/user";

 

export  default async function AccountPage({searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const status = await (await searchParams).status as string;    

 
  
   
  const {accounts} = await getCurrentUserInstagramAccounts()  
  const user = await getUser();
    

  return (
    <Suspense fallback={<AccountsPageSkeletion/>}>

      <div className="grid  gap-6 ">
      {(user?.subscription && user?.subscription?.accountsUsed < user?.subscription?.plan.maxAccounts) && <AddAccount status={status}/>}

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