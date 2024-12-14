 
 import { getUser } from "@/app/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton";
 import { useQuery, useQueryClient } from "@tanstack/react-query";
  
 

 
export default async function UserInfo() {
//  const [user, setUser]= useState( (async()=>await getUser() as User))
 
const {
    status,
    data: user,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  })
 

if(!user) return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback className="rounded-lg">
          <Skeleton className="h-full w-full rounded-lg" />
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32 mt-1" />
      </div>
    </div>
  )

  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user?.image || ''} alt={user?.name || 'user'} />
        <AvatarFallback className="rounded-lg">
          {user?.name?.split(' ').map(n => n[0]).join('')} 
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user?.name}</span>
        <span className="truncate text-xs">{user?.email}</span>
      </div>
    </div>
  )
}

