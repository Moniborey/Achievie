import Upcoming from '@/components/Upcoming/Upcoming'
import connectMongoDB from '@/lib/db'
import { task } from '@/lib/type'
import Task from '@/models/Task'
import formatTasks from '@/utils/formatTasks'
import React from 'react'

export default async function page({params}:{params:{id:string}}) {

  const {id} = params
  await connectMongoDB()
  require('@/models/List')
  require('@/models/Task')
  const tasks = await Task.find({ userID: id }).lean().populate('list').exec() as task[]

  const formattedTasks = formatTasks(tasks)

  return <Upcoming Tasks={formattedTasks}/>
}
