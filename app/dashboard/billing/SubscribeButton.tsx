 
import { getUser } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { getAllPlans, getCurrentPlan } from "@/lib/db/billing";
import { cn } from "@/lib/utils/utils";
import { PayPalButtons } from "@paypal/react-paypal-js";
import PayPalButton from "./PayPalButton";
import UnSubscribeButton from "./UnSubscribe";
import { Plan } from "@prisma/client";
 
 

export default async function SubscribeButton({plan}: {plan: Plan}) {
  const user = await getUser();
  const currentPlan =await getCurrentPlan(user?.id || "");
 
  return (<>
        {currentPlan && currentPlan?.planId === plan.id ? 
         <UnSubscribeButton/>
         : 
         <PayPalButton  planId={plan.id}
         userId={user?.id || ""}
         amount={plan.price}
           />
        }
        </>
   )
}
