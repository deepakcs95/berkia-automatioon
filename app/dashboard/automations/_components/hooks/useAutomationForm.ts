import { InstaAccountProps } from '@/app/dashboard/account/_components/account-card';
import { useInstagramAutomation } from './useAutomationReducer';
import { useCallback,useEffect } from 'react';

export const useAutomationForm  = (initialAccounts: InstaAccountProps[]) => {
  const { state, dispatch ,validation} = useInstagramAutomation();
  
  useEffect(() => {
    handleAccountChange(initialAccounts[0].account_id);
  }, []);
   

  const handleAccountChange = useCallback((value: string) => {
    dispatch({ type: 'SET_ACCOUNT', payload: { id: value } });
  }, [dispatch]);

  const handleTriggerChange = useCallback((type: 'comment' | 'message', keyword: string) => {
    dispatch({ type: 'SET_TRIGGER', payload: { type, keyword } });
  }, [dispatch]);

  const handleActionChange = useCallback((type: 'commentReply' | 'messageReply', content: string) => {
    dispatch({ type: 'SET_ACTION', payload: { type, content } });
  }, [dispatch]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch ]);

  return {
    handleAccountChange,
    handleTriggerChange,
    handleActionChange,
    resetForm,
    validation,
    state,
  };
};
