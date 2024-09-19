import TaskList from '@/components/List/TaskInList'
import { list, task } from '@/lib/type'
import List from '@/models/List'
import Task from '@/models/Task'
import formatTasks from '@/utils/formatTasks'
import { redirect } from 'next/navigation'

export default async function page({params}:{params:{id:string,listid:string}}) {
  require('@/models/Task')
  
  const {id,listid} = params

  const tasksInList = await List.findOne({_id:listid,userID:id}).lean().exec() as list

  const tasks = await Task.find({ userID: id }).lean().populate('list').exec() as task[]

  if(!tasksInList){
    redirect(`/${id}`)
  }

  const formattedTasks : task[] = formatTasks(tasks)
  const formattedList : list = {
    _id:tasksInList._id.toString(),
    userID:tasksInList.userID,
    name:tasksInList.name,
    color:tasksInList.color,
    createdAt:tasksInList.createdAt
  }

  return (
    <TaskList list={formattedList} id={id} alltasks={formattedTasks}/>
  )
}
