import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTrigger, AlertDialogFooter, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { MessageSquare, MessageCircle, ArrowRight, Trash2, Pencil, Image } from "lucide-react";
import { useInstagramAutomation } from "../hooks/useAutomationReducer";

interface AutomationItemProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function AutomationItem({ onEdit, onDelete }: AutomationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const {state} = useInstagramAutomation()


  return (
    <Card 
      className="group transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary bg-primary/10">
                {state.trigger?.type === 'comment' ? 'Comment' : 'Message'}
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="grid place-items-center gap-2">
                {state.actions.commentReply?.type && (
                  <Badge variant="outline" className="text-primary bg-primary/10">
                    Reply with Comment
                  </Badge>
                )}
                {state.actions.messageReply?.type && (
                  <Badge variant="outline" className="text-primary bg-primary/10">
                    Reply with Message
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 hover:bg-primary/10"
                        onClick={onEdit}
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
                      <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mx-auto flex-col items-start md:flex-row md:justify-around md:mx-0">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Trigger</h3>
                <p className="text-sm text-muted-foreground">
                  When {state.trigger?.type} contains{" "}
                  <Badge variant="outline" className="text-primary bg-primary/10">
                    {state.trigger?.keyword}
                  </Badge>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Action</h3>
                <div className="grid place-items-center gap-2">
                  {state.actions.commentReply?.type && (
                    <p className="text-sm text-muted-foreground text-clip">
                      Comment Reply - {state.actions.commentReply?.content}
                    </p>
                  )}
                  {state.actions.messageReply?.type && (
                    <p className="text-sm text-muted-foreground text-clip">
                      Message Reply - {state.actions.messageReply?.content}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {state.selectedPosts && state.selectedPosts.length > 0 && (
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Image className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Applied Posts</h3>
                  <p className="text-sm text-muted-foreground">
                    Applied to {state.selectedPosts.length} post{state.selectedPosts.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
