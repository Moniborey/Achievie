import { options } from '@/app/api/auth/[...nextauth]/options'
import Navbar from '@/components/Navbar/Navbar'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function layout({ children, params }: { children: React.ReactNode, params:{id:string} }) {

  const {id} = params
  const session = await getServerSession(options)

  if (!session) {
    redirect('/')
  }

  const user = await User.findOne({userID:params.id}).lean().exec() as any

  if(!user){
    redirect('/')
  }

  return (
    <main className='flex lg:overflow-hidden lg:flex-row lg:h-screen flex-col p-1 gap-2 lg:p-5 lg:gap-5'>
      {/* Nav */}
      <section className='h-full lg:relative sticky top-0 z-50'>
        <Navbar id={id} name={user.name} img={user.image} />
      </section>
      {/* MainPage */}
      <section className='transition-all w-full ease-in-out duration-200 px-1 lg:px-0 h-full'>
        {children}
      </section>
    </main>
  )
}
