 
import { AddAccount } from "./_components/AddAccount";
import { AccountCard  } from "./_components/AccountCard";
import { getCurrentUserInstagramAccounts } from "@/app/actions/instagram";

 

export  default async function AccountPage({searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const status = await (await searchParams).status as string;    

 

   
  const {accounts} = await getCurrentUserInstagramAccounts()  

  

  return (
    
      <div className="grid  gap-6 ">
        <AddAccount status={status}/>

        {/* Connected Accounts */}
        <div className="grid gap-6  md:grid-cols-2 lg:grid-cols-3 ">
          { accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
     
  );
}