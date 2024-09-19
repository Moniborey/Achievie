'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import './Calendar.css'
import TaskDetail from '../TaskDetail/TaskDetail'
import { task } from '@/lib/type'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import ConfirmModal from '../Modal/ConfirmModal'
import { useTasksContext } from '@/context/TasksContextProvider'
import TaskModal from '../Task/AddTaskModal'
import CustomTaskComponent from './CustomTaskComponent'

interface CalendarPageProps {
    formattedTasks:task[]
}

export default function CalendarPage({ formattedTasks }: CalendarPageProps) {
    const { tasks,setTasks } = useTasksContext()
    const [isAddOpen, setIsAddOpen] = useState({
        isOpen:false,
        dueDate:new Date()
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isDeletedOpen, setIsDeletedOpen] = useState({
        isOpen: false,
        selectedID: ''
    })
    const [viewType, setViewType] = useState<View>('month')
    const [date, setDate] = useState(moment().toDate())
    const [selectedEvent, setSelectedEvent] = useState({
        id: '',
        isOpen: false
    })
    const params = useParams()
    const router = useRouter()

    useEffect(()=>{
        if(tasks === undefined){
          setTasks(formattedTasks)
        }
      })

    const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate])

    const {defaultDate} = useMemo(() => ({
        defaultDate: moment().toDate(),
    }), [])

    if (tasks === undefined) {
        return
    }

    
    const formattedCalendarTasks = tasks.map((task)=>(
        {
          id:task._id,
          title: task.task,
          start: task.dueDate,
          end: task.dueDate,
          allDay: true,
          priority: task.priority,
          isChecked: task.isChecked,
          resource:{
            listID:task?.list?._id,
            listColor:task?.list?.color,
            listName:task?.list?.name
          },
        }
      ))


    const handleSelectSlot = ({ start }:any) => {
        setIsAddOpen({isOpen:true,dueDate:start})
    }

    const handleSelectEvent = (event: any) => {
        setSelectedEvent({
            id: event.id,
            isOpen: true
        })
    }

    const handleEdit = async (taskData: task) => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/dashboard/${params.id}/task/${taskData._id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'PATCH',
                body: JSON.stringify(taskData)
            })
            if(res.ok){
                setTasks(prev => prev?.map(task => (
                    taskData._id === task._id
                        ? taskData
                        : task
                )))
                toast.success('Task Updated')
            }else{
                const error = await res.json()
                toast.error(error)
            }
            // router.refresh()

        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCheck = async (taskData: task) => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/dashboard/${params.id}/task/${taskData._id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'PATCH',
                body: JSON.stringify({ ...taskData, isChecked: !taskData.isChecked })
            })
            if(res.ok){
                setTasks(prev => prev?.map(task => (
                    taskData._id === task._id
                        ? { ...task, isChecked: !task.isChecked }
                        : task
                )))
            }else{
                const error = await res.json()
                toast.error(error)
            }
            // router.refresh()

        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (taskID: string) => {
        try {
            setIsLoading(true)

            const res = await fetch(`/api/dashboard/${params.id}/task/${taskID}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'DELETE',
                body: JSON.stringify(taskID)
            })
            if(res.ok){
                setTasks(prev => prev?.filter(t => t._id !== taskID))
                toast.success('Task Deleted')
            }else{
                const error = await res.json()
                toast.error(error)
            }
            setSelectedEvent({ id: '', isOpen: false })
            setIsDeletedOpen({ isOpen: false, selectedID: '' })
            router.refresh()

        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const localizer = momentLocalizer(moment)

    return (
        <>
            <TaskModal
                isOpen={isAddOpen.isOpen}
                onClose={() => setIsAddOpen(prev=>({...prev,isOpen:false}))}
                title='Add task :'
                dueDate={isAddOpen.dueDate}
            />
            <ConfirmModal
                isOpen={isDeletedOpen.isOpen}
                onConfirm={() => handleDelete(isDeletedOpen.selectedID)}
                onClose={() => setIsDeletedOpen({ isOpen: false, selectedID: '' })}
                desc="Are you sure you want to delete this task?"
                title="Delete Task"
            />
            <TaskDetail
                onCheck={handleCheck}
                loading={isLoading}
                onEdit={handleEdit}
                onDelete={setIsDeletedOpen}
                isOpen={selectedEvent.isOpen}
                onClose={() => setSelectedEvent(prev => ({ ...prev, isOpen: false }))}
                task={selectedEvent.id}
            />
            <section className='h-[96dvh]'>
                <Calendar
                    selectable
                    date={date}
                    events={formattedCalendarTasks}
                    localizer={localizer}
                    defaultView='month'
                    defaultDate={defaultDate}
                    view={viewType}
                    onView={(v) => setViewType(v)}
                    onNavigate={onNavigate}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    views={['month', 'week', 'day']}
                    components={{
                        event: CustomTaskComponent
                    }}
                />
            </section>
        </>
    )
}
