"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=9584644174883499&redirect_uri=${process.env.NEXT_PUBLIC_URL}/callback/instagram&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`;

export function AddAccount() {
  const handleAddAccount = async () => {
    
    window.location.href = instagramAuthUrl;
  };

  return (
    <Card className="border-dashed hover:border-primary/50 transition-colors">
      <CardContent className="pt-6 w-3xl">
        <Button
          variant="ghost"
          className="w-full h-40 flex flex-col gap-4 group"
          onClick={handleAddAccount}
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
  );
}
