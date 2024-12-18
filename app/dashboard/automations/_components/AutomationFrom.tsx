import { useMemo, useEffect, memo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
 import { cn } from "@/lib/utils/utils";
  import { useForm, Controller } from "react-hook-form";
import { AutomationFormSection } from "./ui/AutomationFormSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { PostSelector } from "./PostSelector";
import {
  AutomationSchema,
  AutomationSchemaType,
} from "@/lib/validator/automation";
import {
  ActionType,
  SocialConnectionStatus,
  TriggerType,
} from "@prisma/client";
import AccountSelect from "@/components/global/AccountSelect";
import { useAutomation } from "@/hooks/useAutomation";
 
const AutomationForm = memo(({ submitText }: { submitText: string }) => {
  const {
    setOpenForm,
    editingAutomation,
    optimisticAccounts,
    isEditing,
    handleCreateAutomation,
    handleUpdateAutomation,
  } = useAutomation();

  const defaultValues = useMemo(() => {
    return ({
      accountId: optimisticAccounts.find(
        (account) => account.accountId === editingAutomation?.accountId
      )?.accountId || optimisticAccounts[0]?.accountId || "",
      triggerType: editingAutomation?.triggers?.type || TriggerType.COMMENT,
      triggerKeyword: editingAutomation?.triggers?.keyword || "",
      commentAction:
        editingAutomation?.actions?.find(
          (action) => action?.type === ActionType.COMMENT_REPLY
        )?.content || "",
      messageAction:
        editingAutomation?.actions?.find(
          (action) => action?.type === ActionType.MESSAGE_REPLY
        )?.content || "",
      selectedPosts: editingAutomation?.targetPosts || [],
    });
  }, [editingAutomation, optimisticAccounts]);

 const  postaccountId= useMemo(() => {
    return optimisticAccounts.find(
      (account) =>
        account.accountId === editingAutomation?.accountId
    )?.accountId ||
    optimisticAccounts[0]?.accountId ||
    ""
  }, [editingAutomation, optimisticAccounts]);

  const {
    register,
    watch,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<AutomationSchemaType>({
    defaultValues,
    resolver: zodResolver(AutomationSchema),
  });

console.log(editingAutomation,optimisticAccounts[0]?.accountId);


  const onsubSubmit = handleSubmit((data) => {
    console.log(data);
    if (isEditing) handleUpdateAutomation(data, editingAutomation!);
    else handleCreateAutomation(data);
  });

  const trigger_type = watch("triggerType");
  const trigger_keyword = watch("triggerKeyword");
 
  useEffect(() => {
    if (trigger_type.trim() === TriggerType.MESSAGE) {
      setValue("commentAction", "");
    }
  }, [trigger_type, setValue]);

  return (
    <>
      <form onSubmit={onsubSubmit} action="">
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">
            Select Account
          </label>
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
                  {optimisticAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.accountId}>
                      <AccountSelect
                        username={account.username}
                        profilePictureUrl={account.profilePictureUrl}
                        status={account.status}
                      />
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
        <div
          className={cn(
            "grid   gap-4",
            editingAutomation?.triggers?.type === TriggerType.COMMENT
              ? "md:grid-cols-3"
              : "md:grid-cols-2"
          )}
        >
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
                      <SelectItem value={TriggerType.COMMENT}>
                        Comment
                      </SelectItem>
                      <SelectItem value={TriggerType.MESSAGE}>
                        Message
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Keyword</label>
              <Input
                placeholder="Enter trigger keyword"
                {...register("triggerKeyword")}
                value={trigger_keyword.replace(/\s+/g, "")}
              />
              {errors.triggerKeyword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.triggerKeyword.message}
                </p>
              )}
            </div>
          </AutomationFormSection>

          {/* Action */}
          <AutomationFormSection title="Action" description="Then do this...">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Response with Comment
              </label>
              <Input
                disabled={trigger_type === "MESSAGE"}
                placeholder="Enter your response"
                {...register("commentAction")}
              />
              {errors.commentAction && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.commentAction.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Response with Message
              </label>
              <Textarea
                placeholder="Enter your response"
                {...register("messageAction")}
              />
              {errors.messageAction && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.messageAction.message}
                </p>
              )}
            </div>
          </AutomationFormSection>

          {/* Post Selector */}
          {trigger_type === "COMMENT" && (
            <AutomationFormSection
              className="md:col-span-2"
              title="Apply to posts"
              description="Apply this automation to these posts"
            >
              <div className="mt-4">
                <label className="text-sm font-medium mb-1 block">
                  Select Posts
                </label>
                <Controller
                  name="selectedPosts"
                  control={control}
                  render={({ field }) => (
                    <PostSelector
                      field={{
                        ...field,
                        value: field.value as string[],
                        onChange: (newValue: string[]) =>
                          field.onChange(newValue),
                      }}
                      postaccountId={postaccountId}
                      selectedPosts={field.value || []}
                    />
                  )}
                />
                {errors.selectedPosts && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.selectedPosts.message}
                  </p>
                )}
              </div>
            </AutomationFormSection>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenForm(false)}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={onsubSubmit}>
            {submitText}
          </Button>
        </div>
      </form>
    </>
  );
});

AutomationForm.displayName = "AutomationForm";

export default AutomationForm;
