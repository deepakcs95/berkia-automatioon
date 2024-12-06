"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Sparkles, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  maxAccounts: number;
  buttonText: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$9",
    description: "Perfect for individuals getting started with Instagram automation",
    maxAccounts: 1,
    features: [
      "1 Instagram Account",
      "Basic Chatbot Responses",
      "5 Automation Rules",
      "24-hour Response Time",
      "Community Support",
    ],
    buttonText: "Start Free Trial",
  },
  {
    name: "Pro",
    price: "$29",
    description: "Ideal for growing businesses and content creators",
    maxAccounts: 3,
    features: [
      "3 Instagram Accounts",
      "Advanced Chatbot with Context",
      "15 Automation Rules",
      "1-hour Response Time",
      "Priority Support",
      "Analytics Dashboard",
      "Custom Response Templates",
    ],
    highlighted: true,
    buttonText: "Get Started",
  },
  {
    name: "Business",
    price: "$79",
    description: "For businesses requiring advanced automation and analytics",
    maxAccounts: 10,
    features: [
      "10 Instagram Accounts",
      "AI-Powered Chatbot",
      "Unlimited Automation Rules",
      "Instant Response Time",
      "24/7 Premium Support",
      "Advanced Analytics",
      "Custom Integration",
      "Dedicated Account Manager",
      "API Access",
    ],
    buttonText: "Contact Sales",
  },
];

export default function BillingPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className= " mb-7  ">
        <h2 className="text-3xl font-bold tracking-tight">Pricing and Billing</h2>
        <p className="text-muted-foreground">
          Choose the plan that works best for you
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(
              "relative flex flex-col justify-between",
              tier.highlighted && "border-primary shadow-lg"
            )}
          >
            {tier.highlighted && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <Badge className="bg-primary hover:bg-primary">
                  <Star className="mr-1 h-3 w-3" /> Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {tier.name}
                <span className="text-2xl font-bold">
                  {tier.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /mo
                  </span>
                </span>
              </CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  {tier.name === "Starter" && <Sparkles className="h-5 w-5" />}
                  {tier.name === "Pro" && <Zap className="h-5 w-5" />}
                  {tier.name === "Business" && <CreditCard className="h-5 w-5" />}
                  <span className="font-medium">
                    Up to {tier.maxAccounts} Instagram {tier.maxAccounts === 1 ? "Account" : "Accounts"}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                className={cn(
                  "w-full  mt-auto",
                  tier.highlighted ? "bg-primary" : "bg-secondary"
                )}
              >
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">All Plans Include</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">No Credit Card Required</h4>
                    <p className="text-sm text-muted-foreground">
                      Start your free trial without any commitment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Cancel Anytime</h4>
                    <p className="text-sm text-muted-foreground">
                      No long-term contracts or commitments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">24/7 Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Get help whenever you need it
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Can I change plans later?</CardTitle>
                <CardDescription>
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What payment methods do you accept?</CardTitle>
                <CardDescription>
                  We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Is there a free trial?</CardTitle>
                <CardDescription>
                  Yes, all plans come with a 14-day free trial. No credit card required to start.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What happens if I exceed my account limit?</CardTitle>
                <CardDescription>
                  You'll need to upgrade to a higher plan to add more Instagram accounts. We'll notify you when you're close to your limit.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
