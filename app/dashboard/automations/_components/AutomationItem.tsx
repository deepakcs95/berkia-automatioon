import { memo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTrigger, AlertDialogFooter, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { MessageSquare, MessageCircle, ArrowRight, Trash2, Pencil,  ImagesIcon } from "lucide-react";
import { AutomationsType } from "@/lib/types";
import { cn } from "@/lib/utils/utils";
import { ActionType, TriggerType } from "@prisma/client";
// In automation-item.tsx
interface AutomationItemProps {
    onEdit: (automation:AutomationsType) => void;
    onDelete: (automation:AutomationsType) => void;
    automation: AutomationsType;
    isPending:boolean;
   
}

const  AutomationItem = memo(({ onEdit, onDelete, automation, isPending }: AutomationItemProps) => {
 
  const commentActionIndex = automation.actions.findIndex((action) => action.type === ActionType.COMMENT_REPLY);
  const messageActionIndex = automation.actions.findIndex((action) => action.type === ActionType.MESSAGE_REPLY);
 
  
  return (
    <Card 
      className={cn(
        "group transition-all duration-500 hover:shadow-lg max-w-3xl",
        isPending ? "opacity-60 animate-pulse" 
          : "opacity-100 animate-fade-in"
      )}
      >
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary bg-primary/10">
                {automation.triggers?.type === TriggerType.COMMENT ? 'Comment' : 'Message'}
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="grid place-items-center gap-2">
                {automation.actions[commentActionIndex]?.type && (
                  <Badge variant="outline" className="text-primary bg-primary/10">
                    Reply with Comment
                  </Badge>
                )}
                {automation.actions[messageActionIndex]?.type && (
                  <Badge variant="outline" className="text-primary bg-primary/10">
                    Reply with Message
                  </Badge>
                )}
              </div>
            </div>
            {!isPending && (
              <AutomationActions
                automation={automation}
                onEdit={()=>onEdit(automation) }
                onDelete={onDelete}
              />

   )    }
          </div>      

          <div className=" flex gap-4 mx-auto flex-col items-start lg:flex-row lg:justify-around lg:mx-0">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Trigger</h3>
                <div className="text-sm text-muted-foreground">

                  When {automation.triggers?.type} contains{" "}
                  <Badge variant="outline" className="text-primary bg-primary/10">
                    {automation.triggers?.keyword}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Action</h3>
                <div className="grid place-items-center gap-2">
                  {commentActionIndex !== -1 && automation.actions[commentActionIndex].type === ActionType.COMMENT_REPLY && (
                    <p className="text-sm text-muted-foreground text-clip max-w-[20ch] truncate">
                      Comment Reply - {automation.actions[commentActionIndex]?.content}
                    </p>
                  )}
                  {messageActionIndex !== -1 && automation.actions[messageActionIndex].type === ActionType.MESSAGE_REPLY && (
                    <p className="text-sm text-muted-foreground text-clip max-w-[20ch] truncate">
                      Message Reply - {automation.actions[messageActionIndex]?.content}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {automation.targetPosts && automation.targetPosts.length > 0 && (
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <ImagesIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Applied Posts</h3>
                  <p className="text-sm text-muted-foreground">
                    Applied to {automation.targetPosts.length} post{automation.targetPosts.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
})
AutomationItem.displayName = 'AutomationItem';

export default AutomationItem

const AutomationActions = memo(function AutomationActions({
  automation,
  onEdit,
  onDelete,
}: {
  automation: AutomationsType;
  onEdit: (id: string) => void;
  onDelete: (automation:AutomationsType) => void;
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <div className="flex items-center space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 hover:bg-primary/10"
                onClick={() => onEdit(automation.id || '')}
              >
                <Pencil className="h-4 w-4 text-neutral-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Automation</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Delete Automation</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this automation. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={()=>onDelete(automation)} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
})