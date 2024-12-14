import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils/utils";

interface SubmitButtonProps {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    isLoading: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}
 
export default function SubmitButton({
    isLoading,
    onClick,
    children,
    variant = 'outline',
    className
}: SubmitButtonProps) {
  return (
    <Button  
            variant={variant}
            onClick={onClick}
           data-loading={isLoading}
  className={cn("border px-3 py-2 rounded-md shadow-sm group active:scale-95 transition-all relative", className)}
>
  <span className="group-data-[loading=true]:opacity-0">{children}</span>
  <span className="opacity-0 group-data-[loading=true]:opacity-100 inset-0 absolute flex justify-center items-center animate-spin"><Loader2 className="h-4 w-4 animate-spin" /></span>
          </Button>
  )
}
