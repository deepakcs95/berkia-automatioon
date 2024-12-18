


import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Settings2 } from 'lucide-react'
import   { useState,memo } from 'react'
import { useAutomation } from '@/hooks/useAutomation'
 
interface AddAutomationCardProps {
   title:string,description:string, buttonText:string
}

  const AddAutomationCard =  memo(({title,description, buttonText}:AddAutomationCardProps)=> {
  
    const {openCreateAutomationForm}= useAutomation()
      
    return (
   <div className="mb-6">
    <Card>
      <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4">
      <div className="rounded-full bg-primary/10 p-4">
              <Settings2 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground">
                {description}
              </p>
            </div>
        <Button  onClick={openCreateAutomationForm}     >
          <PlusCircle className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </CardContent>
    </Card>
    
  </div> 
  )
})

AddAutomationCard.displayName='AddAutomationCard'
export default AddAutomationCard
