import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import React from 'react'

interface DeleteDialogProps {
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    children: React.ReactNode;
}
export const AutomationDialog = React.memo(function AutomationDialog({children,openDialog,setOpenDialog,isEditing}:DeleteDialogProps) {
  return (
    <Dialog  open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
    <DialogContent className="max-w-4xl max-h-[90vh] m-5 mb-10  overflow-y-scroll">
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

