import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface AutomationFormSectionProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export const AutomationFormSection = ({
  title,
  description,
  children,
  className = "",
}: AutomationFormSectionProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

