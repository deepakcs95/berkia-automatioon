import { Card } from "@/components/ui/card"

export default function AutomationSkeleton() {
  return (
    <div className="w-full   mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-20 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
          <div className="w-8 h-8 rounded animate-pulse bg-purple-200" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="h-6 w-96 bg-gray-100 rounded animate-pulse mx-auto" />
        </div>
        <div className="h-12 w-40 bg-purple-200 rounded animate-pulse mx-auto" />
      </div>

      {[1, 2, 3].map((index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

