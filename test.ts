// {
//     "id": "17841470800772554",
//     "time": 1733997837,
//     "changes": [
//         {
//             "value": {
//                 "from": {
//                     "id": "1082475449920958",
//                     "username": "deepak_cs"
//                 },
//                 "media": {
//                     "id": "18045458246139896",
//                     "media_product_type": "FEED"
//                 },
//                 "id": "18029288096609816",
//                 "parent_id": "17890681704136818",
//                 "text": "@deepak_cs d"
//             },
//             "field": "comments"
//         }
//     ]
// }
// {
//     "id": "17841470800772554",
//     "time": 1733997830,
//     "changes": [
//         {
//             "value": {
//                 "from": {
//                     "id": "1082475449920958",
//                     "username": "deepak_cs"
//                 },
//                 "media": {
//                     "id": "18045458246139896",
//                     "media_product_type": "FEED"
//                 },
//                 "id": "17890681704136818",
//                 "text": "a"
//             },
//             "field": "comments"
//         }
//     ]
// }

// {
//     "time": 1733998064122,
//     "id": "17841470800772554",
//     "messaging": [
//         {
//             "sender": {
//                 "id": "1082475449920958"
//             },
//             "recipient": {
//                 "id": "17841470800772554"
//             },
//             "timestamp": 1733998063523,
//             "message": {
//                 "mid": "aWdfZAG1faXRlbToxOklHTWVzc2FnZAUlEOjE3ODQxNDcwODAwNzcyNTU0OjM0MDI4MjM2Njg0MTcxMDMwMTI0NDI1OTc2NzE3ODAwOTI3MDY2MTozMTk4NjYxODUwMjExODk1MjQ4NjU4MTQ2MDQ0OTM2MTkyMAZDZD",
//                 "text": "Hi"
//             }
//         }
//     ]
// }
import { PrismaClient, SocialConnectionStatus, SocialType } from '@prisma/client'

const prisma = new PrismaClient()

async function name() {
   return prisma.socialAccount.create({
        data: {
            accountId: 'ff3ee733-b9b6-56c0-b6ba-a0aa7483aff1',
            userId:'ff3ee733-b9b6-56c0-b6ba-a0aa7483aff1',
            socialType: SocialType.INSTAGRAM,
            username: 'karthik',
            profilePictureUrl: '',
            status: SocialConnectionStatus.CONNECTED,
            accessToken: '',
            tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        }
      })};



name().then((res) => console.log(res)).catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
     
    await prisma.$disconnect()
  })

 