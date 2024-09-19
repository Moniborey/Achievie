'use client'

import React, { useEffect } from 'react'
import Today from '../Today/Today'
import Header from '../Header'
import DisplayTasks from '../TaskDisplay/DisplayTasks'
import { getThisWeekTask, getTomorrowTask, thisMonday, thisSunday } from '@/utils/formatDate'
import Image from 'next/image'
import { task } from '@/lib/type'
import { useFilterContext } from '@/context/FilterContextProvider'
import { useTasksContext } from '@/context/TasksContextProvider'
import SortFilter from '@/utils/sort'

interface UpcomingPageProps {
  Tasks: task[]
}

export default function Upcoming({ Tasks }: UpcomingPageProps) {

  const { filter } = useFilterContext()
  const { tasks, setTasks } = useTasksContext()

  useEffect(()=>{
    if(tasks === undefined){
      setTasks(Tasks)
    }
  })

  if (tasks === undefined) {
    return
  }

  const filteredTasks = tasks
  .filter(task =>
    filter.priority.includes(task.priority)
  )
  .filter(task=>
    filter.isViewCompleted ? task : !task.isChecked
  )

  const sortedTasks = SortFilter(filteredTasks,filter.sort)

  const tomorrowTasks = getTomorrowTask(sortedTasks)
  const thisWeekTasks = getThisWeekTask(sortedTasks)

  const unfinishedThisWeekTasks = thisWeekTasks.filter(task => !task.isChecked)

  return (
    <main className='flex flex-col lg:gap-5 h-full'>
      <Header
        length={unfinishedThisWeekTasks.length}
        title='Upcoming'
      />
      <section className='flex flex-col h-full lg:gap-5 gap-y-20 mt-10 mb-5 lg:my-0'>
        <section className='lg:border rounded-lg w-full flex flex-col gap-4 lg:p-5'>
          <h1 className='text-2xl font-bold text-gray-800'>Today</h1>
          <div className='lg:h-[30dvh] max-h-[60dvh] overflow-auto -mt-2'>
            <Today Tasks={filteredTasks} hideHeader={true} />
          </div>
        </section>
        <section className='flex lg:flex-row h-full flex-col lg:gap-5 gap-y-20 w-full'>
          <div className='lg:border rounded-lg w-full flex flex-col gap-4 lg:p-4'>
            <h1 className='text-2xl font-bold text-gray-800'>Tomorrow</h1>
            <div className='lg:h-[35dvh] max-h-[60dvh] overflow-auto -mt-2'>
              {
                tomorrowTasks.length === 0
                  ?
                  <div className='flex h-full flex-col items-center justify-center'>
                    <Image
                      src={'/indoor plants-amico.png'}
                      alt='emptytmr'
                      width={1000}
                      height={1000}
                      className='w-[250px] bg-cover'
                    />
                    <p className='tracking-tight text-gray-700 text-sm'>A relaxing day ahead of you</p>
                  </div>
                  :
                  <DisplayTasks tasks={tomorrowTasks} />
              }
            </div>
          </div>
          <div className='lg:border rounded-lg w-full flex flex-col gap-4 lg:p-4'>
            <div className='flex gap-4 justify-between items-center'>
              <h1 className='text-2xl font-bold text-gray-800 whitespace-nowrap'>This Week</h1>
              <h2 className='text-gray-700 text-xs xl:text-sm'>{`(${thisMonday.toDateString()} -> ${thisSunday.toDateString()})`}</h2>
            </div>
            <div className='lg:h-[35dvh] max-h-[60dvh] overflow-auto -mt-2'>
              {
                thisWeekTasks.length === 0
                  ?
                  <div className='flex h-full flex-col items-center justify-center'>
                    <Image
                      src={'/emptylist.png'}
                      alt='emptyweek'
                      width={1000}
                      height={1000}
                      className='w-[250px] bg-cover'
                    />
                    <p className='tracking-tight text-gray-700 text-sm'>Start small (or dream big)...</p>
                  </div>
                  :
                  <DisplayTasks tasks={thisWeekTasks} />
              }
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
