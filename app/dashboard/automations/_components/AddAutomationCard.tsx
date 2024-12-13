


import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Settings2 } from 'lucide-react'
import React from 'react'

interface AddAutomationCardProps {
  onClick: () => void
  message:{title:string,description:string, buttonText:string}
}

  const AddAutomationCard = React.memo(function AddAutomationCard({onClick,message}:AddAutomationCardProps) {
  return (
    <div><div className="mb-6">
    <Card>
      <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4">
      <div className="rounded-full bg-primary/10 p-4">
              <Settings2 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{message.title}</h3>
              <p className="text-muted-foreground">
                {message.description}
              </p>
            </div>
        <Button    onClick={onClick}  >
          <PlusCircle className="h-4 w-4 mr-2" />
          {message.buttonText}
        </Button>
      </CardContent>
    </Card>
  </div></div>
  )
})

export default AddAutomationCard
