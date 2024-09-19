'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'

export default function HomeNav() {

  const [isOpen, setIsOpen] = useState(false)

  const handleSetSection = (e: any, secID: string, isMobile?:boolean) => {
    e.preventDefault()
    const section = document.getElementById(secID);
    if (section) {
      window.scrollTo({ top: section.offsetTop - 100 });
      if(isMobile){
        setIsOpen(false)
      }
    } else {
      window.scrollTo({ top: 0 });
      if(isMobile){
        setIsOpen(false)
      }
    }
  }


  return (
    <div className='fixed top-0 z-10 bg-white'>
      <nav className='w-screen px-7 flex justify-between items-center py-4 border-b md:border-b-0'>
        <div className='flex gap-1 w-full select-none items-center'>
          <Image
            src={'/logo/icons8-goal-48.png'}
            alt=''
            width={10000}
            height={10000}
            className='size-[45px]'
          />
          <h1 className='font-bold pointer-events-none text-[#de483a] md:text-2xl text-xl'>Achievie</h1>
        </div>
        <div className='flex-1 hidden md:flex items-center gap-3 text-gray-800'>
          <div className='flex items-center border-r pr-3'>
            <Button onClick={(e) => handleSetSection(e, 'features')} variant={'ghost'} className='text-base md:min-w-28'>
              Features
            </Button>
            <Link href={'/api/auth/signin'} className='text-base hover:bg-accent hover:text-accent-foreground md:min-w-28 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
              Log in
            </Link>
          </div>
          <Link href={'auth/signup'} className='bg-[#de483a] hover:bg-[#c04c44] text-base text-white font-bold md:min-w-28 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
            Register
          </Link>
        </div>
        <Button onClick={() => setIsOpen(prev => !prev)} variant={'ghost'} className='px-2 md:hidden block'>
          <MenuIcon width={25} height={25} />
        </Button>
      </nav>
      <section className={`w-full absolute top-[78px] bg-white md:hidden transition-all duration-150 ease-in-out max-h-0 overflow-hidden space-y-3 px-3 -z-10 ${isOpen && 'max-h-44 py-7 opacity-100 z-10 border-b-2 border-[#de483a]'}`}>
        <Button onClick={(e) => handleSetSection(e, 'features',true)} variant={'ghost'} className='w-full text-base md:min-w-28 justify-start'>
          Features
        </Button>

        <div className='flex py-5 items-center border-t gap-2'>
          <Link href={'/api/auth/signin'} className='text-base w-full bg-accent hover:bg-slate-200 hover:text-accent-foreground md:min-w-28 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
            Log in
          </Link>
          <Link href={'auth/signup'} className='bg-[#de483a] w-full hover:bg-[#c04c44] text-base text-white font-bold md:min-w-28 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
            Register
          </Link>
        </div>

      </section>
    </div>
  )
}
