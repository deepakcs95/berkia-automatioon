'use client'

import { InstagramAutomationState } from '@/lib/types';
import { AutomationSchema } from '@/lib/validator/automation';
import React, { 
    createContext, 
    useReducer, 
    useContext, 
    Dispatch, 
    ReactNode 
  } from 'react';
  import { z } from 'zod';
  
  // Schemas
   
  // Action Types
  export type InstagramAutomationAction = 
    | { type: 'SET_ACCOUNT'; payload: { id: string;  } }
    | { type: 'SET_TRIGGER'; payload: { type: 'comment' | 'message'; keyword: string } }
    | { 
        type: 'SET_ACTION'; 
        payload: { 
          type: 'commentReply' | 'messageReply'; 
          content: string 
        } 
      }
    | { type: 'REMOVE_ACTION'; payload: 'commentReply' | 'messageReply' }
    | { type: 'SET_SELECTED_POSTS'; payload: string[] }
    | { type: 'RESET' };
  
  // Reducer Function
  export function instagramAutomationReducer(
    state: InstagramAutomationState, 
    action: InstagramAutomationAction
  ): InstagramAutomationState {
    switch (action.type) {
      case 'SET_ACCOUNT':
        return { ...state, account: action.payload };
      
      case 'SET_TRIGGER':
        return { 
          ...state, 
          trigger: action.payload,
          actions: {},
          selectedPosts: action.payload.type === 'message' ? [] : state.selectedPosts
        };
      
      case 'SET_ACTION':
        return { 
          ...state, 
          actions: {
            ...state.actions,
            [action.payload.type]: {
              type: action.payload.type,
              content: action.payload.content
            }
          }
        };
      
      case 'REMOVE_ACTION':
        const newActions = { ...state.actions };
        if(action.payload === 'commentReply') {
          delete newActions.commentReply;
        }
        if(action.payload === 'messageReply') {
          delete newActions.messageReply;
        }
        return { ...state, actions: newActions };
      
      case 'SET_SELECTED_POSTS':
        return { ...state, selectedPosts: action.payload };
      
      case 'RESET':
        return {
          account: null,
          trigger: null,
          actions: {},
          selectedPosts: []
        };
      
      default:
        return state;
    }
  }
  
  // Validation Utility
  export function validateAutomation(state: InstagramAutomationState) {
    try {
      // Comprehensive Automation Schema
       
      const validationPayload = {
        account: {
          id: state.account?.id || '',
        },
        trigger: {
          type: state.trigger?.type || '',
          keyword: state.trigger?.keyword || ''
        },
        actions: Object.keys(state.actions).length > 0 ? 
          {
            ...(state.actions.commentReply ? 
              { commentReply: state.actions.commentReply } : {}),
            ...(state.actions.messageReply ? 
              { messageReply: state.actions.messageReply } : {})
          } : 
          undefined,
        postSelection: {
          triggerType: state.trigger?.type || '',
          postIds: state.selectedPosts || []
        }
      };
  
      // This will now enforce the post selection rule
      AutomationSchema.parse(validationPayload);
      return { isValid: true, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          isValid: false, 
          errors: error.errors.map(err => {
            // Custom error message mapping
            switch(err.path[0]) {
              case 'postSelection':
                return "At least one post must be selected for comment trigger";
              default:
                return err.message;
            }
          }) 
        };
      }
      return { isValid: false, errors: ['Unknown validation error'] };
    }
  }
  
  // Context
  interface InstagramAutomationContextType {
    state: InstagramAutomationState;
    dispatch: Dispatch<InstagramAutomationAction>;
    validation: {
      isValid: boolean;
      errors: string[] | null;
    };
  }
  
  const InstagramAutomationContext = createContext<InstagramAutomationContextType | undefined>(undefined);
  
  // Provider Component
  export const InstagramAutomationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(instagramAutomationReducer, {
      account: null,
      trigger: null,
      actions: {},
      selectedPosts: []
    });
  
    // Validate the current state
    const { isValid, errors } = validateAutomation(state);
  
    return (
      <InstagramAutomationContext.Provider 
        value={{ 
          state, 
          dispatch, 
          validation: { isValid, errors } 
        }}
      >
        {children}
      </InstagramAutomationContext.Provider>
    );
  };
  
  // Custom Hook for using the context
  export const useInstagramAutomation = () => {
    const context = useContext(InstagramAutomationContext);
    
    if (context === undefined) {
      throw new Error(
        'useInstagramAutomation must be used within an InstagramAutomationProvider'
      );
    }
    
    return context;
  };
  
  