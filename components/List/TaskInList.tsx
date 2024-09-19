'use client'

import React, { useEffect, useState } from 'react'
import DisplayTasks from '../TaskDisplay/DisplayTasks'
import Header from '../Header'
import Image from 'next/image'
import toast from 'react-hot-toast'
import ConfirmModal from '../Modal/ConfirmModal'
import OptionPopover from '../PopoverOption/OptionPopover'
import { useRouter } from 'next/navigation'
import ListDetail from './EditList/ListEditModal'
import { list, task } from '@/lib/type'
import { useFilterContext } from '@/context/FilterContextProvider'
import { useTasksContext } from '@/context/TasksContextProvider'
import SortFilter from '@/utils/sort'

interface TaskListProps {
    alltasks: task[],
    id: string,
    list: list
}

export default function TaskList({ alltasks, id, list }: TaskListProps) {

    const [isLoading, setIsLoading] = useState(false)
    const [isOpenEdit, setIsOpenEdit] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const router = useRouter()

    const { filter } = useFilterContext()
    const { tasks, setTasks } = useTasksContext()

    useEffect(() => {
        if (tasks === undefined) {
            setTasks(alltasks)
        }
    })

    if (tasks === undefined) {
        return
    }

    const tasksInList = tasks.filter(task => task.list?._id === list._id)
    const filteredTasksInList = tasksInList
        .filter(task =>
            filter.priority.includes(task.priority)
        )
        .filter(task =>
            filter.isViewCompleted ? task : !task.isChecked
        )
    const sortedTasks = SortFilter(filteredTasksInList,filter.sort)

    
    const unfinishedTasks = tasksInList.filter(task => !task.isChecked)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            await fetch(`/api/dashboard/${id}/list/${list._id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'DELETE',
            })

            toast.success('Tag Deleted')
            router.push(`/${id}`)
            window.location.reload()

        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <ListDetail
                isOpen={isOpenEdit}
                onClose={() => setIsOpenEdit(false)}
                title='Edit'
                list={list}
            />
            <ConfirmModal
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                onConfirm={handleDelete}
                title='Delete Tag'
                desc={`This will permanently delete "${list.name}" and all its tasks. This can’t be undone.`}
            />
            <main className='flex flex-col h-full w-full gap-5 overflow-clip'>
                <div className=''>
                    <Header hideOption={false} length={unfinishedTasks.length} title={list.name}>
                        <OptionPopover dateCreated={list.createdAt} onEdit={() => setIsOpenEdit(true)} onDelete={() => setIsOpenDelete(true)} isLoading={isLoading} />
                    </Header>
                </div>
                {filteredTasksInList.length === 0
                    ?
                    <div className='flex w-full flex-col items-center'>
                        <Image
                            alt='emptytaskintag'
                            width={1000}
                            height={1000}
                            src={'/emptytasklist.png'}
                            className='w-[300px] bg-cover'
                        />
                        <p className='tracking-tight text-gray-800 text-sm'>No tasks in this tag at the moment</p>
                    </div>
                    :
                    <section className='w-full h-full rounded-lg overflow-auto'>
                        <DisplayTasks tasks={sortedTasks} />
                    </section>
                }
            </main>
        </>
    )
}
