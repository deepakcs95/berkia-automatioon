import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PostItem } from "@/lib/types";

interface PostCardProps {
  post: PostItem  
  isSelected: boolean;
  onSelect: (post: PostItem) => void;
}

export const PostCard = ({ post, isSelected, onSelect }: PostCardProps) => {
  return (
    <div
      role="button"
      onClick={() => onSelect(post)}
      className="group relative aspect-square cursor-pointer"
    >
      <Image
        src={post.media_type === 'VIDEO' ? post.thumbnail_url! : post.media_url}
        alt={  "Instagram post"}
        className="object-cover"
        fill
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/20 transition-opacity",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <div className="absolute top-2 right-2">
          <div
            className={cn(
              "rounded-full p-1 transition-colors",
              isSelected ? "bg-white" : "bg-transparent"
            )}
          >
            <Check
              className={cn(
                "h-4 w-4 transition-colors",
                isSelected
                  ? "text-black"
                  : "text-white opacity-0 group-hover:opacity-100"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
