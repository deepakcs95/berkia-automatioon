
'use client'
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PayPalButtons, PayPalScriptProvider,usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";


type Props = {
    planId: string;
    userId: string;
    amount: number;
} 
export default function PayPalButton ( {planId,userId,amount}:Props) {
  

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,vault: true,intent:"subscription" }}>
      <PayPalButtonWrapper planId={planId} userId={userId} amount={amount} />

    </PayPalScriptProvider>
  )}

  function PayPalButtonWrapper( {planId,userId,amount}:Props) {
    const [{  isPending,isInitial }] = usePayPalScriptReducer();
    const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
      if (isPending || isInitial) {
        return       setIsLoading(true);

      }
      setIsLoading(false);
    }, [isPending, isInitial]);

    console.log(planId,userId,amount);

    return isLoading ? (
          <Loader2 className="h-5 w-full text-blue-800 animate-spin" /> 
    ) : (
      <PayPalButtons style={{ layout: "horizontal", color: "blue", shape: "rect" }} 
      
        createSubscription={(data, actions) => {
            return actions.subscription.create({
                plan_id: planId,
                custom_id: userId
             })
        }}
        onApprove={async(data,actions)=>{
            toast.success("Subscription created successfully Please wait for approval");
         }}
        onError={(err) => {
            console.error('PayPal error:', err);
            toast.error("Failed to create subscription, Please try again");

           }}
      />
    );
  }



 