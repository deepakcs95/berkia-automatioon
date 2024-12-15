import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  await prisma.plan.deleteMany({})
  const subscriptionPlans = await prisma.plan.createMany({
    data: [
      {
        name: 'FREE',
        price: 0,
        description: 'Free plan',
        maxAccounts: 1,
        maxChatBots: 1,
        maxComments: 5,
        maxMessages: 5,
        maxAutomations: 5,
        features: {
          1: 'it has 1 account',
          2: 'it has 5 comments',
          3: 'it has 5 messages',
          4: 'it has 5 automations',
        },
        creditLimit: 50,
        duration: 365 // days
       },
       {
        name: 'PREMIUM',
        price: 29.99,
        description: 'PREMIUM plan',
        maxAccounts: 3,
        maxComments: 50,
        maxMessages: 50,
        maxChatBots: 3,
        maxAutomations: 50,
        features: {
          1: 'it has 3 accounts',
          2: 'it has 50 comments',
          3: 'it has 50 messages',
          4: 'it has 50 automations',
        },
        creditLimit: 100,
        duration: 365 // days
       },
       {
        name: 'PRO',
        price: 99.99,
        description: 'Professional plan',
        maxAccounts: 5,
        maxChatBots: 5,
        maxComments: 100,
        maxMessages: 100,
        maxAutomations: 100,
        features: {
          1: 'it has 5 accounts',
          2: 'it has 100 comments',
          3: 'it has 100 messages',
        },
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