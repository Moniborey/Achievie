import Today from '@/components/Today/Today'
import { task } from '@/lib/type'
import Task from '@/models/Task'
import formatTasks from '@/utils/formatTasks'
import React from 'react'

export default async function TodayPage({params}:any) {

  const {id} = params

  require('@/models/List')
  const tasks = await Task.find({ userID: id }).lean().populate('list').exec() as task[]

  const formattedTodayTasks = formatTasks(tasks)

  return <Today Tasks = {formattedTodayTasks}/>
}
