import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatbotFormProps {
  values: {
    name: string;
    context: string;
    tone: 'professional' | 'casual' | 'friendly';
    prompt: string;
  };
  onChange: (field: string, value: string) => void;
  showAccountSelect?: boolean;
  accounts?: Array<{ id: string; username: string }>;
  selectedAccountId?: string;
  onAccountChange?: (value: string) => void;
}

export function ChatbotForm({
  values,
  onChange,
  showAccountSelect = false,
  accounts = [],
  selectedAccountId,
  onAccountChange,
}: ChatbotFormProps) {
  return (
    <div className="space-y-4">
      {showAccountSelect && accounts.length > 0 && onAccountChange && (
        <div>
          <label className="text-sm font-medium mb-1 block">Select Account</label>
          <Select
            value={selectedAccountId}
            onValueChange={onAccountChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Instagram Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  @{account.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="text-sm font-medium mb-1 block">Name</label>
        <Input
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="e.g., Main Chatbot"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Context</label>
        <Textarea
          value={values.context}
          onChange={(e) => onChange('context', e.target.value)}
          placeholder="Add context about your business or services"
          className="min-h-[100px]"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Response Tone</label>
        <Select
          value={values.tone}
          onValueChange={(value: 'professional' | 'casual' | 'friendly') => 
            onChange('tone', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Response Template</label>
        <Textarea
          value={values.prompt}
          onChange={(e) => onChange('prompt', e.target.value)}
          placeholder="Enter your response template. Use {customer} for customer name and {query} for their message"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}