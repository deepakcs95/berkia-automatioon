

import   { useMemo ,useEffect}    from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { cn } from '@/lib/utils/utils'
import { AutomationsType } from '@/lib/types';
import { SocialAccountArrayType } from '@/lib/db/automations'
import { useForm, Controller   } from 'react-hook-form';
import { AutomationFormSection } from './ui/AutomationFormSection'
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from '@/components/ui/textarea'
import { PostSelector } from './PostSelector'
import { AutomationSchema, AutomationSchemaType } from '@/lib/validator/automation'
import { ActionType, SocialConnectionStatus, TriggerType } from '@prisma/client'

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
            accountId: accounts.find(account => account.accountId === automation?.accountId)?.accountId || accounts[0]?.accountId || '',
            triggerType:automation?.triggers?.type || TriggerType.COMMENT,
            triggerKeyword: automation?.triggers?.keyword || '',
            commentAction: automation?.actions?.find(action => action?.type === ActionType.COMMENT_REPLY)?.content || '',
            messageAction: automation?.actions?.find(action => action?.type === ActionType.MESSAGE_REPLY)?.content || '',
            selectedPosts: automation?.targetPosts || []
        }
        ,resolver:zodResolver(AutomationSchema)
      });




      const onsubSubmit = handleSubmit((data) => {
        
        onSubmit(data,automation!)
      })

      const trigger_type = watch('triggerType');
      const trigger_keyword = watch('triggerKeyword');
      const selectedPosts = watch('selectedPosts');


      useEffect(() => {
        if (trigger_type.trim() === TriggerType.MESSAGE) {
          setValue('commentAction', '');  
        }
      }, [trigger_type, setValue]);
     

      console.log(accounts);
      

  return (
     <><form  onSubmit={onsubSubmit} action="">
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Select Account</label>
          <Controller 
            name="accountId"
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
                <SelectItem key={account.id} value={account.accountId}>
                  <div className="flex items-center justify-center gap-3">
                    <Image src={account.profilePictureUrl || ''} alt="Account" className="rounded-full" unoptimized   loading='lazy' quality={20} width={15} height={15} />
                    <p>@{account.username}</p>
                    
                     
                    <span  className={cn(
              "text-sm",
              account.status === SocialConnectionStatus.CONNECTED ? "text-green-500" : "text-red-500"
            )} >●</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
          />
          {errors.accountId && (
        <p className="text-red-500 text-sm mt-1">
          {errors.accountId.message}
        </p>
      )}
        </div>

        {/* Trigger */}
        <div className={cn("grid   gap-4",automation?.triggers?.type === TriggerType.COMMENT ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
        <AutomationFormSection
          title="Trigger"
          description="When this happens..."
        >
          <div>
            <label className="text-sm font-medium mb-1 block">Type</label>
            <Controller 
            name="triggerType"
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
                <SelectItem value={TriggerType.COMMENT}>Comment</SelectItem>
                <SelectItem value={TriggerType.MESSAGE}>Message</SelectItem>
              </SelectContent>
            </Select>)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Keyword</label>
            <Input
              placeholder="Enter trigger keyword"
              {...register('triggerKeyword')}
                
              value={trigger_keyword.replace(/\s+/g, '')}
            />
            {errors.triggerKeyword && (
        <p className="text-red-500 text-sm mt-1">
          {errors.triggerKeyword.message}
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
              {...register('commentAction')}
               
            />
            {errors.commentAction && (
        <p className="text-red-500 text-sm mt-1">
          {errors.commentAction.message}
          </p>)}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Response with Message</label>
            <Textarea
              placeholder="Enter your response"
              {...register('messageAction')}
              
            />
            {errors.messageAction && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.messageAction.message}
                  </p>)}
          </div>
        </AutomationFormSection>

        {/* Post Selector */}
        {trigger_type.trim() === 'comment' && (
          <AutomationFormSection
          className='md:col-span-2'
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
                    postaccountId={accounts.find(account => account.accountId === automation?.accountId)?.accountId || accounts[0]?.accountId || ''}
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

      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
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
