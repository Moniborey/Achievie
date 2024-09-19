'use client'

import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image'
import { useFilterContext } from '@/context/FilterContextProvider'
import { priority } from '@/lib/type'

interface Priority {
  label: 'Priority 1' | 'Priority 2' | 'Priority 3' | 'Priority 4'
  value: priority
}

export const priorities: Priority[] = [
  {
    label: 'Priority 1',
    value: 'P1',
  },
  {
    label: 'Priority 2',
    value: 'P2',
  },
  {
    label: 'Priority 3',
    value: 'P3',
  },
  {
    label: 'Priority 4',
    value: 'P4',
  },
]

interface PriorityPopoverProps{
    onSelect:(p:any) => void
    children:React.ReactNode
    selectedValue:String
}

export default function PriorityPopover({onSelect,children,selectedValue}:PriorityPopoverProps) {

  const {filter,setFilter} = useFilterContext()

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent align='end' className="w-fit mt-1 p-0">
          <div className='p-1'>
            {priorities.map((p: Priority, index: number) => (
                <button
                  key={index}
                  onClick={() => onSelect(p.value)}
                  className='flex w-full justify-between gap-3 hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-2 border-0 items-center'>
                    <div className='flex gap-3 items-center'>
                      <Image
                      src={`/priorities/${p.value}.png`}
                      alt=''
                      width={20}
                      height={20}
                      className='bg-cover'
                      />
                      <p className="text-sm">
                        {p.label}
                      </p>
                    </div>
                    {
                      p.value === selectedValue &&
                      <Image
                      src={`/priorities/Pcheck.png`}
                      alt=''
                      width={18}
                      height={18}
                      className='bg-cover'
                    />
                    }
                </button>
              ))}        
        </div>
      </PopoverContent>
    </Popover>
  )
}
