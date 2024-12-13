import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock, MessageCircle, ArrowRight } from "lucide-react";
import Header from "@/components/global/Header";
export default function LearnMore() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-3xl   text-center font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
              Discover the Power of Instagram Automation
            </h1>
            <p className="max-w-[700px] text-center text-gray-500 md:text-xl dark:text-gray-400 mb-12">
              Learn how InstaAutomate can revolutionize your Instagram engagement and save you
              countless hours.
            </p>
            <div className="grid gap-6 lg:grid-cols-2 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-6 w-6 mr-2" />
                    Automated Replies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Our intelligent system allows you to set up custom triggers and responses for
                    comments and direct messages. Heres how it works:
                  </p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Define keywords or phrases that will activate your automated responses</li>
                    <li>Create personalized responses for each trigger</li>
                    <li>Our system monitors your Instagram activity 24/7</li>
                    <li>
                      When a trigger is detected, the corresponding response is sent instantly
                    </li>
                  </ol>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-6 w-6 mr-2" />
                    Post Scheduling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Plan and schedule your posts in advance to maintain a consistent presence
                    without the daily hassle:
                  </p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Upload your content (images, videos, captions) to our platform</li>
                    <li>Set the date and time for each post to go live</li>
                    <li>
                      Our system will automatically publish your content at the scheduled time
                    </li>
                    <li>Track performance and adjust your strategy with our analytics tools</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-4">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it against Instagram&lsquo;s terms of service?</AccordionTrigger>
                <AccordionContent>
                  Our service is designed to comply with Instagram&lsquo;s terms of service. We use
                  official APIs and follow best practices to ensure that your account remains in
                  good standing.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I set up automated replies?</AccordionTrigger>
                <AccordionContent>
                  Setting up automated replies is easy. In your dashboard, you can create triggers
                  (keywords or phrases) and their corresponding responses. Our system will then
                  automatically reply when these triggers are detected in comments or messages.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I schedule Stories and Reels?</AccordionTrigger>
                <AccordionContent>
                  Yes, our platform supports scheduling for feed posts, Stories, and Reels. You can
                  upload your content and set specific times for each to be published automatically.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How does pricing work?</AccordionTrigger>
                <AccordionContent>
                  We offer tiered pricing plans to suit different needs. Our basic plan starts at
                  $9.99/month, which includes 50 automated replies and 10 scheduled posts per month.
                  For more details, please check our pricing page.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container flex flex-col items-center mx-auto px-4 md:px-6">
            <h2 className="text-3xl    text-center font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Ready to Automate Your Instagram?
            </h2>
            <p className="max-w-[700px] text-center text-gray-500 md:text-xl dark:text-gray-400 mb-8">
              Join thousands of content creators and businesses who are saving time and boosting
              engagement with InstaAutomate.
            </p>
            <Button size="lg" className="inline-flex items-center">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
