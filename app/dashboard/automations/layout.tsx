import AutomationSkeleton from "@/components/skeleton/AutomationSkeleton";
import { Suspense } from "react";

 
export default function  Layout({ children }: { children: React.ReactNode }) {
  

  return (
    <Suspense fallback={<div>Loading...</div>}>

      <div className="p-6 space-y-8">
      <div className=" mb-7  ">
        <h2 className="text-3xl font-bold tracking-tight">Automations</h2>
        <p className="text-muted-foreground">
          Create and manage your Instagram automations
        </p>
      </div>
      <Suspense fallback={<AutomationSkeleton/>}>
            {children}
          </Suspense>
      </div>
    </Suspense>
  );
}
