import { Suspense } from "react";

 
export default function  Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 space-y-8">
    <div className=" mb-7  ">
      <h2 className="text-3xl font-bold tracking-tight">Automations</h2>
      <p className="text-muted-foreground">
        Create and manage your Instagram automations
      </p>
    </div>
    <Suspense fallback={<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4  ">
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
    </div>}>
          {children}
        </Suspense>
    </div>
  );
}
