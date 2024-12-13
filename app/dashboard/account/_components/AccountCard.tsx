"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  deleteConnectedInstagramAccount,
  disconnectInstagramAccount,
} from "@/app/actions/instagram";
import { instagramAuthUrl } from "./AddAccount";
import { SocialAccountType } from "@/lib/db/automations";
import Image from "next/image";

 
export function AccountCard({ account }: { account: SocialAccountType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConnectionOfAccount = async () => {
    try {
      setIsLoading(true);

      const result = await disconnectInstagramAccount(account.account_id);

      if (result?.success) {
        toast.success("success");
      } else {
        toast.error(result?.message || "Failed Please try again");
      }
    } catch (error) {
      console.log("❌ Error disconnecting Instagram account:", error);

      toast.error("Failed Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInstagramAccount = async () => {
    try {
      setIsDeleting(true);

      const result = await deleteConnectedInstagramAccount(account.account_id);

      if (result?.success) {
        toast.success("success");
      } else {
        toast.error(result?.message || "Failed Please try again");
      }
    } catch (error) {
      console.log("❌ Error deleting Instagram account:", error);

      toast.error("Failed Please try again");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">Instagram Account</CardTitle>
        <CardDescription>Manage account connection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                {account.profile_picture_url ? (
                  <Image
                    src={account.profile_picture_url}
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
              <p
                className={`text-sm font-medium ${
                  account.status === "CONNECTED" ? "text-green-500" : "text-red-500"
                }`}
              >
                {account.status === "CONNECTED" ? "● Connected" : "○ Disconnected"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        {account.status === "CONNECTED" ? (
          <Button
            variant="outline"
            onClick={handleConnectionOfAccount}
            disabled={isLoading}
            className="hover:bg-primary/5"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Disconnect"}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setIsLoading(true);
              window.location.href = instagramAuthUrl;
            }}
            disabled={isLoading}
            className="hover:bg-primary/5"
          >
            Connect
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          disabled={isDeleting}
          onClick={handleDeleteInstagramAccount}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          {isDeleting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
