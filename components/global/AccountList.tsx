 import { cn } from '@/lib/utils/utils'
import {   SocialConnectionStatus } from '@prisma/client';
import { Instagram } from 'lucide-react'
import  { memo } from 'react'

interface AccountListProps {
    username: string;
    status: SocialConnectionStatus;
    children?: React.ReactNode;
      
}

export const AccountList =  memo(({username,status,children}: AccountListProps) => {
  console.log("AccountList rendered");
  
  return (
    <div key={username} className="space-y-4">
    <>
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
          <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
            <Instagram className="h-5 w-5 text-gray-600" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">@{username}</h3>
          <p
            className={cn(
              "text-sm",
              status === SocialConnectionStatus.CONNECTED ? "text-green-500" : "text-red-500"
            )}
          >
            {status === SocialConnectionStatus.CONNECTED ? "● Connected" : "○ Disconnected"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 pl-4 border-l-2 border-primary/20 ">
        {children}
      </div>
    </>
  </div>  
)
})

AccountList.displayName = "AccountList"