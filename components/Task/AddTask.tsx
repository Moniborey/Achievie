'use client'

import React, { useState } from 'react'
// import TaskModal from './AddTaskModal'
import { Button } from '../ui/button'
import { PlusCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

export default function AddTask() {

    const TaskModal = dynamic(()=>import('./AddTaskModal'))
    const [isOpen,setIsOpen] = useState(false)

  return (
    <>
        <TaskModal 
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)}
        title='Add task :'
        />
        <Button
        variant={'ghost'}
        onClick={()=>setIsOpen(true)}
        className='flex rounded-lg w-fit text-gray-700 hover:bg-transparent items-center lg:hover:bg-opacity-70 lg:hover:bg-gray-100 p-0 lg:p-6 text-lg lg:border gap-3'>
          <PlusCircle width={24} height={24} color='#dc4c3e'/>
          <h1 className='whitespace-nowrap text-[#dc4c3e]'>Add task</h1>
      </Button>
    </>
  )
}
