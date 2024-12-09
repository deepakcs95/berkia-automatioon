import { useInstagramAutomation } from "./useAutomationReducer";
import { PostItem } from "@/lib/types";
import { useCallback } from "react";

export const usePostSelection = () => {
  const { dispatch, state } = useInstagramAutomation();

  const handleSelect = useCallback((post: PostItem) => {
    let updated: string[];
    
    if (!state.selectedPosts) {
      updated = [post.id];
    } else {
      updated = state.selectedPosts.includes(post.id)
        ? state.selectedPosts.filter((id) => id !== post.id)
        : [...state.selectedPosts, post.id];
    }
    
    dispatch({ type: "SET_SELECTED_POSTS", payload: updated });
  }, [dispatch, state.selectedPosts]);

  const isPostSelected = useCallback((postId: string) => {
    return state.selectedPosts?.includes(postId) || false;
  }, [state.selectedPosts]);

  return {
    selectedPosts: state.selectedPosts || [],
    handleSelect,
    isPostSelected,
   
  };
};
