

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Settings2 } from 'lucide-react';
import Link from 'next/link'
import React from 'react'

export default function NoAccountAdded({message,status}:{message:string,status:number}) {
  let pMessage;
  let link="/dashboard/account";
  if (status === 404) {
    pMessage = "Please go to the account page to add an account.";
    link =  "/dashboard/account"  
  } else if (status === 500) {
    pMessage = "Please try again later or contact the administrator if the issue persists.";
    link = "/dashboard/account"  ;
  }

  return (
     
    <Card>
      <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4">
      <div className="rounded-full bg-primary/10 p-4">
              <Settings2 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{message}</h3>
              <p className="text-muted-foreground">
                {pMessage}
              </p>
            </div>
        <Link href= {link}>
        <Button className="w-full p-5" variant="outline" color="primary">
            
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Account
        </Button>
        </Link>
      </CardContent>
    </Card>
 
  )
}



