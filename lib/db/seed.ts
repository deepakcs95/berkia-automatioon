import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {


  const subscriptionPlans = await prisma.subscriptionPlan.createMany({
    data: [
      {
        plan: 'FREE',
        price: 0,
        creditLimit: 50,
        features: {
          autoReply: false,
          aiAssistant: false,
          commentAutomation: false,
          messageAutomation: false,
          socialAccounts: 1
        },
        duration: 30 // days
      },
      {
        plan: 'PREMIUM',
        price: 9.99,
        creditLimit: 250,
        features: {
          autoReply: true,
          aiAssistant: true,
          commentAutomation: true,
          messageAutomation: false,
          socialAccounts: 2
        },
        duration: 30 // days
      },
      {
        plan: 'PRO',
        price: 19.99,
        creditLimit: 1000,
        features: {
          autoReply: true,
          aiAssistant: true,
          commentAutomation: true,
          messageAutomation: true,
          socialAccounts: 5
        },
        duration: 30 // days
      }
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