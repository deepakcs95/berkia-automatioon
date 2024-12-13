import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AccountsPageSkeletion() {
  return (
    <div className="space-y-4">
      {/* Add Account Card */}
      <div className="text-center space-y-4">
        <div className="w-16 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
          <div className="w-8 h-6 rounded animate-pulse bg-purple-200" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="h-8 w-96 bg-gray-100 rounded animate-pulse mx-auto" />
        </div>
        <div className="h-10 w-40 bg-purple-200 rounded animate-pulse mx-auto" />
      </div>

      {/* Connected Accounts Card */}
      <div className="grid mt-14 grid-cols-1 md:grid-cols-2 md:gap-4">

      {[1, 2,3].map((index) => (<Card key={index} className="w-full">
        <CardHeader>
          <div className="h-8 w-40 bg-muted rounded animate-pulse" />
          <div className="h-8 w-56 bg-muted/60 rounded animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          
            <div  className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-18 w-12 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-10 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-24 bg-muted/60 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                <div className="h-10 w-9 bg-muted rounded animate-pulse" />
              </div>
            </div>
         
        </CardContent>
      </Card>))}
       
      </div>

    </div>
  )
}

