'use client'

import * as React from 'react'
import Image from 'next/image'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PostItem } from '@/lib/types'
import { getInstagramPostsByAccountId } from '@/app/actions/instagram/actions'
import { InstaAccountProps } from '../../account/_components/account-card'
import { useInfiniteQuery } from '@tanstack/react-query'

export function PostSelector({ initialAccounts }: { initialAccounts: InstaAccountProps[] }) {
  const [open, setOpen] = React.useState(false)
  const [selectedPosts, setSelectedPosts] = React.useState<PostItem[]>([])
  const [cursor, setCursor] = React.useState<string >("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  const {
    data,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['instagram-posts', initialAccounts[0]?.account_id],
    queryFn: ({ pageParam  }) => 
      getInstagramPostsByAccountId(
        initialAccounts[0]?.account_id || '',
        pageParam,
        10
      ),
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null  ,
    initialPageParam: "",
  })

  const handleSelect = (post: PostItem) => {
    setSelectedPosts((current) => {
      const updated = current.some((p) => p.id === post.id)
        ? current.filter((p) => p.id !== post.id)
        : [...current, post]
      return updated
    })
  }

 
  // If no accounts are available, show a message
  if (!initialAccounts?.length) {
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
          {selectedPosts.length > 0
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
            onScroll={(e) => {
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
                !isFetchingNextPage && hasNextPage && fetchNextPage();
              }
            }}
          >
            <div className="p-2">
              {isPending ? (
                <CommandItem disabled className="flex items-center justify-center py-4">
                  Loading posts...
                </CommandItem>
              ) : data?.pages?.length  ? (
                <div className="grid grid-cols-2 gap-2">
                  {data?.pages
                    .filter(page => page.success)
                    .flatMap(page => page.posts)
                    .map((post) => {
                      if (!post) return null;
                      return (
                        <div
                          key={post.id}
                          className="relative group cursor-pointer"
                          onClick={() => handleSelect(post)}
                        >
                          <div className="relative aspect-square overflow-hidden rounded-lg">
                            <Image
                              src={post.media_type === 'VIDEO' ? post.thumbnail_url! : post.media_url}
                              alt={`Post ${post.id}`}
                              fill
                              sizes="150px"
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className={cn(
                              "absolute inset-0 bg-black/20 transition-opacity",
                              selectedPosts.some((p) => p.id === post.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}>
                              <div className="absolute top-2 right-2">
                                <div className={cn(
                                  "h-5 w-5 rounded-md border-2 border-white flex items-center justify-center",
                                  selectedPosts.some((p) => p.id === post.id) ? "bg-white" : "bg-transparent"
                                )}>
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      selectedPosts.some((p) => p.id === post.id) 
                                        ? "text-black" 
                                        : "text-white opacity-0 group-hover:opacity-100"
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}  
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
