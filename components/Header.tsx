import React from 'react'
import AddTask from './Task/AddTask'
import FilterPopover from './PopoverOption/FilterPopover'

interface headerProps {
  length: number
  title: string
  hideOption?: boolean
  children?: React.ReactNode
}

export default function Header({
  length,
  title,
  hideOption = true,
  children,
}: headerProps) {
  return (
    <header className='flex lg:justify-between lg:flex-row flex-col gap-2 lg:items-center'>
      <div className='flex text-4xl text-gray-800 md:text-5xl font-semibold lg:flex-row flex-col justify-center lg:justify-start tracking-tighter gap-1 md:gap-3 items-center'>
        <h1>{title}</h1>
        <div className='border lg:py-1 font-normal px-2 lg:px-3'>
          {length}
        </div>
      </div>
      <div className='flex gap-1 justify-between'>
        <AddTask />
        <div className='flex items-center'>
          <FilterPopover />
          {!hideOption && children}
        </div>
      </div>
    </header>
  )
}
