// Create a new file ActionButtons.tsx
import { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useChatbot } from './Context';

interface AccountActions {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  id: string;
  handleSubmitClick:()=>void
}

export const  AccountActions = memo(({ isEditing, id ,setIsEditing,handleSubmitClick}: AccountActions) => {
  console.log("ActionButtons rendered");
  
const {handleDelete, handleEdit , handleCancel} =useChatbot()
 

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
      <Button onClick={()=>handleDelete(id)} variant="ghost" size="icon" className="h-8 w-8">
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </>
  );
});

AccountActions.displayName = 'AccountActions';