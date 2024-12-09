export type PostItem = {
    id: string;
  media_url: string;
  media_type: "VIDEO" | "IMAGE" | "CAROUSEL_ALBUM";
  thumbnail_url?: string;
  
}

 export type PostItemResponse = {
    posts:PostItem[],
    after?:string
  }
