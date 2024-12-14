"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ArrowRight,
  ArrowUp,
  Bot,
  Clock,
  Instagram,
  MessageSquare,
  Settings2,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface MetricCard {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  description: string;
  icon: React.ReactNode;
}

interface RecentActivity {
  id: string;
  type: "message" | "automation" | "account";
  content: string;
  timestamp: string;
  account: string;
}

const metrics: MetricCard[] = [
  {
    title: "Total Messages",
    value: "1,234",
    change: "+12.3%",
    trend: "up",
    description: "Messages handled this month",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: "Active Automations",
    value: "23",
    change: "+5",
    trend: "up",
    description: "Running automation rules",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    title: "Response Time",
    value: "1.2s",
    change: "-0.3s",
    trend: "up",
    description: "Average response time",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    title: "Active Accounts",
    value: "5",
    description: "Connected Instagram accounts",
    icon: <Users className="h-4 w-4" />,
  },
];

const recentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "message",
    content: "New inquiry about product pricing",
    timestamp: "2 minutes ago",
    account: "example_store",
  },
  {
    id: "2",
    type: "automation",
    content: "Comment automation triggered",
    timestamp: "5 minutes ago",
    account: "brand_official",
  },
  {
    id: "3",
    type: "account",
    content: "Account successfully connected",
    timestamp: "10 minutes ago",
    account: "new_account",
  },
  {
    id: "4",
    type: "message",
    content: "Customer support query resolved",
    timestamp: "15 minutes ago",
    account: "example_store",
  },
];

const accounts = [
  {
    username: "example_store",
    followers: "12.5K",
    engagement: "3.2%",
    status: "active",
  },
  {
    username: "brand_official",
    followers: "45.2K",
    engagement: "4.1%",
    status: "active",
  },
  {
    username: "new_account",
    followers: "5.7K",
    engagement: "2.8%",
    status: "active",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your Instagram automation metrics
          </p>
        </div>
        <Button>
          <Settings2 className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.change && (
                <p className="text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "inline-flex items-center",
                      metric.trend === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowUp className="mr-1 h-3 w-3 transform rotate-180" />
                    )}
                    {metric.change}
                  </span>{" "}
                  from last month
                </p>
              )}
              {!metric.change && (
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Activity Feed */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and events across your accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      @{activity.account}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>
              Performance metrics for your Instagram accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {accounts.map((account) => (
                <div
                  key={account.username}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <Instagram className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">@{account.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.followers} followers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{account.engagement}</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <span>Chatbot Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Response Rate</span>
                <span className="text-sm font-medium">98.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. Response Time</span>
                <span className="text-sm font-medium">1.2s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Satisfaction Rate</span>
                <span className="text-sm font-medium">4.8/5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Automation Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Active Rules</span>
                <span className="text-sm font-medium">23/50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Triggers Today</span>
                <span className="text-sm font-medium">142</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium">99.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Message Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Messages</span>
                <span className="text-sm font-medium">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Unique Users</span>
                <span className="text-sm font-medium">892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Peak Hours</span>
                <span className="text-sm font-medium">2PM - 5PM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
