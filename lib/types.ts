import { Automation ,Action,Trigger, Prisma} from "@prisma/client";

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

  export type AutomationsType = Prisma.AutomationGetPayload<{
    include: { 
      
      actions: true, 
      triggers: true 
    }
  }>
 
 

  export interface InstagramAutomationState {
    account: {
      id: string;
    } | null;
    trigger: {
      type: 'comment' | 'message';
      keyword: string;
    } | null;
    actions: {
      commentReply?: {
        type: 'commentReply';
        content: string;
      };
      messageReply?: {
        type: 'messageReply';
        content: string;
      };
    };
    selectedPosts?: string[];
  }