import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { InstaAccountProps } from '../../account/_components/account-card'
import { PostSelector } from './post-selector'
import { AutomationFormSection } from './ui/automation-form-section'
import { useAutomationForm } from './hooks/useAutomationForm'
import { cn } from '@/lib/utils'

interface AutomationFormProps {
  initialAccounts: InstaAccountProps[]
  onSubmit: () => void
  onCancel: () => void
  title: string
  description: string
  submitText: string
  
}

export function AutomationForm({
  initialAccounts,
  onSubmit,
  onCancel,
  title,
  description,
  submitText,
}: AutomationFormProps) {
  const { state, handleAccountChange, handleTriggerChange, handleActionChange, resetForm, validation } = useAutomationForm(initialAccounts)

  return (
     <>
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
                    <Image src={account.profile_picture_url || ''} alt="Account" className="rounded-full" width={15} height={15} />
                    <p>@{account.username}</p>
                    <span>{account.status === "CONNECTED" ? "Connected" : "Disconnected"}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Trigger */}
        <div className={cn("grid   gap-4",state.trigger?.type === 'comment' ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
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
              placeholder="Enter trigger keyword"
              value={state.trigger?.keyword || ''}
              onChange={(e) => handleTriggerChange(state.trigger?.type || 'comment', e.target.value)}
            />
          </div>
        </AutomationFormSection>

        {/* Action */}
        <AutomationFormSection
          title="Action"
          description="Then do this..."
        >
           
          <div>
            <label className="text-sm font-medium mb-1 block">Response with Comment</label>
            <Input
            disabled={state.trigger?.type === 'message'}
              placeholder="Enter your response"
              value={state.actions.commentReply?.content || ''}
              onChange={(e) => {
                handleActionChange(
                  'commentReply',
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Response with Message</label>
            <Input
              placeholder="Enter your response"
              value={state.actions.messageReply?.content || ''}
              onChange={(e) => {
                handleActionChange(
                  'messageReply',
                  e.target.value
                );
              }}
            />
          </div>
        </AutomationFormSection>

        {/* Post Selector */}
        {state.trigger?.type === 'comment' && (
          <AutomationFormSection
            title="Apply to posts"
            description="Apply this automation to these posts"
          >
            <div className="mt-4">
              <label className="text-sm font-medium mb-1 block">Select Posts</label>
              <PostSelector initialAccounts={initialAccounts} />
            </div>
        </AutomationFormSection>)}
        </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!validation.isValid}>
          {submitText}
        </Button>
      </div>
      </>
  )
}
