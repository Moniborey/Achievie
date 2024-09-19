'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button';
import DatePopover from '../PopoverOption/DatePopover';
import { list, priority } from '@/lib/type';
import PriorityPopover from '../PopoverOption/PriorityPopover';
import Image from 'next/image';
import TagsPopover from '../PopoverOption/TagsPopover';
import ConfirmModal from '../Modal/ConfirmModal';

interface formData {
  task: string;
  description: string;
  dueDate: Date;
  list: any;
  priority: priority
}

interface TaskIDFormProps {
  onClose: () => void
  dueDate?: Date
}

// Plan on adding subTask feature

export default function TaskIDForm(props: TaskIDFormProps) {
  const params = useParams()

  const initialData: formData = {
    task: '',
    description: '',
    dueDate: props.dueDate || new Date(),
    // dueTime:'',
    list: params.listid || '',
    priority: 'P4'
  }

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<formData>(initialData)
  const [ListData, setListData] = useState<list[]>([])


  useEffect(() => {
    if (!ListData.length) {
      fetch(`/api/dashboard/${params.id}/list`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'GET'
      })
        .then(res => res.json())
        .then(data => setListData(data))
    }
    if (ListData.length) {
      if (typeof formData.list !== 'object' && formData.list !== '') {
        setFormData({ ...formData, list: ListData.filter(l => l._id === formData.list)[0] })
      }
    }
  }, [ListData, formData, params.id])

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setFormData(prev => (
      {
        ...prev,
        [name]: value
      }
    ))
  }

  const handleCancelClick = () => {
    if (formData.task !== '' || formData.description !== '') {
      setIsOpen(true)
    } else props.onClose()
  }

  const handleSelectTag = (tag: string) => {
    setFormData({ ...formData, list: tag })
  }

  const handleSelectDuedate = (date: Date) => {
    setFormData({ ...formData, dueDate: date })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.task.trim().length) {
      e.target.task.focus();
      toast.error('Input cannot be whitespace only')
      return
    }
    try {
      setIsLoading(true)
      const res = await fetch(`/api/dashboard/${params.id}/task`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Task added')
      } else {
        const error = await res.json()
        toast.error(error)
      }
      props.onClose()
      window.location.reload()

    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ConfirmModal confirmtext='Discard task' isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={props.onClose} desc='Are you sure you want to discard your current task?' title='Are you sure?' />
      <form onSubmit={handleSubmit} className='flex text-gray-800 flex-col gap-3'>
        <input
          type="text"
          name="task"
          value={formData.task}
          required
          placeholder='Task'
          onChange={handleChange}
          className='bg-white border outline-none rounded-lg p-2'
        />
        <textarea
          name="description"
          value={formData.description}
          placeholder='Description'
          onChange={handleChange}
          className='bg-white border outline-none rounded-lg p-2'
        />
        <div className='w-full flex items-center gap-2'>
          <h2 className='hidden w-28 md:block text-gray-800 whitespace-nowrap'>Tag :</h2>
          <div className='w-full border rounded-lg'>
            <TagsPopover lists={ListData} onSelect={handleSelectTag} selected={formData.list} />
          </div>
        </div>
        <div className='flex items-center gap-2 w-full'>
          <h2 className='hidden w-28 md:block text-gray-800 whitespace-nowrap'>Due date :</h2>
          <div className='w-full border rounded-lg'>
            <DatePopover dateSelected={formData.dueDate} onSelect={handleSelectDuedate} />
          </div>
        </div>
        <div className='flex gap-2 items-center w-full'>
          <h2 className='hidden w-28 md:block text-gray-800 whitespace-nowrap'>Priority :</h2>
          <PriorityPopover selectedValue={formData.priority} onSelect={(value: priority) => setFormData({ ...formData, priority: value })}>
            <button
              className={`flex gap-4 w-full bg-opacity-50 transition-all duration-75 ease-in-out border rounded-lg data-[state=open]:bg-gray-200 hover:bg-gray-200 hover:bg-opacity-50 p-3 cursor-pointer`}>
              <Image
                src={`/priorities/${formData.priority}.png`}
                alt='priority'
                width={24}
                height={24}
                className='bg-cover'
              />
              <h1>{formData.priority}</h1>
            </button>
          </PriorityPopover>
        </div>
        <div className='flex justify-end gap-3 mt-5 text-white'>
          <Button
            type='button'
            disabled={isLoading}
            variant={'ghost'}
            onClick={handleCancelClick}
            className='text-black w-2/3 md:w-fit border'
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant={'destructive'}
            className='px-8 w-full md:w-fit'
          >
            Add task
          </Button>
        </div>
      </form>
    </>
  )
}

