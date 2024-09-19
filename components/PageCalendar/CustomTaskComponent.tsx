import { ColorVariants, PriorityColor } from '@/lib/color'
import { cn } from '@/utils/CN'
import React, { useMemo } from 'react'
import moment from 'moment'

const fortailwindtoread = {
  P1:'bg-red-600',
  P2:'bg-yellow-400',
  P3:'bg-blue-600',
  P4:'bg-gray-500'
}

export default function CustomTaskComponent({ event }: any) {
  const {today} = useMemo(() => ({
    today: moment().toDate(),
  }), [])

  const isOverdue = event.end.getDate() < today.getDate() && event.end.getMonth() <= today.getMonth() && event.end.getFullYear() <= today.getFullYear()
  
  return (
    <section className={cn(`${ColorVariants[event?.resource?.listColor as keyof typeof ColorVariants]} h-full flex gap-1 p-1 rounded-sm`,{'border border-black':!event.resource.listColor})}>
      <div className={`h-6 lg:w-2 w-1 ${PriorityColor[event.priority as keyof typeof PriorityColor]} flex-shrink-0`} />
      <h1 
      className={cn('text-white text-ellipsis overflow-hidden', 
      {
        'line-through decoration-2': event.isChecked,
        'text-black' : !event.resource.listColor,
        'text-red-400' : !event.isChecked && isOverdue
      })}>
          {event.title}
      </h1>
    </section>
  )
}
