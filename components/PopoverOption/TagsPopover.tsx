'use client'

import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ColorVariants } from '@/lib/color'
import { X } from 'lucide-react'

interface TagsPopoverProps {
    onSelect: (a: any) => void
    lists: any | undefined
    selected: any
    isChecked?:boolean
}

const fortailwindtoread = {
    red:'bg-red-500',
    green:'bg-green-400',
    yellow:'bg-yellow-400',
    pink:'bg-pink-400',
    purple:'bg-purple-400',
    black:'bg-black',
    blue:'bg-blue-500',
    orange:'bg-orange-400',
    cyan:'bg-cyan-500'
}

export default function TagsPopover({
    onSelect,
    lists,
    selected,
    isChecked
}: TagsPopoverProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    disabled={isChecked}
                    className={`flex gap-4 w-full bg-opacity-50 ${!isChecked&&'hover:bg-opacity-50'} ${!isChecked&&'hover:bg-gray-200'} transition-all duration-75 ease-in-out data-[state=open]:bg-gray-200 rounded-md p-3`}>
                    {selected.color
                        ?
                        <div className={`rounded-md w-5 items-center ${ColorVariants[selected.color as keyof typeof ColorVariants]}`} />
                        :
                        <X width={20} height={20} />
                    }
                    <h1 className={`${isChecked&&'text-muted-foreground'} text-black`}>{selected.name ? selected.name : 'No tag'}</h1>
                </button>
            </PopoverTrigger>
            {lists && <PopoverContent align='end' className="min-w-full p-0">
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <div className='p-1'>
                            {lists.length !== 0 
                            ? 
                            <>
                            {lists.filter((list: any) => list.name !== selected?.name).map((list: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => onSelect(list)}
                                    className='flex w-full hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-2 gap-4 border-0 items-center'>
                                    <div className={`w-5 h-5 rounded-md ${ColorVariants[list.color as keyof typeof ColorVariants]}`} />
                                    <p className="text-sm font-medium">
                                        {list.name}
                                    </p>
                                </button>
                            ))}
                            {selected.name && <button
                                onClick={() => onSelect('')}
                                className='flex w-full hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-2 gap-4 border-0 items-center'>
                                <X width={20} height={20} />
                                <p className="text-sm font-medium">
                                    None
                                </p>
                            </button>}
                            </>
                            :
                            <h1 className='text-gray-500 text-sm text-center'>
                                No tag at the moment
                            </h1>
                            }
                        </div>
                    </div>
                </div>
            </PopoverContent>}
        </Popover>
    )
}
