import { filterSort } from '@/context/FilterContextProvider';
import { task } from '@/lib/type';

export default function SortFilter(tasks: task[], sort: filterSort) {
    let sortedTasks = tasks
    switch (sort.value) {
        case 'dateadded':
            if (sort.direction === 'ascending') {
                return sortedTasks.sort((a, b) => {
                    return a.createdAt.getTime() - b.createdAt.getTime()
                })
            }
            else {
                return sortedTasks.sort((a, b) => {
                    return b.createdAt.getTime() - a.createdAt.getTime()
                })
            }
        case 'duedate':
            if (sort.direction === 'ascending') {
                return sortedTasks.sort((a, b) => {
                    return a.dueDate.getTime() - b.dueDate.getTime()
                })
            }
            else {
                return sortedTasks.sort((a, b) => {
                    return b.dueDate.getTime() - a.dueDate.getTime()
                })
            }
        case 'name':
            return sortedTasks.sort((a, b) => {
                let nameA = a.task.toLowerCase();
                let nameB = b.task.toLowerCase();

                if (nameA < nameB) {
                    return sort.direction==='ascending' ? -1 : 1;
                }
                if (nameA > nameB) {
                    return sort.direction==='ascending' ? 1 : -1;
                }
                return 0;
            })
        case 'priority':
            if (sort.direction === 'ascending') {
                return sortedTasks.sort((a, b) => {
                    return Number(a.priority.replace('P','')) - Number(b.priority.replace('P',''))
                })
            }
            else {
                return sortedTasks.sort((a, b) => {
                    return Number(b.priority.replace('P','')) - Number(a.priority.replace('P',''))
                })
            }
        default:
            return sortedTasks
    }
}
