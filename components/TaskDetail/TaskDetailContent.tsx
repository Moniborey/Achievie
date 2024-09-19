'use client'

import React, { Dispatch, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/utils/CN'
import OptionPopover from '../PopoverOption/OptionPopover'
import { PenBox } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import TagsPopover from '../PopoverOption/TagsPopover'
import DatePopover from '../PopoverOption/DatePopover'
import { priority, task } from '@/lib/type'
import { useTasksContext } from '@/context/TasksContextProvider'
import PriorityPopover from '../PopoverOption/PriorityPopover'
import Image from 'next/image'
import { CheckboxAccentColor, ColorVariants } from '@/lib/color'

const fortailwindtoread = {
  red: 'bg-red-500',
  green: 'bg-green-400',
  yellow: 'bg-yellow-400',
  pink: 'bg-pink-400',
  purple: 'bg-purple-400',
  black: 'bg-black',
  blue: 'bg-blue-500',
  orange: 'bg-orange-400',
  cyan: 'bg-cyan-500'
}

interface TaskDetailContentProps {
  taskID: string,
  onDelete: Dispatch<React.SetStateAction<{
    isOpen: boolean;
    selectedID: string;
  }>>;
  onEdit: (task: task) => Promise<void>
  isLoading: boolean
  onCheck: (data: task) => void
}

export default function TaskDetailContent({ taskID, onDelete, isLoading, onEdit, onCheck }: TaskDetailContentProps) {

  const { tasks } = useTasksContext()
  const selectedTask = tasks!.filter(task => task._id === taskID)
  const formattedSelectedTask = selectedTask?.length ? selectedTask[0] : {} as task

  const [formData, setFormData] = useState(formattedSelectedTask)
  const [isEditTask, setIsEditTask] = useState(false)
  const [listData, setListData] = useState<any>()
  const { id } = useParams()
  const router = useRouter()

  const onSubmit = (e: any) => {
    e.preventDefault()

    setIsEditTask(false)
    onEdit(formData)
  }

  const handleCancelClick = () => {
    setFormData(selectedTask?.length ? selectedTask[0] : {} as task)
    setIsEditTask(false)
  }

  const handleCheck = (formData: task) => {
    onCheck(formData)
    setFormData(prev => ({ ...prev, isChecked: !prev.isChecked }))
  }

  const handleSelectTag = (tag: any) => {
    setFormData({ ...formData, list: tag })
  }

  const handleSelectDuedate = (date: Date) => {
    setFormData({ ...formData, dueDate: date })
  }

  useEffect(() => {
    fetch(`/api/dashboard/${id}/list`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => setListData(data))
  }, [id])

  return (
    <>
      <div className='flex justify-between py-1 px-3  border-b'>
        <Button
          onClick={() => router.push(`/${id}/tag/${formattedSelectedTask.list?._id}`)}
          variant={'ghost'}
          className={`flex gap-3 p-2 items-center text-gray-500 font-bold `}>
          <div className={`w-4 h-4 rounded-md ${ColorVariants[formattedSelectedTask?.list?.color as keyof typeof ColorVariants]}`} />
          <h1>{formattedSelectedTask.list?.name}</h1>
        </Button>
        <OptionPopover dateCreated={formattedSelectedTask.createdAt} isLoading={isLoading} onEdit={() => !formData.isChecked ? setIsEditTask(true) : {}} onDelete={() => onDelete({ isOpen: true, selectedID: taskID })} />
      </div>
      <form onSubmit={onSubmit} className='text-gray-800 h-[85dvh] lg:max-h-[90dvh]'>
        <div className='flex md:flex-row flex-col h-full gap-3'>
          <div className='flex w-full gap-2 items-baseline p-5'>
            <input
              type='checkbox'
              disabled={isEditTask || isLoading}
              checked={formData.isChecked}
              onChange={() => handleCheck(formData)}
              className={`cursor-pointer ${CheckboxAccentColor[formData.priority]}`}
            />
            <div className='flex gap-2 flex-col w-full'>
              <div
                className={cn('flex gap-2 w-full mb-5 flex-col p-1', { 'border-2 rounded-lg': isEditTask })}
                onClick={() => !formData.isChecked ? setIsEditTask(true) : {}}
              >
                {isEditTask
                  ?
                  <input
                    disabled={isLoading}
                    type='text'
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    className={"font-bold text-lg outline-none"}
                  />
                  :
                  <h1 className={cn("font-bold text-lg", { 'text-muted-foreground line-through': formData.isChecked })} >{formData.task}</h1>
                }
                <div className={'flex gap-1'}>
                  <svg viewBox='0 0 16 16' fill='none' width={16} height={16}>
                    <path fill='currentColor' d='M8.5 12a.5.5 0 1 1 0 1h-5a.5.5 0 0 1 0-1h5Zm3.864-4c.351 0 .636.224.636.5 0 .246-.225.45-.522.492L12.364 9H3.636C3.285 9 3 8.777 3 8.5c0-.245.225-.45.522-.491L3.636 8h8.728Zm0-4c.351 0 .636.224.636.5 0 .246-.225.45-.522.492L12.364 5H3.636C3.285 5 3 4.777 3 4.5c0-.245.225-.45.522-.491L3.636 4h8.728Z' />
                  </svg>
                  {
                    isEditTask
                      ?
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className='text-sm resize-none outline-none w-full text-gray-500' />
                      :
                      <p className='text-sm text-gray-500 w-[90%]'>
                        {formData.description ? formData.description : 'Description'}
                      </p>
                  }
                </div>
              </div>
              {isEditTask && <div className='flex -my-3 gap-2 justify-end'>
                <Button disabled={isLoading} onClick={handleCancelClick} type='button' variant={'secondary'}>Cancel</Button>
                <button type='submit' disabled={isLoading} className='border flex hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-2 gap-1 px-5 items-center'>
                  <PenBox color='green' width={20} height={20} />
                  <p className="text-sm font-medium">
                    Save
                  </p>
                </button>
              </div>}
            </div>
          </div>
          <div className='flex mt-10 md:mt-0 border-l tracking-tight w-full md:w-1/2 flex-col p-5 md:gap-4 text-sm md:bg-gray-100 md:bg-opacity-70'>
            <div className='w-full border-b  flex md:py-1 flex-col'>
              <h2 className='hidden md:block text-gray-600 whitespace-nowrap'>Tag</h2>
              <div onClick={() => setIsEditTask(true)}>
                <TagsPopover lists={listData} isChecked={formData.isChecked} onSelect={handleSelectTag} selected={formData.list} />
              </div>
            </div>
            <div className='flex flex-col text-sm md:py-1 border-b  w-full'>
              <h2 className='hidden md:block text-gray-600 whitespace-nowrap'>Due date</h2>
              <div onClick={() => setIsEditTask(true)}>
                <DatePopover dateSelected={formData.dueDate} isChecked={formData.isChecked} onSelect={handleSelectDuedate} />
              </div>
            </div>
            <div className='flex flex-col text-sm md:py-1 border-b  w-full'>
              <h2 className='hidden md:block text-gray-600 whitespace-nowrap'>Priority</h2>
              <PriorityPopover selectedValue={formData.priority} onSelect={(value: priority) => setFormData({ ...formData, priority: value })}>
                <button
                  disabled={formData.isChecked}
                  onClick={() => setIsEditTask(true)}
                  className={`flex gap-4 w-full bg-opacity-50 ${!formData.isChecked && 'hover:bg-opacity-50'} ${!formData.isChecked && 'hover:bg-gray-200'} transition-all duration-75 ease-in-out data-[state=open]:bg-gray-200 rounded-md p-3`}>
                  <Image
                    src={`/priorities/${formData.priority}.png`}
                    alt='priority'
                    width={24}
                    height={24}
                    className='bg-cover'
                  />
                  <h1 className={`${formData.isChecked && 'text-muted-foreground'} text-black`}>{formData.priority}</h1>
                </button>
              </PriorityPopover>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
