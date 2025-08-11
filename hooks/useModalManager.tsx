import { useState, useCallback } from 'react';
import type { Goal, Milestone, Task } from '@/lib/types';

interface ModalState {
  goalDetails: {
    isOpen: boolean;
    goal: Goal | null;
  };
  milestoneDetails: {
    isOpen: boolean;
    milestone: Milestone | null;
  };
  todoDetails: {
    isOpen: boolean;
    task: Task | null;
  };
}

export function useModalManager() {
  const [modalState, setModalState] = useState<ModalState>({
    goalDetails: { isOpen: false, goal: null },
    milestoneDetails: { isOpen: false, milestone: null },
    todoDetails: { isOpen: false, task: null },
  });

  const openGoalDetails = useCallback((goal: Goal) => {
    setModalState(prev => ({
      ...prev,
      goalDetails: { isOpen: true, goal }
    }));
  }, []);

  const closeGoalDetails = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      goalDetails: { isOpen: false, goal: null }
    }));
  }, []);

  const openMilestoneDetails = useCallback((milestone: Milestone) => {
    setModalState(prev => ({
      ...prev,
      milestoneDetails: { isOpen: true, milestone }
    }));
  }, []);

  const closeMilestoneDetails = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      milestoneDetails: { isOpen: false, milestone: null }
    }));
  }, []);

  const openTodoDetails = useCallback((task: Task) => {
    setModalState(prev => ({
      ...prev,
      todoDetails: { isOpen: true, task }
    }));
  }, []);

  const closeTodoDetails = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      todoDetails: { isOpen: false, task: null }
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModalState({
      goalDetails: { isOpen: false, goal: null },
      milestoneDetails: { isOpen: false, milestone: null },
      todoDetails: { isOpen: false, task: null },
    });
  }, []);

  return {
    modalState,
    openGoalDetails,
    closeGoalDetails,
    openMilestoneDetails,
    closeMilestoneDetails,
    openTodoDetails,
    closeTodoDetails,
    closeAllModals,
  };
}
