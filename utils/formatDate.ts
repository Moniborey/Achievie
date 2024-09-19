import { task } from "@/lib/type"


export const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
export const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

const moment = require('moment')
const today = new Date()
const dayToSubtract = today.getDay() === 0 ? 6 : today.getDay() - 1
export const thisMonday = new Date(today.setDate(today.getDate() - dayToSubtract))
export const thisSunday = new Date(today.setDate(thisMonday.getDate() + 6))
export const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth()+1,0)

export function formatDate(date: Date) {
    return `${(date.getDate()).toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear() % 100}`
}

export function getThisWeekTask(tasks: task[]):task[] {
    return tasks.filter((task: any) => task.dueDate >= moment().startOf('isoWeek') && task.dueDate <= thisSunday)
}

export function getTomorrowTask(tasks: task[]):task[] {
    return tasks.filter((task: any) => task.dueDate.getDate() === (new Date().getDate() + 1) % lastDayOfMonth.getDate())
}