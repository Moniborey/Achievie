'use client'

import { CheckboxAccentColor, CheckboxColor, ColorVariants } from "@/lib/color"
import { formatDate } from "@/utils/formatDate"
import Image from "next/image"
import { useState } from "react"
import OptionPopover from "../PopoverOption/OptionPopover"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { cn } from "@/utils/CN"
import { ArrowDownCircle, ArrowRightCircle, CheckCircle } from "lucide-react"
import { Button } from "../ui/button"
import DatePopover from "../PopoverOption/DatePopover"
import { task } from "@/lib/type"
import { useTasksContext } from "@/context/TasksContextProvider"
import { useFilterContext } from "@/context/FilterContextProvider"
import ConfirmModal from "../Modal/ConfirmModal"
import TaskDetail from "../TaskDetail/TaskDetail"

const fortailwindtoread = {
  P1: 'border-l-red-600',
  P2: 'border-l-yellow-400',
  P3: 'border-l-blue-600',
  P4: 'border-l-gray-500',
  Pp1: 'accent-red-600',
  Pp2: 'accent-yellow-300',
  Pp3: 'accent-blue-600',
  Pp4: 'accent-muted-foreground'
}

interface DisplayTasksProps {
  tasks: task[],
}

export default function DisplayTasks({ tasks }: DisplayTasksProps) {

  const moment = require('moment')
  const { filter } = useFilterContext()
  const { setTasks } = useTasksContext()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeletedOpen, setIsDeletedOpen] = useState({
    isOpen: false,
    selectedID: ''
  })
  const [isOverdueOpen, setIsOverdueOpen] = useState({
    accordion: false,
    modal: false
  })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedID, setSelectedID] = useState<string>()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const params = useParams()
  const router = useRouter()
  const overDueTasks = tasks.filter(task => !task.isChecked && moment(task.dueDate).isBefore(moment(), 'days'))
  let grouped

  if (filter.group === 'priority') {
    const groupedPriority = tasks.reduce((group: any, task: task): any => {
      let priority = task.priority
      if (group[priority as keyof typeof group] === undefined) {
        group[priority as keyof typeof group] = []
      }
      group[priority as keyof typeof group].push(task)
      return group;
    }, {})
    grouped = groupedPriority
  }else if(filter.group === 'tag') {
    const groupedTag = tasks.reduce((group: any, task: task): any => {
      let tag = task.list?.name
      if (group[tag as keyof typeof group] === undefined) {
        group[tag as keyof typeof group] = []
      }
      group[tag as keyof typeof group].push(task)
      return group;
    }, {})
    grouped = groupedTag
  }else if(filter.group === 'dateadded') {
    const groupedDateAdded = tasks.reduce((group: any, task: task): any => {
      let dateAdded = task.createdAt.toDateString()
      if (group[dateAdded as keyof typeof group] === undefined) {
        group[dateAdded as keyof typeof group] = []
      }
      group[dateAdded as keyof typeof group].push(task)
      return group;
    }, {})
    grouped = groupedDateAdded
  }else if(filter.group === 'duedate') {
    const groupedDateAdded = tasks.reduce((group: any, task: task): any => {
      let dueDate = task.dueDate.toDateString()
      if (group[dueDate as keyof typeof group] === undefined) {
        group[dueDate as keyof typeof group] = []
      }
      group[dueDate as keyof typeof group].push(task)
      return group;
    }, {})
    grouped = groupedDateAdded
  }

  const handleTaskClick = (id: string) => {
    setSelectedID(id)
    setIsOpen(true);
  }

  const handleReschedule = async () => {
    try {
      const Data = {
        overDueTasks: overDueTasks,
        dueDate: selectedDate.toISOString()
      }
      setIsLoading(true)
      const res = await fetch(`/api/dashboard/${params.id}/task`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'PATCH',
        body: JSON.stringify(Data)
      })

      if (res.ok) {
        setTasks(prev => (prev?.map(task => ({ ...task, dueDate: Data.overDueTasks.includes(task) ? selectedDate : task.dueDate }))))
        toast.success('Overdue Task Updated')
      }
      else {
        const error = await res.json()
        toast.error(error)
      }
      setIsOverdueOpen({ ...isOverdueOpen, modal: false })

    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
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
      if (res.ok) {
        setTasks(prev => prev?.map(task => (
          taskData._id === task._id
            ? taskData
            : task
        )))
        toast.success('Task Updated')
      } else {
        const error = await res.json()
        toast.error(error)
      }

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
      if (res.ok) {
        setTasks(prev => prev?.filter(task => (taskID !== task._id)))
        toast.success('Task Deleted')
        router.refresh()
      }
      else {
        const error = await res.json()
        toast.error(error)
      }
      setIsDeletedOpen({ isOpen: false, selectedID: '' })
      setIsOpen(false)

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
      if (res.ok) {
        setTasks(prev => prev?.map(task => (
          taskData._id === task._id
            ? { ...task, isChecked: !task.isChecked }
            : task
        )))
      } else {
        const error = await res.json()
        toast.error(error)
      }

    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRescheduleSelect = (date: Date) => {
    setSelectedDate(date)
    setIsOverdueOpen({ ...isOverdueOpen, modal: true })
  }

  return (
    <>
      <ConfirmModal
        isOpen={isDeletedOpen.isOpen}
        onConfirm={() => handleDelete(isDeletedOpen.selectedID)}
        onClose={() => setIsDeletedOpen({ isOpen: false, selectedID: '' })}
        desc="Are you sure you want to delete this task?"
        title="Delete Task"
      />
      <ConfirmModal
        isOpen={isOverdueOpen.modal}
        onConfirm={handleReschedule}
        onClose={() => setIsOverdueOpen({ ...isOverdueOpen, modal: false })}
        desc={`Do you want to reschedule all overdue tasks to ${selectedDate.toDateString()}?`}
        title="Reschedule"
      />
      <TaskDetail
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={setIsDeletedOpen}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        task={selectedID}
        onCheck={handleCheck}
      />
      {/* Overdue task */}
      {overDueTasks.length !== 0 &&
        <section className="mb-5">
          <div className="flex justify-between border-b items-center">
            <div className="flex gap-2 items-center">
              <Button
                variant={'ghost'}
                onClick={() => setIsOverdueOpen({ ...isOverdueOpen, accordion: !isOverdueOpen.accordion })}
              >
                {isOverdueOpen.accordion ? <ArrowDownCircle color="red" width={20} height={20} /> : <ArrowRightCircle color="red" width={20} height={20} />}
              </Button>
              <h1 className="font-bold text-red-600">Overdue</h1>
            </div>
            <DatePopover dateSelected={selectedDate} onSelect={handleRescheduleSelect}>
              <Button
                size={"sm"}
                variant={"link"}
                className="text-red-600"
              >
                Reschedule
              </Button>
            </DatePopover>
          </div>
          <div className={cn("max-h-0 overflow-hidden border-x",
            { 'max-h-fit': isOverdueOpen.accordion })}>
            {overDueTasks.map((task, index: number) => (
              <div
                key={index}
                className={`flex items-center cursor-pointer border-l-4 ${CheckboxColor[task.priority]} justify-between w-full py-3 px-4 border-b`}>
                <div className={'flex w-full items-baseline gap-5'}>
                  <input
                    disabled={isLoading}
                    className={`cursor-pointer ${CheckboxAccentColor[task.priority]}`}
                    type="checkbox"
                    checked={task.isChecked}
                    onChange={() => handleCheck(task)}
                  />
                  <div onClick={() => handleTaskClick(task._id)} className='flex w-full flex-col gap-1'>
                    <p
                      className={cn("w-full", { 'text-muted-foreground line-through': task.isChecked })}
                    >
                      {task.task}
                    </p>
                    <div className={cn('flex gap-3 text-gray-800 text-sm items-center', { 'text-muted-foreground': task.isChecked })}>
                      {task.dueDate.getDate() !== new Date().getDate() &&
                        <div className='flex gap-3 items-center'>
                          <Image
                            src={'/icons8-calendar-cross-18.png'}
                            alt=''
                            width={18}
                            height={18}
                          />
                          <h3 className="text-red-600">{formatDate(task.dueDate)}</h3>
                        </div>}
                      <div className={`rounded-full py-[2px] px-2 ${ColorVariants[task?.list?.color as keyof typeof ColorVariants]} text-white`}>
                        <h3>{task?.list?.name}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <OptionPopover dateCreated={task.createdAt} onEdit={() => handleTaskClick(task._id)} onDelete={() => setIsDeletedOpen({ isOpen: true, selectedID: task._id })} />
              </div>
            ))}
          </div>
        </section>
      }
      {/* Tasks */}
      <div className="flex gap-3 px-4 items-center py-2">
        <CheckCircle color="green" width={18} height={18} />
        <h1 className="font-bold">Tasks</h1>
      </div>
      {filter.group === undefined || filter.group === ''
        ?
        <section className="flex flex-col gap-2">
          {tasks.filter(task => !overDueTasks.includes(task)).map((task, index: number) => (
            <div
              key={index}
              className={`flex items-center border-l-4 ${CheckboxColor[task.priority]} cursor-pointer justify-between w-full border rounded-r-lg py-3 px-3`}>
              <div className={'flex w-full items-baseline gap-3'}>
                <input
                  disabled={isLoading}
                  className={`cursor-pointer ${CheckboxAccentColor[task.priority]}`}
                  type="checkbox"
                  checked={task.isChecked}
                  onChange={() => handleCheck(task)}
                />
                <div onClick={() => handleTaskClick(task._id)} className='flex w-full flex-col gap-1'>
                  <p
                    className={cn("w-full", { 'text-muted-foreground line-through': task.isChecked })}
                  >
                    {task.task}
                  </p>
                  <div className={cn('flex gap-3 text-gray-800 text-sm items-center', { 'text-muted-foreground': task.isChecked })}>
                    {task.dueDate.getDate() === new Date().getDate() ?
                      <div className="px-2 flex gap-1 items-center">
                        <Image
                          src={'/icons8-today-24.png'}
                          alt='today'
                          width={24}
                          height={24}
                        />
                        Today
                      </div>
                      :
                      task.dueDate === moment().add(1, 'days')
                        ?
                        <div className="flex items-center gap-1">
                          <svg viewBox='0 0 24 24' width={24} height={24} focusable={false}>
                            <path color='orange' fill='currentColor' fillRule='evenodd' d='M9.704 17.544a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.956-2.31a.5.5 0 0 0-.27-.653Zm5.931-14.32a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.957-2.31a.5.5 0 0 0-.27-.653ZM9.704 6.457a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 1 1 .924-.383l.956 2.31a.5.5 0 0 1-.27.653Zm5.931 14.32a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 0 1 .924-.383l.957 2.31a.5.5 0 0 1-.27.653ZM7.5 12a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Zm8 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-9.314 2.95a.5.5 0 0 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924l2.31-.957Zm14.32-5.932a.5.5 0 1 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924l2.31-.957Zm-2.692 5.932a.5.5 0 1 1 .383-.924l2.31.957a.5.5 0 0 1-.384.924l-2.31-.957ZM3.494 9.018a.5.5 0 0 1 .382-.924l2.31.957a.5.5 0 1 1-.383.924l-2.31-.957Z' />
                          </svg>
                          Tomorrow
                        </div>
                        :
                        <div className='flex gap-3 items-center'>
                          <Image
                            src={'/icons8-calendar-cross-20.png'}
                            alt=''
                            width={18}
                            height={18}
                          />
                          <h3 className="text-gray-700">{formatDate(task.dueDate)}</h3>
                        </div>}
                    <div className={`rounded-full py-[2px] px-2 ${ColorVariants[task?.list?.color as keyof typeof ColorVariants]} text-white`}>
                      <h3>{task?.list?.name}</h3>
                    </div>
                  </div>
                </div>
              </div>
              <OptionPopover dateCreated={task.createdAt} onEdit={() => handleTaskClick(task._id)} onDelete={() => setIsDeletedOpen({ isOpen: true, selectedID: task._id })} />
            </div>
          ))}
        </section>
        :
        <section className="flex flex-col gap-4 mt-2">
          {Object.entries(grouped).map(([key, values]: any, index: any) =>
            <div key={index} className="px-3 py-1">
              <h1 className="font-bold text-gray-800">{key.startsWith('P') && filter.group === 'priority' ? key.replace('P', 'Priority ') : key}</h1>
              <div className="py-2">
                {values.map((task: task, i: number) => (
                  <div
                    key={i}
                    className={`flex items-center border-l-4 ${CheckboxColor[task.priority]} cursor-pointer justify-between w-full border rounded-r-lg py-3 px-3`}>
                    <div className={'flex w-full items-baseline gap-3'}>
                      <input
                        disabled={isLoading}
                        className={`cursor-pointer ${CheckboxAccentColor[task.priority]}`}
                        type="checkbox"
                        checked={task.isChecked}
                        onChange={() => handleCheck(task)}
                      />
                      <div onClick={() => handleTaskClick(task._id)} className='flex w-full flex-col gap-1'>
                        <p
                          className={cn("w-full", { 'text-muted-foreground line-through': task.isChecked })}
                        >
                          {task.task}
                        </p>
                        <div className={cn('flex gap-3 text-gray-800 text-sm items-center', { 'text-muted-foreground': task.isChecked })}>
                          {task.dueDate.getDate() === new Date().getDate() ?
                            <div className="px-2 flex gap-1 items-center">
                              <Image
                                src={'/icons8-today-24.png'}
                                alt='today'
                                width={24}
                                height={24}
                              />
                              Today
                            </div>
                            :
                            task.dueDate === moment().add(1, 'days')
                              ?
                              <div className="flex items-center gap-1">
                                <svg viewBox='0 0 24 24' width={24} height={24} focusable={false}>
                                  <path color='orange' fill='currentColor' fillRule='evenodd' d='M9.704 17.544a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.956-2.31a.5.5 0 0 0-.27-.653Zm5.931-14.32a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.957-2.31a.5.5 0 0 0-.27-.653ZM9.704 6.457a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 1 1 .924-.383l.956 2.31a.5.5 0 0 1-.27.653Zm5.931 14.32a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 0 1 .924-.383l.957 2.31a.5.5 0 0 1-.27.653ZM7.5 12a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Zm8 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-9.314 2.95a.5.5 0 0 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924l2.31-.957Zm14.32-5.932a.5.5 0 1 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924l2.31-.957Zm-2.692 5.932a.5.5 0 1 1 .383-.924l2.31.957a.5.5 0 0 1-.384.924l-2.31-.957ZM3.494 9.018a.5.5 0 0 1 .382-.924l2.31.957a.5.5 0 1 1-.383.924l-2.31-.957Z' />
                                </svg>
                                Tomorrow
                              </div>
                              :
                              <div className='flex gap-3 items-center'>
                                <Image
                                  src={'/icons8-calendar-cross-20.png'}
                                  alt=''
                                  width={18}
                                  height={18}
                                />
                                <h3 className="text-gray-700">{formatDate(task.dueDate)}</h3>
                              </div>}
                          <div className={`rounded-full py-[2px] px-2 ${ColorVariants[task?.list?.color as keyof typeof ColorVariants]} text-white`}>
                            <h3>{task?.list?.name}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <OptionPopover dateCreated={task.createdAt} onEdit={() => handleTaskClick(task._id)} onDelete={() => setIsDeletedOpen({ isOpen: true, selectedID: task._id })} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      }
    </>
  )
}
