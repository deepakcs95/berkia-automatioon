import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PostItem } from "@/lib/types";
import { memo, useMemo } from "react";

interface PostCardProps {
  post: PostItem  
  fields: {
    value: string[];
    onChange: (newValue: string[]) => void;
  }
   
}

const areEqual = (prevProps: PostCardProps, nextProps: PostCardProps) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.media_url === nextProps.post.media_url &&
    prevProps.post.media_type === nextProps.post.media_type &&
    prevProps.post.thumbnail_url === nextProps.post.thumbnail_url &&
    prevProps.fields === nextProps.fields
  );
};

const PostCard = ({ post, fields  }: PostCardProps) => {
  console.log(fields);
  const isSelected = useMemo(() => fields.value?.includes(post.id) || false, [fields.value, post.id]);
  
  const handlePostToggle = (postId: string) => {
    const currentValue = fields.value || [];
    const newValue = isSelected
      ? currentValue.filter(id => id !== postId)  // Remove if exists
      : [...currentValue, postId];  // Add if not exists
  
    fields.onChange(newValue);
  };


  return (
    <div
      role="button"
      onClick={() => handlePostToggle(post.id)}
      className="group relative aspect-square cursor-pointer"
    >
      <div>{JSON.stringify(fields)}</div>
      <Image
        src={post.media_type === 'VIDEO' ? post.thumbnail_url! : post.media_url}
        alt={  "Instagram post"}
        className="object-cover"
        sizes="(max-width: 480px) 100vw, 320px"
        loading="lazy"
        quality={50}
        placeholder="blur"
        blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPslnm2HwAFFQJOxbfFPwAAAABJRU5ErkJggg=='
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
              isSelected ? "bg-primary" : "bg-transparent"
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

export default memo(PostCard, areEqual);


 