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
import { PlusCircle, Trash2, Instagram } from "lucide-react";
import { toast } from "sonner";

interface InstagramAccount {
  id: string;
  username: string;
  profilePicture?: string;
  status: 'connected' | 'disconnected';
}

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<InstagramAccount[]>([
    // Example account - remove this in production
    {
      id: '1',
      username: 'example_account',
      status: 'connected'
    },
    {
      id: '2',
      username: 'example_account',
      status: 'connected'
    },
    {
      id: '3',
      username: 'example_account',
      status: 'connected'
    }
  ]);

  const handleAddAccount = async () => {
    try {
      setIsLoading(true);
      toast.success("Redirecting to Instagram login...");
    } catch (error) {
      toast.error("Failed to initiate Instagram login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    try {
      setIsLoading(true);
      setAccounts(accounts.filter(account => account.id !== accountId));
      toast.success("Account removed successfully");
    } catch (error) {
      toast.error("Failed to remove account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl   mx-auto ">
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          Instagram Accounts
        </h2>
        <p className="text-muted-foreground text-lg">
          Connect and manage your Instagram accounts
        </p>
      </div>

      <div className="grid  gap-6 ">
        {/* Add New Account Card */}
        <Card className="border-dashed  hover:border-primary/50 transition-colors">
          <CardContent className="pt-6 w-3xl">
            <Button
              variant="ghost"
              className="w-full h-40 flex flex-col gap-4 group"
              onClick={handleAddAccount}
              disabled={isLoading}
            >
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-semibold">Add New Account</h3>
                <p className="text-sm text-muted-foreground">
                  Connect a new Instagram account to automate
                </p>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <div className="grid gap-6  md:grid-cols-2 lg:grid-cols-3 ">
          {accounts.map((account) => (
            <Card key={account.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Instagram Account</CardTitle>
                <CardDescription>
                  Manage account connection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                      <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                        {account.profilePicture ? (
                          <img
                            src={account.profilePicture}
                            alt={account.username}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <Instagram className="h-7 w-7 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">@{account.username}</p>
                      <p className={`text-sm font-medium ${
                        account.status === 'connected' 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {account.status === 'connected' ? '● Connected' : '○ Disconnected'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button
                  variant="outline"
                  onClick={() => handleAddAccount()}
                  disabled={isLoading}
                  className="hover:bg-primary/5"
                >
                  Reconnect
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveAccount(account.id)}
                  disabled={isLoading}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}