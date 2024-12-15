import { memo } from "react";
import {
  useForm,
  Controller,
  Control,
  FormState,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChatbot } from "./Context";
import AccountSelect from "@/components/global/AccountSelect";
 import { ChatbotFormData } from "@/lib/validator/chatbot";

interface Props {
  control: Control<ChatbotFormData>;
  errors: FieldErrors<ChatbotFormData>;
}

const ChatbotForm = memo(({ control, errors }: Props) => {
  const { accounts } = useChatbot();

  return (
    <div className="space-y-4">
      {accounts && accounts.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-1 block">
            Select Account
          </label>
          <Controller
            name="socialAccountId"
            control={control}
            render={({ field }) => (
              <Select
                defaultValue={field.value || ""}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Instagram Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                  
                      <SelectItem key={account.id} value={account.id}>
                        <AccountSelect
                          status={account.status}
                          username={account.username}
                          profilePictureUrl={account.profilePictureUrl}
                        />
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium mb-1 block">Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div>
              <Input {...field} placeholder="e.g., Main Chatbot" />
              {errors && errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Context</label>
        <Controller
          name="context"
          control={control}
          render={({ field }) => (
            <div>
              <Textarea
                {...field}
                placeholder="Add context about your business or services"
                className="min-h-[100px]"
              />
              {errors && errors.context && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.context.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Response Tone</label>
        <Controller
          name="responseTone"
          control={control}
          render={({ field }) => (
            <div>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Response Tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
              {errors && errors.responseTone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.responseTone.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          Response Template
        </label>
        <Controller
          name="responseTemplate"
          control={control}
          render={({ field }) => (
            <div>
              <Textarea
                {...field}
                placeholder="Enter your response template. Use {customer} for customer name and {query} for their message"
                className="min-h-[100px]"
              />
              {errors.responseTemplate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors && errors.responseTemplate.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
});

ChatbotForm.displayName = "ChatbotForm";

export default ChatbotForm;
