import connectMongoDB from "@/lib/db"
import Task from "@/models/Task"
import NavClient from "./NavClient"
import List from "@/models/List"
import { formatLists } from "@/utils/formatList"
import { NavList, list } from "@/lib/type"

export default async function Navbar(props:any) {

  await connectMongoDB()
  const ListDataPromise = List.find({userID:props.id}).lean().populate('tasks').exec()
  const TasksPromise = Task.find({userID:props.id}).lean().exec()
  const [ListData,Tasks] = await Promise.all([ListDataPromise,TasksPromise])
  const todayTasks = Tasks.filter(task=>task.dueDate.getDate() === new Date().getDate() && !task.isChecked)
  const unfinishedListData = ListData.map(listt=>({...listt,tasks:listt.tasks.filter((task:any)=>!task.isChecked)})) as list[]
  const formattedListData = formatLists(unfinishedListData) as NavList[]
  return (
   <NavClient todayCount={todayTasks.length} profileIMG={props.img} listData={formattedListData} name={props.name}/>
  )
}

