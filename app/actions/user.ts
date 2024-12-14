'use server'

import { getUserByIdWithSubscription } from "@/lib/db"
import { getAuthSession } from "@/lib/utils/utils"

export async function getUser() {
  const userId = await getAuthSession()
  console.log('fetching user');
  
  const user = await getUserByIdWithSubscription(userId)
   
  
    return user
  }