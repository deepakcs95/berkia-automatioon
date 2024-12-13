

import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function FormSkeleton() {
  return (
    <> {/* Header */}
    <div className="space-y-4 pb-6">
      <Skeleton className="h-7 w-[200px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>

    {/* Account Selection */}
    <div className="mb-6">
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>

    {/* Two Column Layout */}
    <div className="grid gap-6 md:grid-cols-2">
      {/* Trigger Column */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>

      {/* Action Column */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="space-y-4 pt-6">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>

    {/* Footer */}
    <div className="flex justify-end gap-2 pt-6">
      <Skeleton className="h-10 w-[70px]" />
      <Skeleton className="h-10 w-[140px]" />
    </div></>
  )
}
