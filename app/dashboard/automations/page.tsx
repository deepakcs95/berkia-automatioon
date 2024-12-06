"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  MessageSquare,
  MessageCircle,
  ArrowRight,
  Trash2,
  Settings2,
  AlertCircle,
  Pencil,
  X,
  Check,
  Instagram,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { set } from "react-hook-form";

interface Automation {
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

interface InstagramAccount {
  id: string;
  username: string;
  status: 'connected' | 'disconnected';
}

interface NewAutomation {
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

export default function AutomationsPage() {
  const sampleAutomation: Automation[] = [
    {
      id: '1',
      accountId: '1',
      trigger: {
        type: 'comment',
        keyword: 'hello',
      },
      action: {
        type: 'reply',
        content: 'Hi there! How can I help you?',
      },
    },
    {
      id: '2',
      accountId: '2',
      trigger: {
        type: 'message',
        keyword: 'price',
      },
      action: {
        type: 'reply',
        content: 'Here are our current prices...',
      },
    },
    {
      id: '3',
      accountId: '1',
      trigger: {
        type: 'comment',
        keyword: 'support',
      },
      action: {
        type: 'message',
        content: 'Thank you for reaching out! Our support team will assist you.',
      },
    }
  ];

  const [selectedAccount, setSelectedAccount] = useState<string>("1");
  const [automations, setAutomations] = useState<Automation[]>([]);
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
  const accounts: InstagramAccount[] = [
    { id: '1', username: 'example_account1', status: 'connected' },
    { id: '2', username: 'example_account2', status: 'connected' },
  ];

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
      toast.success("Automation created successfully");
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
  const automationsByAccount = accounts.reduce((acc, account) => {
    acc[account.id] = automations.filter(a => a.accountId === account.id);
    return acc;
  }, {} as Record<string, Automation[]>);

  if (automations.length === 0 && !isCreating) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Automations
          </h2>
          <p className="text-muted-foreground text-lg">
            Create and manage your Instagram automations
          </p>
        </div>

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
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          Automations
        </h2>
        <p className="text-muted-foreground text-lg">
          Create and manage your Instagram automations
        </p>
      </div>

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
        <Card className="mb-8 border-primary/50">
          <CardHeader>
            <CardTitle className="text-xl">New Automation</CardTitle>
            <CardDescription>Configure your new automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Select Account</label>
              <Select
                value={selectedAccount}
                onValueChange={(value) => {
                  setSelectedAccount(value);
                  setNewAutomation(prev => ({ ...prev, accountId: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Instagram Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      @{account.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Trigger</CardTitle>
                  <CardDescription>When this happens...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <Select
                      value={newAutomation.trigger.type}
                      onValueChange={(value: 'comment' | 'message') => {
                        setNewAutomation(prev => ({
                          ...prev,
                          trigger: { ...prev.trigger, type: value }
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comment">Comment</SelectItem>
                        <SelectItem value="message">Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Keyword</label>
                    <Input
                      value={newAutomation.trigger.keyword}
                      onChange={(e) => {
                        setNewAutomation(prev => ({
                          ...prev,
                          trigger: { ...prev.trigger, keyword: e.target.value }
                        }));
                      }}
                      placeholder="Enter trigger keyword"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-center h-full">
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Action</CardTitle>
                  <CardDescription>Do this...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <Select
                      value={newAutomation.action.type}
                      onValueChange={(value: 'reply' | 'message') => {
                        setNewAutomation(prev => ({
                          ...prev,
                          action: { ...prev.action, type: value }
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reply">Reply</SelectItem>
                        <SelectItem value="message">Send Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Message</label>
                    <Input
                      value={newAutomation.action.content}
                      onChange={(e) => {
                        setNewAutomation(prev => ({
                          ...prev,
                          action: { ...prev.action, content: e.target.value }
                        }));
                      }}
                      placeholder="Enter response message"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setNewAutomation({
                  accountId: selectedAccount,
                  trigger: { type: 'comment', keyword: '' },
                  action: { type: 'reply', content: '' }
                });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNewAutomation}
              disabled={!newAutomation.trigger.keyword || !newAutomation.action.content}
            >
              Save Automation
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-8">
        {accounts.map((account) => {
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
    </div>
  );
}
