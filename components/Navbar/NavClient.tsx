'use client'

import { cn } from '@/utils/CN'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import ListForm from '../List/ListForm/ListForm'
import { ColorVariants } from '@/lib/color'
import ConfirmModal from '../Modal/ConfirmModal'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import ListDetail from '../List/EditList/ListEditModal'
import { useTasksContext } from '@/context/TasksContextProvider'
import { NavList } from '@/lib/type'
import { Menu, Plus, PlusCircle } from 'lucide-react'
import { Button } from '../ui/button'

interface taskTab {
  label: 'Upcoming' | 'Today' | 'Calendar' | 'Goal' | 'All Tasks'
  path: '/' | 'today' | 'calendar' | 'goal' | 'alltasks'
  iconIMG: string
  count?: number
}

interface NavBarProps {
  name: string
  todayCount: number
  listData: NavList[]
  profileIMG:any
}

export default function NavClient(props: NavBarProps) {

  const {tasks} = useTasksContext()
  const todayTasks = tasks?.filter(task => task.dueDate.toLocaleDateString() === new Date().toLocaleDateString() && !task.isChecked)
  const updatedlistData = props.listData.map(list=>({...list,taskcount:tasks?.filter(task=>task.list?._id===list.id && !task.isChecked).length}))

  const [isOpenNewList, SetIsOpenNewList] = useState({
    mobile: false,
    desktop: false
  })
  const [isOpen, setIsOpen] = useState({
    mobile: false,
    desktop: true
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()
  const { id } = useParams()

  const taskTabs: taskTab[] = [
    {
      label: 'All Tasks',
      path:'alltasks',
      iconIMG: pathname === `/${id}/alltasks` ? 'icons8-task-24(1).png' : 'icons8-task-24.png'
    }
    ,{
    label: 'Upcoming',
    path: '/',
    iconIMG: pathname === `/${id}` ? 'upcomingred.png' : 'icons8-double-right-24.png',
  }, {
    label: 'Today',
    path: 'today',
    iconIMG: pathname === `/${id}/today` ? 'todayred.png' : 'icons8-today-24.png',
    count: todayTasks?.length ? todayTasks.length : 0
  }, {
    label: 'Calendar',
    path: 'calendar',
    iconIMG: pathname === `/${id}/calendar` ? 'calendarred.png' : 'icons8-calendar-24.png',
  }, {
    label: 'Goal',
    path: 'goal',
    iconIMG: 'icons8-note-24.png',
    count: 0
  }]

  const handleGoogleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <>
      <ListDetail
        isOpen={isOpenNewList.mobile}
        onClose={() => SetIsOpenNewList(prev=>({...prev,mobile:false}))}
      />
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Sign Out'
        onConfirm={handleGoogleSignOut}
        desc='Are you sure you want to signout?'
      />
      {!isOpen.desktop &&
        <Button onClick={() => setIsOpen(prev => ({ ...prev, desktop: true }))} variant={'ghost'} className='h-fit absolute top-3 lg:block hidden hover:bg-[#f6efee] px-2'>
          <Menu width={24} height={24} />
        </Button>
      }
      {
        <>
          {/* Desktop Nav */}
          <nav className={cn('rounded-lg text-gray-800 bg-gray-100 transition-all duration-500 ease-in-out bg-opacity-60 overflow-hidden h-full max-w-[280px] hidden lg:flex flex-col translate-x-0 justify-between p-3', { 'opacity-50 max-w-0 -translate-x-[200%] -z-10': !isOpen.desktop })}>
            <section className='w-[250px] xl:w-[260px]'>
              <header className='gap-4 flex flex-col'>
                <div className='flex items-center justify-between'>
                  <Button variant={'ghost'} className={`px-2 hover:bg-[#f6efee] ${pathname === `/${id}/profile` && 'bg-[#fee6e3] hover:bg-[#fee6e3]'}`}>
                    <Link href={`/${id}/profile`} className='flex gap-3 items-center text-gray-800'>
                      <Image
                        alt=''
                        src={props.profileIMG}
                        width={10000}
                        height={10000}
                        className='overflow-clip object-cover rounded-full h-[40px] w-[40px]'
                      />
                      <h1 className={`${pathname === `/${id}/profile` && 'text-[#dc4c3e]'}`}>{props.name}</h1>
                    </Link>
                  </Button>
                  <Button onClick={() => setIsOpen(prev => ({ ...prev, desktop: false }))} variant={'ghost'} className='h-fit hover:bg-[#f6efee] px-2'>
                    <Menu width={24} height={24} />
                  </Button>
                </div>
              </header>
              <main className='my-6 text-gray-800'>
                <h1 className='text-sm tracking-tight uppercase'>tasks</h1>
                <div className='py-2'>
                  {
                    taskTabs.map((tab, index: number) => (
                      <Link href={`/${id}/${tab.path}`} key={index} className={cn('flex py-2 px-3 hover:bg-[#f6efee] items-center transition-all duration-75 ease-in-out justify-between rounded-lg', {
                        'font-bold bg-[#fee6e3] text-[#dc4c3e] hover:bg-[#fee6e3]'
                          :
                          tab.label === 'Upcoming' ? pathname === `/${id}` : pathname === `/${id}/${tab.path}`
                      })}>
                        <div className='flex items-center gap-3'>
                          <Image
                            alt=''
                            src={`/tasktabIcon/${tab.iconIMG}`}
                            width={20}
                            height={20}
                          />
                          <h2>{tab.label}</h2>
                        </div>
                        <div className={cn('rounded-lg transition-all bg-opacity-50 bg-gray-200 duration-75 ease-in-out text-gray-500 font-light text-center px-3', {
                          'bg-white font-normal text-[#dc4c3e]'
                            :
                            tab.label === 'Upcoming' ? pathname === `/${id}` : pathname === `/${id}/${tab.path}`
                        })}>
                          {tab?.count}
                        </div>
                      </Link>
                    ))
                  }
                </div>
                <div className='w-full my-3 h-0 border border-[#f6efee]' />
                <h1 className='text-sm tracking-tight uppercase'>tags</h1>
                <div className='py-2'>
                  {isOpenNewList.desktop ?
                    <ListForm
                      SetIsOpenNewList={() => SetIsOpenNewList(prev=>({...prev,desktop:false}))} />
                    :
                    <Button
                      variant={'ghost'}
                      onClick={() => SetIsOpenNewList(prev=>({...prev,desktop:true}))}
                      className='flex hover:bg-[#f6efee] items-center w-full py-2 h-fit px-0'>
                        <div className='mr-auto flex text-base gap-3 text-[#dc4c3e] items-center'>
                        <Plus color='#dc4c3e' width={24} height={24}/>
                        <h2>Add tag</h2>
                        </div>
                    </Button>}
                  <div className='flex flex-col overflow-auto max-h-[25dvh]'>
                    {
                      updatedlistData.map((list, index: number) => (
                        <Link href={`/${id}/tag/${list.id}`} key={index} className={cn('flex hover:bg-[#f6efee] items-center p-1 transition-all duration-75 ease-in-out justify-between rounded-lg', {
                          'font-bold bg-[#fee6e3] text-[#dc4c3e] hover:bg-[#fee6e3]'
                            :
                            pathname === `/${id}/tag/${list.id}`
                        })}>
                          <div className='flex items-center gap-4'>
                            <div className={`rounded-md ${ColorVariants[list.listColor as keyof typeof ColorVariants]} w-4 h-4`} />
                            <h2>{list.listName}</h2>
                          </div>
                          <div className={cn('rounded-lg bg-gray-200 transition-all text-gray-500 font-light mr-2 bg-opacity-50 duration-75 ease-in-out text-center px-3', {
                            'bg-white font-normal text-[#dc4c3e]'
                              :
                              pathname === `/${id}/tag/${list.id}`
                          })}>
                            {list.taskcount ? list.taskcount : props.listData.find(listt=>listt.id===list.id)?.taskcount}
                          </div>
                        </Link>
                      ))
                    }
                  </div>
                </div>
              </main>
            </section>
            <footer className='flex flex-col gap-3'>
              <Button
              variant={'ghost'}
                className='flex gap-3 text-gray-800 items-center w-fit p-0'
                onClick={() => setIsModalOpen(true)}>
                <Image
                  alt=''
                  src={'/icons8-sign-out-24.png'}
                  width={24}
                  height={24}
                />
                Sign out
              </Button>
            </footer>
          </nav>
          {/* Mobile Nav */}
          <nav className='bg-white lg:hidden'>
            <header className='border-b-2 flex justify-end border-[#dc4c3e] py-3 px-3'>
              {isOpen.mobile
                ?
                <button
                  onClick={() => setIsOpen(prev => ({ ...prev, mobile: false }))}
                >
                  <svg
                    className='cursor-pointer'
                    width={24} height={24} fill='none' viewBox='0 0 24 24'>
                    <path fill='currentColor' d='M4 18L18 4l2 2L6 20z' />
                    <path fill='currentColor' d='M6 4l14 14-2 2L4 6z' />
                  </svg>
                </button>
                :
                <button
                  onClick={() => setIsOpen(prev => ({ ...prev, mobile: true }))}
                >
                  <svg
                    className='cursor-pointer'
                    width={24} height={24} fill='none' viewBox='0 0 24 24'>
                    <path fill='currentColor' d='M2 3h20v3H2zm0 8h20v3H2zm0 8h20v3H2z' />
                  </svg>
                </button>
              }
            </header>
            {isOpen.mobile &&
              <main className='text-black h-[95dvh] flex flex-col justify-between overflow-hidden absolute text-lg z-50 w-full bg-white px-3'>
                <section className='mt-5'>
                  <div className='pt-3 w-full'>
                    <Image
                      alt=''
                      src={props.profileIMG}
                      width={1000}
                      height={1000}
                      className='rounded-full h-[100px] w-[100px] mx-auto overflow-clip'
                    />
                    <Button onClick={() => setIsOpen(prev => ({ ...prev, mobile: false }))} variant={'ghost'} className='mt-2 w-full border py-6'>
                      <Link href={`/${id}/profile`}>
                        <h1 className='font-bold text-gray-800 text-3xl'>{props.name}</h1>
                      </Link>
                    </Button>
                  </div>
                  <section className='flex flex-col mt-5'>
                    {
                      taskTabs.map((tab, index: number) => (
                        <Link 
                        href={`/${id}/${tab.path}`}
                        onClick={() => setIsOpen(prev => ({ ...prev, mobile: false }))}
                        key={index} 
                        className='flex py-1 items-center justify-between '>
                          <h2 className={cn('decoration-2 text-gray-800 hover:text-[#dc4c3e] hover:font-bold transition-all duration-75 ease-in-out underline-offset-8',
                            {
                              'font-bold text-[#dc4c3e] underline'
                                :
                                tab.label === 'Upcoming' ? pathname === `/${id}` : pathname === `/${id}/${tab.path}`
                            })}>
                            {tab.label}
                          </h2>
                          <div className={cn('rounded-lg transition-all duration-75 ease-in-out text-gray-500 font-light text-center px-2', {
                            'font-normal text-[#dc4c3e] bg-opacity-100'
                              :
                              tab.label === 'Upcoming' ? pathname === `/${id}` : pathname === `/${id}/${tab.path}`
                          })}>
                            {tab?.count}
                          </div>
                        </Link>
                      ))
                    }
                  </section>
                  <div className='w-1/2 my-3 h-0 border m-auto' />
                  <section className='flex gap-2 py-3 flex-col'>
                    <button
                      onClick={() => SetIsOpenNewList(prev=>({...prev,mobile:true}))}
                      className='flex transition-all duration-75 ease-in-out py-1 rounded-lg hover:rounded-sm items-center gap-3'>
                      <PlusCircle width={24} height={24} color='red'/>
                      <h2 className='text-[#dc4c3e]'>Add New Tag</h2>
                    </button>
                    {
                      updatedlistData.map((list, index: number) => (
                        <Link
                        onClick={() => setIsOpen(prev => ({ ...prev, mobile: false }))}
                        href={`/${id}/tag/${list.id}`} 
                        key={index} 
                        className='flex items-center py-0 transition-all duration-75 ease-in-out justify-between rounded-lg'>
                          <div className='flex items-center gap-4'>
                            <div className={`rounded-md ${ColorVariants[list.listColor as keyof typeof ColorVariants]} w-5 h-5`} />
                            <h2 className={cn('decoration-2 text-gray-800 hover:text-[#dc4c3e] hover:font-bold transition-all duration-75 ease-in-out underline-offset-8',
                              {
                                'font-bold text-[#dc4c3e] underline'
                                  :
                                  pathname === `/${id}/tag/${list.id}`
                              })}>
                              {list.listName}
                            </h2>
                          </div>
                          <div className={cn('transition-all text-gray-500 font-light duration-75 ease-in-out px-2', {
                            'font-normal text-[#dc4c3e]'
                              :
                              pathname === `/${id}/tag/${list.id}`
                          })}>
                            {list.taskcount ? list.taskcount : props.listData.find(listt=>listt.id===list.id)?.taskcount}
                          </div>
                        </Link>
                      ))
                    }
                  </section>
                </section>
                <footer className='pb-6'>
                  <Button
                    variant={'ghost'}
                    className='flex gap-3 items-center text-gray-800 p-0'
                    onClick={() => setIsModalOpen(true)}>
                    <Image
                      alt=''
                      src={'/icons8-sign-out-24.png'}
                      width={24}
                      height={24}
                    />
                    Sign out
                  </Button>
                </footer>
              </main>}
          </nav>
        </>
      }
    </>
  )
}


