
import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings2 } from "lucide-react";

interface Props {
    handleAddAutomation: () => void;
}

export default function NoAutomationsCard({ handleAddAutomation }: Props) {
  return (
    <Card className="border-dashed">
          <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Settings2 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">No Automations Yet</h3>
              <p className="text-muted-foreground">
                Create your first automation to start responding automatically
              </p>
            </div>
            <Button
              onClick={handleAddAutomation}
              className="mt-4"
            >
              Create Automation
            </Button>
          </CardContent>
        </Card>
  )
}
