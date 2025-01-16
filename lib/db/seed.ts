import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.subscription.deleteMany({})
  await prisma.plan.deleteMany({})
  const subscriptionPlans = await prisma.plan.createMany({
    data: [
      {
        name: 'FREE',
        price: 0,
        description: "Perfect for individuals getting started with Instagram automation",
        maxAccounts: 1,
        maxChatBots: 1,
        maxComments: 5,
        maxMessages: 5,
        maxAutomations: 5,
        creditLimit: 50,
        features: [
          "1 Instagram Account",
          "Basic Chatbot Responses",
          "5 Automation Rules",
          "24-hour Response Time",
          "Community Support",
        ],
        
        duration: 365 // days
       },
       {
        name: 'PREMIUM',
        price: 9.99,
        description: "Ideal for growing businesses and content creators",
        maxAccounts: 3,
        maxComments: 50,
        maxMessages: 50,
        maxChatBots: 3,
        maxAutomations: 50,
        features: [
          "3 Instagram Accounts",
          "Advanced Chatbot with Context",
          "15 Automation Rules",
          "1-hour Response Time",
          "Priority Support",
          "Analytics Dashboard",
          "Custom Response Templates",
        ],
        creditLimit: 100,
        duration: 365 // days
       },
       {
        name: 'PRO',
        price: 29.99,
        description: "For businesses requiring advanced automation and analytics",
        maxAccounts: 5,
        maxChatBots: 5,
        maxComments: 100,
        maxMessages: 100,
        maxAutomations: 100,
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
        creditLimit: 200,
        duration: 365 // days
       },
        
    ],
    skipDuplicates: true
  })

  console.log('Subscription Plans Seeded:', subscriptionPlans)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
     
    await prisma.$disconnect()
  })