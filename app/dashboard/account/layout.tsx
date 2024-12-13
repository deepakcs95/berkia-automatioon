 
 
export default function  Layout({ children }: { children: React.ReactNode }) {
  

  return (

    <div className="p-6 space-y-8">
    <div className=" mb-7  ">
      <h2 className="text-3xl font-bold tracking-tight">Instagram Accounts</h2>
      <p className="text-muted-foreground">
        Connect and manage your Instagram accounts
      </p>
    </div>
            {children}
      </div> 
  );
}
