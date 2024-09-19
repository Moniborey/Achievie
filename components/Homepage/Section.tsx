import { cn } from '@/utils/CN'
import React from 'react'

export default function Section({children,className,id}:{children:React.ReactNode,className?:string,id?:string}) {
  return (
    <section id={id} className={cn('container mt-14 md:mt-20 lg:mt-24',className)}>
        {children}
    </section>
  )
}
