'use client'

import React, { useMemo } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { formatDate, lastDayOfMonth, month, weekday } from '@/utils/formatDate'
import Image from 'next/image'
import { Calendar } from '../ui/calendar'
import moment from 'moment'

interface DatePopoverProps {
    dateSelected :Date
    onSelect: (date:any) => void
    children?: React.ReactNode
    isChecked?: boolean
}

export default function DatePopover({ onSelect,dateSelected,children,isChecked }: DatePopoverProps) {
    const {today} = useMemo(() => ({
        today: moment().toDate(),
      }), [])

    const isOverdue = dateSelected.getDate() < today.getDate() && dateSelected.getMonth() <= today.getMonth() && dateSelected.getFullYear() <= today.getFullYear()
    const isToday = formatDate(dateSelected) === formatDate(today)
    const isTomorrow = dateSelected.getDate() === (today.getDate() + 1) % lastDayOfMonth.getDate()
    const nextWeek = (today.getDate() + (8 - today.getDay())) % lastDayOfMonth.getDate()
    const isNextMonth = today.getDate() > nextWeek ? 1 : 0
    const nextWeekDate = moment(`${nextWeek}-${month[(today.getMonth()+isNextMonth)%11]}-${today.getFullYear()}`)
    const isNextWeekend = moment().endOf('week').toDate().toLocaleDateString() === moment().add(1, 'days').toDate().toLocaleDateString() 
    || 
    moment().endOf('week').toDate().toLocaleDateString() === today.toLocaleDateString()
    const weekend = isNextWeekend ? moment(nextWeekDate).endOf('week').toDate() : moment().endOf('week').toDate();
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children ?
                children
                :
                <button
                    disabled={isChecked}
                    className={`${!isChecked&&'hover:bg-gray-200'} items-center flex gap-3 w-full ${!isChecked&&'hover:bg-opacity-50'} transition-all duration-75 ease-in-out data-[state=open]:bg-gray-200 bg-opacity-50 rounded-md p-3`}>
                    {isToday 
                    ? 
                    <Image
                        src={'/icons8-today-24.png'}
                        alt='today'
                        width={24}
                        height={24}
                    />
                    :
                    isTomorrow
                    ?
                    <svg viewBox='0 0 24 24' width={24} height={24} focusable={false}>
                        <path color='orange' fill='currentColor' fillRule='evenodd' d='M9.704 17.544a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.956-2.31a.5.5 0 0 0-.27-.653Zm5.931-14.32a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.957-2.31a.5.5 0 0 0-.27-.653ZM9.704 6.457a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 1 1 .924-.383l.956 2.31a.5.5 0 0 1-.27.653Zm5.931 14.32a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 0 1 .924-.383l.957 2.31a.5.5 0 0 1-.27.653ZM7.5 12a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Zm8 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-9.314 2.95a.5.5 0 0 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924l2.31-.957Zm14.32-5.932a.5.5 0 1 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924l2.31-.957Zm-2.692 5.932a.5.5 0 1 1 .383-.924l2.31.957a.5.5 0 0 1-.384.924l-2.31-.957ZM3.494 9.018a.5.5 0 0 1 .382-.924l2.31.957a.5.5 0 1 1-.383.924l-2.31-.957Z' />
                    </svg>
                    :
                    <Image 
                    src={'/defaultdate.png'}
                    alt='defaultdatelogo'
                    width={24}
                    height={24}
                    />
                    }
                    <h1 className={`${isChecked && 'text-muted-foreground'} ${isOverdue && !isChecked && 'text-red-500'} text-black`}>
                        {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : formatDate(dateSelected)}
                    </h1>
                </button>}
            </PopoverTrigger>
            <PopoverContent align='end' className="w-fit -mb-20 md:-mb-24 py-2 px-1">
                <div className='border-b p-2 w-full'>
                    <h4 className="font-medium text-sm leading-none text-gray-500">{dateSelected.toDateString()}</h4>
                </div>
                {!isToday &&
                <button
                onClick={()=>onSelect(today)}
                className="flex w-full hover:bg-gray-200 hover:bg-opacity-50 text-sm gap-2 px-2 py-1 md:p-2 items-center">
                    <Image
                        src={'/icons8-today-24.png'}
                        alt='today'
                        width={24}
                        height={24}
                    />
                        <div className='flex w-full justify-between items-center'>
                            <h1>Today</h1>
                            <h1 className='text-gray-500'>{weekday[today.getDay()]}</h1>
                        </div>
                </button>
                }
                {!isTomorrow &&
                <button 
                onClick={()=>onSelect(moment().add(1, 'days').toDate())}
                className='flex w-full hover:bg-gray-200 hover:bg-opacity-50 text-sm gap-2 px-2 py-1 md:p-2 items-center'>
                    <svg viewBox='0 0 24 24' width={24} height={24} focusable={false}>
                        <path color='orange' fill='currentColor' fillRule='evenodd' d='M9.704 17.544a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.956-2.31a.5.5 0 0 0-.27-.653Zm5.931-14.32a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.957-2.31a.5.5 0 0 0-.27-.653ZM9.704 6.457a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 1 1 .924-.383l.956 2.31a.5.5 0 0 1-.27.653Zm5.931 14.32a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 0 1 .924-.383l.957 2.31a.5.5 0 0 1-.27.653ZM7.5 12a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Zm8 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-9.314 2.95a.5.5 0 0 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924l2.31-.957Zm14.32-5.932a.5.5 0 1 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924l2.31-.957Zm-2.692 5.932a.5.5 0 1 1 .383-.924l2.31.957a.5.5 0 0 1-.384.924l-2.31-.957ZM3.494 9.018a.5.5 0 0 1 .382-.924l2.31.957a.5.5 0 1 1-.383.924l-2.31-.957Z' />
                    </svg>
                    <div className='flex w-full justify-between items-center'>
                        <h1>Tomorrow</h1>
                        <h1 className='text-gray-500'>{weekday[today.getDay() + 1]}</h1>
                    </div>
                </button>         
                }
                <button 
                onClick={()=>onSelect(weekend)}
                className='flex w-full hover:bg-gray-200 hover:bg-opacity-50 text-sm gap-2 px-2 py-1 md:p-2 items-center'>
                    <svg viewBox='0 0 24 24' width={24} height={24} focusable={false}>
                        <path color='blue' fill='currentColor' fillRule='evenodd' d='M16 6a3 3 0 0 1 3 3v1h.1c1 0 1.9 1 1.9 2v4c0 1-.8 2-1.9 2H18v.5a.5.5 0 0 1-1 0V18H7v.5a.5.5 0 0 1-1 0V18H5a2 2 0 0 1-2-2v-4c0-1.1.9-2 2-2V9a3 3 0 0 1 3-3h8zm3 5a1 1 0 0 0-1 .9V15H6v-3a1 1 0 0 0-2-.1V16c0 .5.4 1 .9 1H19a1 1 0 0 0 1-.9V12c0-.6-.4-1-1-1zm-3-4H8c-1 0-2 .8-2 1.9v1.4c.6.3 1 1 1 1.7v2h10v-2a2 2 0 0 1 1-1.7V9c0-1-.8-2-1.9-2H16z' />
                    </svg>
                    <div className='flex w-full justify-between items-center'>
                        <h1>{isNextWeekend ? 'Next' : 'This'} Weekend</h1>
                        <h1 className='text-gray-500'>{`${weekday[6]} ${weekend.getDate()} ${month[weekend.getMonth()]}`}</h1>
                    </div>
                </button>
                <button 
                onClick={()=>onSelect(nextWeekDate.toDate())}
                className='flex w-full hover:bg-gray-200 hover:bg-opacity-50 text-sm gap-2 px-2 py-1 md:p-2 items-center'>
                    <svg viewBox='0 0 24 24' width={24} height={24} focusable={false}>
                        <path color='purple' fill='currentColor' fillRule='evenodd' d='M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM5 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6Zm8.354 4.647a.5.5 0 0 0-.708.707l1.647 1.647H8.5a.5.5 0 1 0 0 1h5.793l-1.647 1.646a.5.5 0 0 0 .708.707l2.5-2.5a.5.5 0 0 0 0-.707l-2.5-2.5ZM7 8a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1H7Z' />
                    </svg>
                    <div className='flex w-full justify-between items-center'>
                        <h1>Next week</h1>
                        <h1 className='text-gray-500 md:ml-5'>
                            {`Mon ${nextWeek} ${month[(today.getMonth()+isNextMonth)%11]}`}
                        </h1>
                    </div>
                </button>
                <Calendar 
                fromDate={today}
                disabled={dateSelected}
                mode="single"
                selected={dateSelected}
                onSelect={onSelect}
                className="rounded-md pb-0"
                />
            </PopoverContent>
        </Popover>
    )
}
