import { list } from "@/lib/type";

export function formatLists(lists:list[]){
    return lists.map((list:any)=>({
        id:list._id.toString(),
        listName:list.name,
        listColor:list.color,
        taskcount:list.tasks.length
      }))
}