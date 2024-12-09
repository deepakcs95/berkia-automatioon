import React  from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"  
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { InstaAccountProps } from '../../account/_components/account-card'
import { PostSelector } from './post-selector'
import { Textarea } from '@/components/ui/textarea'
import { AutomationFormSection } from './ui/automation-form-section'
import { useAutomationForm } from './hooks/useAutomationForm'
import { toast } from 'sonner'

interface Props {
  initialAccounts:InstaAccountProps[],
  setIsCreating:React.Dispatch<React.SetStateAction<boolean>>
}
 


export default function   AddAutomation({initialAccounts,setIsCreating}: Props) { 


    
const  {state,handleAccountChange,handleTriggerChange,handleActionChange,resetForm,validation}  = useAutomationForm(initialAccounts)


 


  const handleSaveNewAutomation = (formData:FormData) => {
    console.log("Saving new automation...");
console.log(formData.get('triggerKeyword'));
    
  };

  return (
    <>
    <Card className="mb-8 border-primary/50">
          <CardHeader>
            <CardTitle className="text-xl">New Automation</CardTitle>
            <CardDescription>Configure your new automation</CardDescription>
          </CardHeader>
          <CardContent>

{/* Select Account */}

            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Select Account</label>
              <Select
                value={state.account?.id}
                onValueChange={(value) => {
                  handleAccountChange(value);
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

{/* Trigger */}

            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-center">
              
              <AutomationFormSection
                title="Trigger"
                description="When this happens..."
              > 
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <Select
                    defaultValue='comment'
                      value={state.trigger?.type}
                      onValueChange={(value: 'comment' | 'message') => {
                         handleTriggerChange(value, state.trigger?.keyword || '');
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
                      value={state.trigger?.keyword || ''}
                      onChange={(e) => {
                        handleTriggerChange(state.trigger?.type || 'comment', e.target.value);
                      }}
                      placeholder="Enter trigger keyword"
                    />
                  </div>
                </AutomationFormSection>

              <div className="flex items-center justify-center h-full">
                <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block " />
                <ArrowDown className="h-6 w-6 text-muted-foreground block md:hidden" />
              </div>

{/* Action */}
                   <AutomationFormSection
                title="Action"
                description="Do this...">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Reply with</label>
                    <Input
                    value={state.actions?.commentReply?.content || ''}
                      disabled={state.trigger?.type === "message"}
                      onChange={(e) => {
                        handleActionChange('commentReply', e.target.value);
                      }}
                      placeholder="Enter response message"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Message</label>
                    <Textarea
                      value={state.actions?.messageReply?.content || ''}
                      onChange={(e) => {
                         handleActionChange('messageReply', e.target.value);
                      }}
                      placeholder="Enter response message"
                    />
                  </div>
                  </AutomationFormSection>


{/* 
Posts

*/}
            {state.trigger?.type === "comment"    &&  <><div className="flex items-center justify-center h-full">
                <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block " />
                <ArrowDown className="h-6 w-6 text-muted-foreground block md:hidden" />
              </div>

              <AutomationFormSection
                title="Apply"
                description="Apply this to..."
                className='md:h-full'
              >
              
                  <div>
                    <label className="text-sm font-medium mb-1 block">Posts</label>
                     
                    <PostSelector initialAccounts={initialAccounts} />
                  </div>
                  </AutomationFormSection>

              
              </>
              }
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsCreating(false);
              }}
            >
              Cancel
            </Button>
            <Button 
            onClick={() => {
              toast.success("Automation created successfully");
              setIsCreating(false);
            }}
              disabled={
                !validation.isValid
              }>
              Save Automation
            </Button>
          </CardFooter>
        </Card>
       </>
  )
}
