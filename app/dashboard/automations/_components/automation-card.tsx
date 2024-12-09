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
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
 
 

export interface AutomationsCardProps {
  initialAccounts: InstaAccountProps[]
}


export default function AutomationsCard({initialAccounts}: AutomationsCardProps) {
  
    
  
 
  const {state}= useInstagramAutomation();

  const [selectedAccount, setSelectedAccount] = useState<string>(initialAccounts[0]?.account_id || '');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // setEditingId
  const [isEditing, setIsEditing] = useState(false);
  // Mock accounts data - replace with your actual accounts data
 
  const handleAddAutomation = () => {
    setIsCreating(true);
  };

  const handleSaveNewAutomation = () => {
    
  };

  const handleEditAutomation = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = () => {
    setIsEditing(false)
    toast.success("Automation updated successfully");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDeleteAutomation = (id: string) => {
    toast.success("Automation deleted successfully");
  };

  // Group automations by account
   
  if (!state.account?.id  && !isCreating) {
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
              disabled={isCreating}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Automation
            </Button>
          </CardContent>
        </Card>
      </div>

      {isCreating && (
        <AddAutomation setIsCreating={setIsCreating} initialAccounts={initialAccounts} />
      )}
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
                    account.status === 'connected' ? "text-green-500" : "text-red-500"
                  )}>
                    {account.status === 'connected' ? '● Connected' : '○ Disconnected'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 pl-4 border-l-2 border-primary/20">
                 
                  <Card key={state.account?.id} className="group">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            <span className="font-medium">
                              When: {state.trigger?.type === 'comment' ? 'Comment' : 'Message'}
                            </span>
                            <span className="text-muted-foreground">
                              contains "{state.trigger?.keyword}"
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-5 w-5 text-primary" />
                           {state.actions.commentReply?.type && <>
                           <span className="font-medium">
                              Then:  Reply 
                            </span>
                            <span className="text-muted-foreground">
                              with "{state.actions.commentReply?.content}"
                            </span>
                           </>
                            }
                           {state.actions.messageReply?.type && <>
                           <span className="font-medium">
                              Then:  Send Message
                            </span>
                            <span className="text-muted-foreground">
                              with "{state.actions.messageReply?.content}"
                            </span>
                           </>
                            }
                          </div>
                          <div className="flex items-center space-x-2">
                            <Image className="h-5 w-5 text-primary" />
                           {state.selectedPosts && state.selectedPosts.length > 0 && <>
                           <span className="font-medium">
                              Applied for {state.selectedPosts.length}
                            </span>
                            
                           </>
                            }

                          </div>
                        </div>


                        <div className="flex items-center space-x-2">
                          {editingId === state.account?.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSaveEdit}
                                className="h-8 w-8"
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancelEdit}
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  {setIsEditing(true)
                                  setEditingId(state.account?.id||'') }
                                }
                              >
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <Dialog modal open={isEditing}>
                      <DialogContent className="sm:max-w-md">
                          <Button variant="outline" className="mt-4 w-full">
                            View More
                          </Button>
                        </DialogContent>
                      </Dialog>
                      {/* {editingId === state.account?.id && isEditing && (
                        <div className="mt-4 border-t pt-4">
                          <div className="grid gap-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Trigger Keyword</label>
                              <Input
                                value={state.trigger?.keyword  }
                                  
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Response Message</label>
                             {state.actions.messageReply?.type && <Input
                                value={state.actions.messageReply?.content}
                                
                              />}
                              <label className="text-sm font-medium mb-1 block">Response Message</label>
                             {state.actions.commentReply?.type && <Input
                                value={state.actions.commentReply?.content}
                                
                              />}
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Response Message</label>
                              <PostSelector initialAccounts={initialAccounts}/>
                            </div>
                          </div>
                        </div>
                      )} */}
                    </CardContent>
                  </Card>
                 
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
