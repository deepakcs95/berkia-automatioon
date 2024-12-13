import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import React from 'react'

interface DeleteDialogProps {
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    children: React.ReactNode;
}
 const AutomationDialog = React.memo(function AutomationDialog({children,openDialog,setOpenDialog,isEditing}:DeleteDialogProps) {
  return (
    <Dialog  open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
    <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto mx-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Automation" : "Create Automation"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Make changes to your automation settings here." : "Select accounts and posts to automate."}
        </DialogDescription>
      </DialogHeader>
      
     {children}
    </DialogContent>
  </Dialog>
  )
})

export default AutomationDialog