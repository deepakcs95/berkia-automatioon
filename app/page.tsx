import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, CheckCircle, Clock } from "lucide-react";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <section className="w-full  py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container mx-auto px-4 md:px-6  ">
              <div className="flex flex-col items-center     space-y-4 text-center">
                <div className="space-y-2 flex flex-col items-center gap-4 md:gap-8">
                  <h1 className="text-3xl max-w-[20ch] text-center font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Automate Your Instagram Engagement
                  </h1>
                  <p className="mx-auto max-w-[50ch] max text-gray-500 md:text-xl dark:text-gray-400">
                    Boost your Instagram presence with automated replies and scheduled posts. Save
                    time and grow your audience effortlessly.
                  </p>
                </div>
                <div className="space-x-4 md:space-x-8">
                  <Button size="lg">Get Started</Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section
            id="features"
            className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
          >
            <div className="container mx-auto sm:px-2 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                Key Features
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Automated Replies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Set up custom triggers and responses for comments and messages. Never miss an
                      engagement opportunity.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Post Scheduling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Plan and schedule your posts in advance. Maintain a consistent presence
                      without the daily hassle.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                How It Works
              </h2>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                  <MessageCircle className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Set Up Triggers</h3>
                  <p>Define keywords or phrases that will activate your automated responses.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Create Responses</h3>
                  <p>
                    Craft personalized responses for each trigger to engage your audience
                    effectively.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Clock className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Schedule Posts</h3>
                  <p>
                    Plan your content calendar and let our system post for you at optimal times.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section
            id="pricing"
            className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
          >
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                Pricing Plans
              </h2>
              <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold mb-2">$9.99/mo</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>50 automated replies per month</li>
                      <li>10 scheduled posts per month</li>
                      <li>Basic analytics</li>
                    </ul>
                    <Button className="w-full mt-4">Choose Plan</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Pro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold mb-2">$19.99/mo</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Unlimited automated replies</li>
                      <li>50 scheduled posts per month</li>
                      <li>Advanced analytics</li>
                      <li>Priority support</li>
                    </ul>
                    <Button className="w-full mt-4">Choose Plan</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold mb-2">Custom</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Unlimited automated replies</li>
                      <li>Unlimited scheduled posts</li>
                      <li>Custom integrations</li>
                      <li>Dedicated account manager</li>
                    </ul>
                    <Button className="w-full mt-4">Contact Sales</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
