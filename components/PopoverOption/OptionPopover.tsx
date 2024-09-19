'use client'

import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image'
import { PenBox, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'

interface  OptionPopoverProps{
    onDelete?:() => void;
    isLoading?:boolean;
    onEdit?:() => void;
    dateCreated: Date
}

export default function OptionPopover({
    onDelete,
    isLoading=false,
    onEdit,
    dateCreated
}:OptionPopoverProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={'ghost'}>
                    <Image
                    alt=''
                    src={'/icons8-3-dots-24.png'}
                    width={20}
                    height={20}
                    className='text-end'
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className="w-fit py-4 px-0">
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <div className='border-b pt-0 p-4 w-full'>
                            <h4 className="font-medium text-sm leading-none text-gray-500">{`Added on ${dateCreated?.toDateString()}`}</h4>
                        </div>
                        <div className='px-2'>
                            <button onClick={onEdit} disabled={isLoading} className='flex w-full hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-2 gap-3 border-0 items-center'>
                                <PenBox color='green' width={20} height={20}/>
                                <p className="text-sm font-medium">
                                    Edit
                                </p>
                            </button>
                            <button disabled={isLoading} onClick={onDelete} className='flex w-full hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-2 gap-3 border-0 items-center'>
                                <Trash2 color='red' width={20} height={20}/>
                                <p className="text-sm text-red-600 font-medium">
                                    Delete
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
