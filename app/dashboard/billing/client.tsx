'use client'

import { Plan, Subscription } from "@prisma/client"
import { use } from "react"

interface props {
    currentPlan: Promise<Subscription | null | undefined>
}
 
export default function Client({currentPlan}:  props) {
    const plan =  use(currentPlan)

 
  return (
    <div>client{JSON.stringify(plan)}</div>
  )
}
