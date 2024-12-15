import { getCurrentUserInstagramAccounts } from "@/app/actions/instagram";
import { getUser } from "@/app/actions/user";
import AutomationSkeleton from "@/components/skeleton/AutomationSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import ChatBotPage from "./_components/ChatBotPage";

 

export default async function ChatbotPage() {
   
    const {accounts} = await getCurrentUserInstagramAccounts()  

    const user = await getUser()

    if(!accounts ||  accounts.length == 0){
      return (
        <Card className="border-dashed">
          <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Settings2 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">No Accounts Added Yet</h3>
              <p className="text-muted-foreground">
                Please add your instagram account to your  start customizing responses
              </p>
            </div>
            <Link href="/dashboard/account" className="mt-4">
              <Button>
              Connect Account
              </Button>
            </Link>
          </CardContent>
        </Card>)

      }

       return (
        <Suspense fallback={<AutomationSkeleton/>}>
         <ChatBotPage user={user} accounts={accounts}/>
        </Suspense>
      )


    }