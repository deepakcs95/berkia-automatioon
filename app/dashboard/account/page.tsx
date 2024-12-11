 
import { AddAccount } from "./_components/add-account";
import { AccountCard  } from "./_components/account-card";
import { getCurrentUserInstagramAccounts } from "@/app/actions/instagram";

 

export  default async function AccountPage({searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const status = await (await searchParams).status as string;    

 

   
  const accounts = await getCurrentUserInstagramAccounts();

  

  return (
    <div className="p-6 space-y-8">
      <div className=" mb-7  ">
        <h2 className="text-3xl font-bold tracking-tight">Instagram Accounts</h2>
        <p className="text-muted-foreground">
          Connect and manage your Instagram accounts
        </p>
      </div>
      <div className="grid  gap-6 ">
        <AddAccount status={status}/>

        {/* Connected Accounts */}
        <div className="grid gap-6  md:grid-cols-2 lg:grid-cols-3 ">
          { accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
    </div>
  );
}