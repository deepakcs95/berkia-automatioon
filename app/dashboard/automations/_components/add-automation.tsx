import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"  
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import Image from 'next/image'
import { InstaAccountProps } from '../../account/_components/account-card'
import { NewAutomation } from './automation-card'
import { z } from 'zod'
import { getInstagramPostsByAccountId } from '@/app/actions/instagram/actions'
import { useQuery } from '@tanstack/react-query'
import { PostSelector } from './post-selector'



const automationSchema = z.object({
    accountId: z.string().min(1, "Please select an Instagram account"),
    trigger: z.object({
      type: z.enum(['comment', 'message'], { 
        required_error: "Please select a trigger type" 
      }),
      keyword: z.string().min(1, "Trigger keyword is required").max(20, "Trigger keyword cannot exceed 20 characters")
    }),
    action: z.object({
      type: z.enum(['reply', 'message'], { 
        required_error: "Please select an action type" 
      }),
      content: z.string().min(1, "Action message content is required").max(50, "Action message content cannot exceed 50 characters")
    })
  });



export default function AddAutomation({initialAccounts}: {initialAccounts:InstaAccountProps[]}) { 


    



  const [selectedAccount, setSelectedAccount] = useState(initialAccounts[0].account_id);
  const [newAutomation, setNewAutomation] = useState<NewAutomation>({
    accountId: '',
    trigger: { type: 'comment', keyword: '' },
    action: { type: 'reply', content: '' }
    
  });



  const handleSaveNewAutomation = (formData:FormData) => {
    console.log("Saving new automation...");
    
    console.log(formData);
    
  };

  return (
    <>
    <form >
    <Card className="mb-8 border-primary/50">
          <CardHeader>
            <CardTitle className="text-xl">New Automation</CardTitle>
            <CardDescription>Configure your new automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Select Account</label>
              <Select
                defaultValue={initialAccounts[0].account_id}
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
                  {initialAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.account_id}>
                      <div className="flex items-center justify-center gap-3"> 
                      <Image src={account.profile_picture_url || ''} alt="Account" className="rounded-full  "  width={15} height={15} />
                        
                      <p>@{account.username}</p>
                      <span>{account.status ===  "CONNECTED" ? "Connected" : "Disconnected"}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-center">
              <Card className='flex-1'>
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
                <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block " />
                <ArrowDown className="h-6 w-6 text-muted-foreground block md:hidden" />
              </div>

              <Card  >
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

            {((newAutomation.trigger.type === "comment" && newAutomation.trigger.keyword !== "") || (newAutomation.action.type === "reply" && newAutomation.action.content !== ""))  &&  <><div className="flex items-center justify-center h-full">
                <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block " />
                <ArrowDown className="h-6 w-6 text-muted-foreground block md:hidden" />
              </div>

              <Card className='md:h-full'>
                <CardHeader>
                  <CardTitle className="text-base">Apply</CardTitle>
                  <CardDescription>Apply this to...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Posts</label>
                     
                    <PostSelector initialAccounts={initialAccounts} />
                  </div>
                </CardContent>
              </Card></>
              }
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
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
            formAction={handleSaveNewAutomation}
              disabled={!newAutomation.trigger.keyword || !newAutomation.action.content}
            >
              Save Automation
            </Button>
          </CardFooter>
        </Card>
        </form>
       </>
  )
}
