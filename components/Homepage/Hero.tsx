import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <main className='h-screen relative border-gray-300 overflow-hidden border-b'>
      <section className='flex container flex-col gap-8 w-full items-center justify-center lg:mt-12 md:mt-16 mt-10'>
        <h1 className='text-gray-800 mt-24 w-[85%] md:w-2/3 lg:w-1/2 text-center text-4xl md:text-5xl md:leading-[80px] lg:text-[65px] font-bold'>Organize your work and life, finally.</h1>
        <p className='text-muted-foreground font-semibold text-center w-full md:text-xl'>
          Become focused, organized, and calm with Achievie. Our #1 <br className='hidden md:block' /> task manager and to-do list app.
        </p>
        <Link href={'api/auth/signin'} className='bg-[#de483a] hover:bg-[#c04c44] w-fit hover:text-white px-5 py-2 lg:rounded-xl rounded-lg mx-auto text-base lg:text-lg text-white font-bold'>
          Start for free
        </Link>
      </section>
      <Image
        src={'/hero.png'}
        alt='hero'
        width={10000}
        height={10000}
        className='-bottom-72 h-full object-cover -z-10 w-full absolute'
      />
    </main>
  )
}
