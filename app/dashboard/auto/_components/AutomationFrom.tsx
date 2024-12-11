

import React, { useMemo }    from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { AutomationsType } from '@/lib/types';
import { SocialAccountArrayType } from '@/lib/db/automations'
import { useForm, Controller   } from 'react-hook-form';
import { AutomationFormSection } from './ui/AutomationFormSection'
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from '@/components/ui/textarea'
import { PostSelector } from './PostSelector'
import { AutomationSchema, AutomationSchemaType } from '@/lib/validator/automation'

interface AutomationFormProps {
  accounts: SocialAccountArrayType
  onSubmit: (data:AutomationSchemaType,automation:AutomationsType) => void
  onCancel: () => void
  automation?: AutomationsType
  submitText: string
}

 
 

export default function AutomationForm({
  onSubmit,
  onCancel,
  automation,
  accounts,
  submitText,
}: AutomationFormProps) {


    const { 
        register, 
        watch,
        handleSubmit, 
        control,
        setValue,
        clearErrors,
        formState: { errors } 
      } = useForm<AutomationSchemaType>({
        defaultValues: {
            account_Id: accounts.find(account => account.account_id === automation?.account_id)?.account_id || accounts[0]?.account_id || '',
            trigger_type:automation?.triggers?.type || 'comment',
            trigger_keyword: automation?.triggers?.keyword || '',
            comment_action: automation?.actions?.find(action => action?.type === 'commentReply')?.content || '',
            message_action: automation?.actions?.find(action => action?.type === 'messageReply')?.content || '',
            selectedPosts: automation?.target_posts || []
        }
        ,resolver:zodResolver(AutomationSchema)
      });




      const onsubSubmit = handleSubmit((data) => {
        
        onSubmit(data,automation!)
      })

      const trigger_type = watch('trigger_type');
      const trigger_keyword = watch('trigger_keyword');
      const selectedPosts = watch('selectedPosts');


      React.useEffect(() => {
        if (trigger_type.trim() === 'message') {
          setValue('comment_action', '');  
        }
      }, [trigger_type, setValue]);
     

      console.log(accounts);
      

  return (
     <><form  onSubmit={onsubSubmit} action="">
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Select Account</label>
          <Controller 
            name="account_Id"
            control={control}
            render={({ field }) => (
          <Select
            {...field} 
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
            }}
            

          >
            <SelectTrigger>
              <SelectValue placeholder="Select Instagram Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.account_id}>
                  <div className="flex items-center justify-center gap-3">
                    <Image src={account.profile_picture_url || ''} alt="Account" className="rounded-full" unoptimized   loading='lazy' quality={20} width={15} height={15} />
                    <p>@{account.username}</p>
                    <span>{account.status === "CONNECTED" ? "Connected" : "Disconnected"}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>)}
          />
          {errors.account_Id && (
        <p className="text-red-500 text-sm mt-1">
          {errors.account_Id.message}
        </p>
      )}
        </div>

        {/* Trigger */}
        <div className={cn("grid   gap-4",automation?.triggers?.type === 'comment' ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
        <AutomationFormSection
          title="Trigger"
          description="When this happens..."
        >
          <div>
            <label className="text-sm font-medium mb-1 block">Type</label>
            <Controller 
            name="trigger_type"
            control={control}
            render={({ field }) => (
            <Select
              {...field} 
            value={field.value}
            onValueChange={(value) => {
                clearErrors();
              field.onChange(value);
            }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comment">Comment</SelectItem>
                <SelectItem value="message">Message</SelectItem>
              </SelectContent>
            </Select>)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Keyword</label>
            <Input
              placeholder="Enter trigger keyword"
              {...register('trigger_keyword')}
                
              value={trigger_keyword.replace(/\s+/g, '')}
            />
            {errors.trigger_keyword && (
        <p className="text-red-500 text-sm mt-1">
          {errors.trigger_keyword.message}
        </p>
      )}
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
              disabled={trigger_type.trim() === 'message'}
              
              placeholder="Enter your response"
              {...register('comment_action')}
               
            />
            {errors.comment_action && (
        <p className="text-red-500 text-sm mt-1">
          {errors.comment_action.message}
          </p>)}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Response with Message</label>
            <Textarea
              placeholder="Enter your response"
              {...register('message_action')}
              
            />
            {errors.message_action && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message_action.message}
                  </p>)}
          </div>
        </AutomationFormSection>

        {/* Post Selector */}
        {trigger_type.trim() === 'comment' && (
          <AutomationFormSection
            title="Apply to posts"
            description="Apply this automation to these posts"
          >
            <div className="mt-4">
              <label className="text-sm font-medium mb-1 block">Select Posts</label>
              <Controller 
            name="selectedPosts"
            control={control}
            render={({ field }) => (
              <PostSelector field={
                {...field,value:field.value as string[],
                   onChange:((newValue: string[]) => field.onChange(newValue))
                  }}
                    postaccountId={accounts.find(account => account.account_id === automation?.account_id)?.account_id || accounts[0]?.account_id || ''}
                     selectedPosts={selectedPosts || []}/>
            )}
            /> 
            {errors.selectedPosts && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.selectedPosts.message}
                  </p>)}
            </div>
        </AutomationFormSection>)}
        </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' onClick={onsubSubmit}  >
          {submitText}
        </Button>
      </div>
     </form>

      </>
  )
}
