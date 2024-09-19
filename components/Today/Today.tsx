'use client'

import React, { useEffect } from 'react'
import Header from '../Header'
import DisplayTasks from '../TaskDisplay/DisplayTasks'
import Image from 'next/image'
import { task } from '@/lib/type'
import { useFilterContext } from '@/context/FilterContextProvider'
import { useTasksContext } from '@/context/TasksContextProvider'
import SortFilter from '@/utils/sort'

interface TodayProps{
  Tasks:task[],
  hideHeader?:boolean
}

export default function Today({Tasks,hideHeader=false}:TodayProps) {

  const {filter} = useFilterContext()
  const {tasks,setTasks} = useTasksContext()
  
  useEffect(()=>{
    if(tasks === undefined){
      setTasks(Tasks)
    }
  })

  if (tasks === undefined) {
    return
  }

  const todayTasks = tasks.filter(task => task.dueDate.toLocaleDateString() === new Date().toLocaleDateString())
  
  const filteredTasks = todayTasks
  .filter(task =>
    filter.priority.includes(task.priority)
  )
  .filter(task=>filter.isViewCompleted ? task : !task.isChecked)

  const sortedTasks = SortFilter(filteredTasks,filter.sort)
  
  return (
    <main className='flex flex-col h-full w-full gap-5 overflow-clip'>
      {!hideHeader && 
      <Header 
      length={todayTasks.filter(task=>!task.isChecked).length} 
      title='Today'/>}
      {filteredTasks.length===0 
      ?
      <div className='flex w-full flex-col items-center'>
        <Image 
        alt=''
        width={1000}
        height={1000}
        src={'/emptytoday.png'}
        className='w-[250px] bg-cover'
        />
        <p className='tracking-tight text-gray-700 text-sm'>What do you need to get done today?</p>
      </div>
      :
      <section className='w-full overflow-auto'>
        <DisplayTasks tasks={sortedTasks}/>
      </section>
      }
    </main>
  )
}
