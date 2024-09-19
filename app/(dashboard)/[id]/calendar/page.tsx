import CalendarPage from '@/components/PageCalendar/CalendarPage'
import { task } from '@/lib/type'
import Task from '@/models/Task'
import formatTasks from '@/utils/formatTasks'
import React from 'react'

export default async function PageCalendar({params}:{params:{id:string}}) {
  require('@/models/List')
  const {id} = params
  const tasks = await Task.find({userID:id}).lean().populate('list').exec() as task[]
  const formattedTasks = formatTasks(tasks)

  return (
    <CalendarPage formattedTasks={formattedTasks}/>
  )
}
