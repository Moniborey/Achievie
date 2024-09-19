import { task } from "@/lib/type";


export default function formatTasks(tasks:task[]):task[]{
    return tasks.map((task:any)=>(
      {
        ...task,
        _id:task._id.toString(),
        list:{
          ...task?.list,
          _id:task?.list?._id?.toString(),
          tasks:task?.list?.tasks?.toString()
        }
      }))
  }