import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAutomation } from '@/hooks/useAutomation';

import   { memo } from 'react'
import dynamic from 'next/dynamic'
import FormSkeleton from '@/components/skeleton/FormSkeleton';
const AutomationForm = dynamic(() => import('./AutomationFrom'), { ssr: false ,loading: ()=><FormSkeleton/>})  

 
 const AutomationDialog = memo(()=> {

const {isEditing,openForm,setOpenForm}= useAutomation()

  return (
    <Dialog  open={openForm} onOpenChange={setOpenForm}>
    <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto mx-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Automation" : "Create Automation"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Make changes to your automation settings here." : "Select accounts and posts to automate."}
        </DialogDescription>
      </DialogHeader>
      
      <AutomationForm submitText={isEditing ? "Save Changes" : "Create Automation"}/>
    </DialogContent>
  </Dialog>
  )
})

AutomationDialog.displayName = "AutomationDialog"
export default AutomationDialog