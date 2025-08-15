import { useState, useCallback } from 'react';
import type { Goal, Milestone, Task } from '@/lib/types';

interface ModalState {
  goalDetails: {
    isOpen: boolean;
    goal: Goal | null;
    mode: 'create' | 'update';
  };
  milestoneDetails: {
    isOpen: boolean;
    milestone: Milestone | null;
    mode: 'create' | 'update';
  };
  todoDetails: {
    isOpen: boolean;
    task: Task | null;
    mode: 'create' | 'update';
  };
}

export function useModalManager() {
  const [modalState, setModalState] = useState<ModalState>({
    goalDetails: { isOpen: false, goal: null, mode: 'create' },
    milestoneDetails: { isOpen: false, milestone: null, mode: 'create' },
    todoDetails: { isOpen: false, task: null, mode: 'create' },
  });

  const openGoalDetails = useCallback(({goal, mode = "create"}:{goal: Goal, mode: 'create'|'update' }) => {
    setModalState(prev => ({
      ...prev,
      goalDetails: { isOpen: true, goal, mode }
    }));
  }, []);

  const closeGoalDetails = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      goalDetails: { isOpen: false, goal: null, mode: 'create' }
    }));
  }, []);

  const openMilestoneDetails = useCallback(({milestone, mode = "create"}: {milestone: Milestone, mode: 'create' | "update"}) => {
    setModalState(prev => ({
      ...prev,
      milestoneDetails: { isOpen: true, milestone , mode }
    }));
  }, []);

  const closeMilestoneDetails = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      milestoneDetails: { isOpen: false, milestone: null, mode: 'create' }
    }));
  }, []);

  const openTodoDetails = useCallback(({task, mode} : {task: Task, mode: "update" | "create"}) => {
    setModalState(prev => ({
      ...prev,
      todoDetails: { isOpen: true, task, mode: 'update' }
    }));
  }, []);

  const closeTodoDetails = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      todoDetails: { isOpen: false, task: null, mode: 'create' }
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModalState({
      goalDetails: { isOpen: false, goal: null, mode: 'create' },
      milestoneDetails: { isOpen: false, milestone: null, mode: 'create' },
      todoDetails: { isOpen: false, task: null, mode: 'create' },
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
