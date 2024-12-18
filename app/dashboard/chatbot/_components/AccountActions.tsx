// Create a new file ActionButtons.tsx
import { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useChatbot } from '../../../../hooks/useChatBot';
import { AlertDialogCancel, AlertDialogFooter,AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialog } from '@/components/ui/alert-dialog';

interface AccountActions {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  id: string;
  handleSubmitClick:()=>void
}

export const  AccountActions = memo(({ isEditing, id ,setIsEditing,handleSubmitClick}: AccountActions) => {
  console.log("ActionButtons rendered");
  
const {handleDelete } =useChatbot()
 

  if (isEditing) {
    return (
      <>
        <Button onClick={handleSubmitClick} variant="ghost" size="icon">
          <Check className="h-4 w-4 text-green-500" />
        </Button>
        <Button onClick={()=>setIsEditing(false)} variant="ghost" size="icon" className="h-8 w-8">
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </>
    );
  }

  return (
    <>
      <Button onClick={()=>setIsEditing(true)} variant="ghost" size="icon" className="h-8 w-8">
        <Pencil className="h-4 w-4 text-muted-foreground" />
      </Button>
      <AlertDialog>
      <AlertDialogTrigger asChild>
      <Button   variant="ghost" size="icon" className="h-8 w-8">
        <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Chatbot
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDelete(id)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    </>
  );
});

AccountActions.displayName = 'AccountActions';