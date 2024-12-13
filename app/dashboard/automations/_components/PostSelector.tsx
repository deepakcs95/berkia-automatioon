'use client'

import * as React from 'react'
import {   ChevronsUpDown } from 'lucide-react'
 
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getInstagramPostsByAccountId } from '@/app/actions/instagram'
import { useInfiniteQuery } from '@tanstack/react-query'
import  PostCard from './ui/PostCard'


interface PostSelectorProps {
  field: {
    value: string[];
    onChange: (newValue: string[]) => void;
  };
  error?: string;
  postaccountId: string;
  selectedPosts?: string[];
}

export function PostSelector({ field, postaccountId, selectedPosts }: PostSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)


 

  const {
    data,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['instagram-posts', postaccountId],
    queryFn: ({ pageParam  }) => 
      getInstagramPostsByAccountId(
        postaccountId || '',
        pageParam,
        5
      ),
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null  ,
    initialPageParam: "",
  })

   

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    console.log('Scroll event detected', {
      scrollTop: target.scrollTop,
      scrollHeight: target.scrollHeight,
      clientHeight: target.clientHeight
    });
    
    if (
      target.scrollTop + target.clientHeight >= 
      target.scrollHeight - 20
    ) {
      console.log('Near bottom, fetching next page...');
      if(!isFetchingNextPage && hasNextPage)  fetchNextPage();
    }
 
  }

  const memoPosts = React.useMemo(() => {
    if (!data?.pages) return []
    return data?.pages
      .filter(page => page.success)
      .flatMap(page => page.posts)
  }, [data])
 
  // If no accounts are available, show a message
  if (!postaccountId?.length) {
    return <div>No accounts available</div>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedPosts && selectedPosts?.length > 0
            ? `${selectedPosts.length} post${selectedPosts.length > 1 ? 's' : ''} selected`
            : "Select posts..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command className="h-[200px] overflow-hidden">
          <CommandList 
            ref={containerRef}
            className="h-[200px] overflow-y-auto scroll-smooth"
            onScroll={ e=>onScroll(e)}
          >
            <div className="p-2">
              {isPending ? (
                <CommandItem disabled className="flex items-center justify-center py-4">
                  Loading posts...
                </CommandItem>
              ) : memoPosts?.length  ? (
                <div className="grid grid-cols-2 gap-2">
                  {memoPosts
                    .map((post) => {
                      if (!post) return null;
                      return (
                        <PostCard fields={field} key={post.id} post={post}   />
                      )
                    })
                  }
                </div>
              ) : (
                <CommandItem disabled className="flex items-center justify-center py-4">
                  No posts available
                </CommandItem>
              )}
              {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
