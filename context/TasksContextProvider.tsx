'use client'

import { task } from '@/lib/type'
import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

interface tasksContext {
  tasks: task[] | undefined
  setTasks: Dispatch<SetStateAction<task[] | undefined>>
}

const tasksContext = createContext<tasksContext | null>(null)

export const useTasksContext = () => {
  const context = useContext(tasksContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a TasksProvider");
  }
  return context;
};

export default function TasksContextProvider({ children }: { children: React.ReactNode }) {

  const [tasks, setTasks] = useState<task[] | undefined>(undefined)

  return (
    <tasksContext.Provider value={{ tasks, setTasks }}>
      {children}
    </tasksContext.Provider>
  )
}
