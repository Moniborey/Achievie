import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function Loading() {
  return (
    <section className='grid w-full h-screen place-content-center'>
      <div className='flex flex-col gap-4 items-center justify-center'>
        <Image 
        src={'/logo/icons8-goal-96.png'}
        alt='logo'
        width={90}
        height={90}
        />
        <Loader2 width={25} height={25} color='red' className='animate-spin transition-all duration-700 ease-in'/>
      </div>
    </section>
  )
}
