"use client";

import {  useState } from "react";
import {
  Card,
  CardContent,
 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
 
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  MessageSquare,
  MessageCircle,
  ArrowRight,
  Trash2,
  Pencil,
  X,
  Check,
  Instagram,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { InstaAccountProps } from "../../account/_components/account-card";
import AddAutomation from "./add-automation";
import NoAutomationsCard from "./ui/no-automations-card";
import { useInstagramAutomation } from "./hooks/useAutomationReducer";
import { PostSelector } from "./post-selector";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AutomationForm } from "./automation-form";
import { useAutomationForm } from "./hooks/useAutomationForm";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTrigger ,AlertDialogFooter, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { AutomationItem } from "./ui/automation-item";

export interface AutomationsCardProps {
  initialAccounts: InstaAccountProps[]
}

export default function AutomationsCard({initialAccounts}: AutomationsCardProps) {
  
  const {state}= useInstagramAutomation();

  const [selectedAccount, setSelectedAccount] = useState<string>(initialAccounts[0]?.account_id || '');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState (false); // setEditingId
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ishovered,setIsHovered]=useState(false);

  const handleAddAutomation = () => {
    setOpenDialog(true);
  };

  const {   dispatch } = useInstagramAutomation();

  const handleEditAutomation = (id: string) => {
    setOpenDialog(true);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setOpenDialog(false);
    setIsEditing(false)
    toast.success("Automation updated successfully");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteAutomation = ( ) => {
    dispatch({ type: "RESET" });
    toast.success("Automation deleted successfully");
  };

  if (!state.account?.id  && !openDialog) {
    return (
      <NoAutomationsCard handleAddAutomation={handleAddAutomation} />
    );
  }

  return (
    <> 
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleAddAutomation}
              disabled={openDialog}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Automation
            </Button>
          </CardContent>
        </Card>
      </div>

      
      <div className="space-y-8">
        {initialAccounts.map((account) => {
          const accountAutomations = state.account?.id === account.id && state 

          return (
            <div key={account.id} className="space-y-4">
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">@{account.username}</h3>
                  <p className={cn(
                    "text-sm",
                    account.status === 'CONNECTED' ? "text-green-500" : "text-red-500"
                  )}>
                    {account.status === 'CONNECTED' ? '● Connected' : '○ Disconnected'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 pl-4 border-l-2 border-primary/20">
                <AutomationItem 
                  onEdit={() => {setIsEditing(true); setOpenDialog(true)}}
                  onDelete={() => handleDeleteAutomation()}
                />
              </div>
            </div>
          );
        })}
      </div>
      <Dialog  open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
        <DialogContent className="max-w-4xl max-h-[90vh] m-5 mb-10  overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Automation" : "Create Automation"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Make changes to your automation settings here." : "Select accounts and posts to automate."}
            </DialogDescription>
          </DialogHeader>
          <AutomationForm
            initialAccounts={initialAccounts}
            onSubmit={handleSaveEdit}
            onCancel={() => {setOpenDialog(false); setIsEditing(false)}}
            title={isEditing ? "Edit Automation" : "Create Automation"}
            description={isEditing ? "Update your automation settings" : "Select accounts and posts to automate"}
            submitText={isEditing ? "Save Changes" : "Create Automation"}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
