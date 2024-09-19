'use client'

import React, { useEffect, useState } from 'react'
import Header from '../Header'
import { useFilterContext } from '@/context/FilterContextProvider'
import { task } from '@/lib/type'
import { useTasksContext } from '@/context/TasksContextProvider'
import { Button } from '../ui/button'
import DisplayTasks from '../TaskDisplay/DisplayTasks'
import SortFilter from '@/utils/sort'
import { useSearchParams } from 'next/navigation'

interface AllTasksProps{
    propsTasks:task[]
}

type ViewType = 'inprogress' | 'completed' | 'all'

export default function AllTasks({propsTasks}:AllTasksProps) {

    const {tasks,setTasks} = useTasksContext()
    const {filter} = useFilterContext()
    const searchParams = useSearchParams()
    const isViewCompleted = searchParams.get('view')
    const [viewType,setViewType] = useState<ViewType>(isViewCompleted === 'completed' ? 'completed' : 'all')

    useEffect(()=>{
        if(tasks===undefined){
            setTasks(propsTasks)
        }
    })

    if (tasks === undefined) {
        return
    }

    const handleSelectViewType = (type:ViewType) => {
        if(type !== viewType){
            setViewType(type)
        }else{
            setViewType('all')
        }
    }

    
    const unfinishedTasks = tasks.filter(task=>!task.isChecked)
    const sortViewTasks = viewType === 'completed' ? tasks.filter(task=>task.isChecked) : viewType === 'inprogress' ? tasks.filter(task=>!task.isChecked) : tasks

    const filteredTasks = sortViewTasks
    .filter(task =>
      filter.priority.includes(task.priority)
    )
    .filter(task=>
        viewType !== 'completed' ? filter.isViewCompleted ? task : !task.isChecked : tasks
    )

    const sortedTasks = SortFilter(filteredTasks,filter.sort)

  return (
    <section className='flex flex-col lg:gap-5 gap-2 h-full'>
        <Header title='All Tasks' length={tasks.length} hideOption/>
        <section className='flex md:gap-5 gap-2'>
            <Button 
            onClick={()=>handleSelectViewType('inprogress')} 
            variant={'ghost'} 
            className={`rounded-full hover:bg-blue-500 hover:text-white border text-sm h-fit py-2 px-4 md:px-5 ${viewType==='inprogress' && 'bg-blue-600 hover:text-white text-white'}`}>
                <h1>In progress {unfinishedTasks.length}</h1>
            </Button>
            <Button 
            onClick={()=>handleSelectViewType('completed')} 
            variant={'ghost'} 
            className={`rounded-full hover:bg-green-400 hover:text-white border h-fit text-sm px-4 md:px-5 ${viewType==='completed' && 'bg-green-400 text-white hover:text-white'}`}>
                <h1>Completed {tasks.length-unfinishedTasks.length}</h1>
            </Button>
        </section>
        <main className='flex-1 overflow-auto'>
            <DisplayTasks tasks={sortedTasks}/>
        </main>
    </section>
  )
}
