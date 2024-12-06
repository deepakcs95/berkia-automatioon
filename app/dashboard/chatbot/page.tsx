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
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  MessageSquare,
  Trash2,
  Settings2,
  Pencil,
  X,
  Check,
  Instagram,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ChatPrompt {
  id: string;
  accountId: string;
  name: string;
  prompt: string;
  context: string;
  tone: 'professional' | 'casual' | 'friendly';
}

interface InstagramAccount {
  id: string;
  username: string;
  status: 'connected' | 'disconnected';
}

interface NewChatPrompt {
  accountId: string;
  name: string;
  prompt: string;
  context: string;
  tone: 'professional' | 'casual' | 'friendly';
}

export default function ChatbotPage() {
  const [selectedAccount, setSelectedAccount] = useState<string>("1");
  const [prompts, setPrompts] = useState<ChatPrompt[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<ChatPrompt | null>(null);
  const [newPrompt, setNewPrompt] = useState<NewChatPrompt>({
    accountId: selectedAccount,
    name: '',
    prompt: '',
    context: '',
    tone: 'professional',
  });

  // Mock accounts data - replace with your actual accounts data
  const accounts: InstagramAccount[] = [
    { id: '1', username: 'example_account1', status: 'connected' },
    { id: '2', username: 'example_account2', status: 'connected' },
  ];

  // Get accounts that don't have a chatbot yet
  const availableAccounts = accounts.filter(account => 
    !prompts.some(prompt => prompt.accountId === account.id)
  );

  const handleAddPrompt = () => {
    setIsDialogOpen(true);
  };

  const handleSaveNewPrompt = () => {
    if (newPrompt.name && newPrompt.prompt) {
      setPrompts(prev => [...prev, {
        id: Date.now().toString(),
        ...newPrompt
      }]);
      setIsDialogOpen(false);
      setNewPrompt({
        accountId: selectedAccount,
        name: '',
        prompt: '',
        context: '',
        tone: 'professional',
      });
      toast.success("Chatbot prompt created successfully");
    }
  };

  const handleEditPrompt = (prompt: ChatPrompt) => {
    setEditingId(prompt.id);
    setEditingPrompt({ ...prompt });
  };

  const handleSaveEdit = () => {
    if (!editingPrompt) return;
    setPrompts(prompts.map(p => 
      p.id === editingId ? editingPrompt : p
    ));
    setEditingId(null);
    setEditingPrompt(null);
    toast.success("Prompt updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingPrompt(null);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
    toast.error("Prompt deleted successfully");
  };

  // Group prompts by account
  const promptsByAccount = accounts.reduce((acc, account) => {
    acc[account.id] = prompts.filter(p => p.accountId === account.id);
    return acc;
  }, {} as Record<string, ChatPrompt[]>);

  if (prompts.length === 0 && !isDialogOpen) {
    return (
      <div className="p-6 space-y-8">
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Chatbot
          </h2>
          <p className="text-muted-foreground text-lg">
            Create and manage your Instagram chatbot responses
          </p>
        </div>

        <Card className="border-dashed">
          <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Settings2 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">No Chatbot Prompts Yet</h3>
              <p className="text-muted-foreground">
                Create your first chatbot prompt to start customizing responses
              </p>
            </div>
            <Button
              onClick={handleAddPrompt}
              className="mt-4"
            >
              Create Prompt
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Chatbot
        </h2>
        <p className="text-muted-foreground text-lg">
          Configure your Instagram chatbot responses
        </p>
      </div>

      {availableAccounts.length > 0 && (
        <div className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Configure New Chatbot
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Configure Chatbot</DialogTitle>
                    <DialogDescription>
                      Set up your Instagram chatbot responses. You can only have one chatbot per account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Select Account</label>
                      <Select
                        value={newPrompt.accountId}
                        onValueChange={(value) => 
                          setNewPrompt(prev => ({ ...prev, accountId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Instagram Account" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              @{account.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Name</label>
                      <Input
                        value={newPrompt.name}
                        onChange={(e) => setNewPrompt(prev => ({ 
                          ...prev, 
                          name: e.target.value 
                        }))}
                        placeholder="e.g., Main Chatbot"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Context</label>
                      <Textarea
                        value={newPrompt.context}
                        onChange={(e) => setNewPrompt(prev => ({ 
                          ...prev, 
                          context: e.target.value 
                        }))}
                        placeholder="Add context about your business or services"
                        className="min-h-[100px]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Response Tone</label>
                      <Select
                        value={newPrompt.tone}
                        onValueChange={(value: 'professional' | 'casual' | 'friendly') => 
                          setNewPrompt(prev => ({ ...prev, tone: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Response Template</label>
                      <Textarea
                        value={newPrompt.prompt}
                        onChange={(e) => setNewPrompt(prev => ({ 
                          ...prev, 
                          prompt: e.target.value 
                        }))}
                        placeholder="Enter your response template. Use {customer} for customer name and {query} for their message"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setNewPrompt({
                          accountId: selectedAccount,
                          name: '',
                          prompt: '',
                          context: '',
                          tone: 'professional',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveNewPrompt}
                      disabled={!newPrompt.name || !newPrompt.prompt || !newPrompt.accountId}
                    >
                      Save Configuration
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-8">
        {accounts.map((account) => {
          const accountPrompts = promptsByAccount[account.id] || [];
          if (accountPrompts.length === 0) return null;

          const prompt = accountPrompts[0]; // Only show the first prompt since we only allow one per account

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

              <Card key={prompt.id} className="group">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{prompt.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Tone: {prompt.tone.charAt(0).toUpperCase() + prompt.tone.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {editingId === prompt.id ? (
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
                            onClick={() => handleEditPrompt(prompt)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePrompt(prompt.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingId === prompt.id && editingPrompt ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name</label>
                        <Input
                          value={editingPrompt.name}
                          onChange={(e) => setEditingPrompt({
                            ...editingPrompt,
                            name: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Context</label>
                        <Textarea
                          value={editingPrompt.context}
                          onChange={(e) => setEditingPrompt({
                            ...editingPrompt,
                            context: e.target.value
                          })}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Tone</label>
                        <Select
                          value={editingPrompt.tone}
                          onValueChange={(value: 'professional' | 'casual' | 'friendly') => 
                            setEditingPrompt({
                              ...editingPrompt,
                              tone: value
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Template</label>
                        <Textarea
                          value={editingPrompt.prompt}
                          onChange={(e) => setEditingPrompt({
                            ...editingPrompt,
                            prompt: e.target.value
                          })}
                          className="min-h-[150px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {prompt.context && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Context:</strong> {prompt.context}
                        </div>
                      )}
                      <div className="text-sm">
                        <strong>Template:</strong> {prompt.prompt}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
