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
  Settings2,
  Pencil,
  X,
  Check,
  Instagram,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { InstaAccountProps } from "../../account/_components/account-card";
import AddAutomation from "./add-automation";
 
export interface Automation {
  id: string;
  accountId: string;
  trigger: {
    type: 'comment' | 'message';
    keyword: string;
  };
  action: {
    type: 'reply' | 'message';
    content: string;
  };
}
 

export interface NewAutomation {
  accountId: string;
  trigger: {
    type: 'comment' | 'message';
    keyword: string;
  };
  action: {
    type: 'reply' | 'message';
    content: string;
  };
}

export interface AutomationsCardProps {
    initialAccounts: InstaAccountProps[]
    initialAutomations: Automation[]
  }
  

export default function AutomationsCard({initialAccounts, initialAutomations}: AutomationsCardProps) {
  
    
 
 


  const [selectedAccount, setSelectedAccount] = useState<string>(initialAccounts[0]?.account_id || '');
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [newAutomation, setNewAutomation] = useState<NewAutomation>({
    accountId: selectedAccount,
    trigger: {
      type: 'comment',
      keyword: '',
    },
    action: {
      type: 'reply',
      content: '',
    },
  });

  // Mock accounts data - replace with your actual accounts data
 
  const handleAddAutomation = () => {
    setIsCreating(true);
  };

  const handleSaveNewAutomation = () => {
    if (newAutomation.trigger.keyword && newAutomation.action.content) {
      setAutomations(prev => [...prev, {
        id: Date.now().toString(),
        ...newAutomation
      }]);
      setIsCreating(false);
      setNewAutomation({
        accountId: selectedAccount,
        trigger: { type: 'comment', keyword: '' },
        action: { type: 'reply', content: '' }
      });
      toast.success("Automation created successfully",);
    }
  };

  const handleEditAutomation = (automation: Automation) => {
    setEditingId(automation.id);
    setEditingAutomation({ ...automation });
  };

  const handleSaveEdit = () => {
    if (!editingAutomation) return;
    setAutomations(automations.map(a => 
      a.id === editingId ? editingAutomation : a
    ));
    setEditingId(null);
    setEditingAutomation(null);
    toast.success("Automation updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingAutomation(null);
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations(automations.filter(auto => auto.id !== id));
    toast.success("Automation deleted successfully");
  };

  // Group automations by account
  const automationsByAccount = initialAccounts.reduce((acc, account) => {
    acc[account.id] = automations.filter(a => a.accountId === account.id);
    return acc;
  }, {} as Record<string, Automation[]>);

  if (automations.length === 0 && !isCreating) {
    return (
     <>

        <Card className="border-dashed">
          <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Settings2 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">No Automations Yet</h3>
              <p className="text-muted-foreground">
                Create your first automation to start responding automatically
              </p>
            </div>
            <Button
              onClick={handleAddAutomation}
              className="mt-4"
            >
              Create Automation
            </Button>
          </CardContent>
        </Card>
      </>
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
        <AddAutomation initialAccounts={initialAccounts} />
      )}

      <div className="space-y-8">
        {initialAccounts.map((account) => {
          const accountAutomations = automationsByAccount[account.id] || [];
          if (accountAutomations.length === 0) return null;

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
                {accountAutomations.map((automation) => (
                  <Card key={automation.id} className="group">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            <span className="font-medium">
                              When: {automation.trigger.type === 'comment' ? 'Comment' : 'Message'}
                            </span>
                            <span className="text-muted-foreground">
                              contains "{automation.trigger.keyword}"
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            <span className="font-medium">
                              Then: {automation.action.type === 'reply' ? 'Reply' : 'Send Message'}
                            </span>
                            <span className="text-muted-foreground">
                              with "{automation.action.content}"
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {editingId === automation.id ? (
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
                                onClick={() => handleEditAutomation(automation)}
                                className="h-8 w-8"
                              >
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAutomation(automation.id)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      {editingId === automation.id && editingAutomation && (
                        <div className="mt-4 border-t pt-4">
                          <div className="grid gap-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Trigger Keyword</label>
                              <Input
                                value={editingAutomation.trigger.keyword}
                                onChange={(e) => setEditingAutomation({
                                  ...editingAutomation,
                                  trigger: { ...editingAutomation.trigger, keyword: e.target.value }
                                })}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Response Message</label>
                              <Input
                                value={editingAutomation.action.content}
                                onChange={(e) => setEditingAutomation({
                                  ...editingAutomation,
                                  action: { ...editingAutomation.action, content: e.target.value }
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
