'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useTasksContext } from '@/context/TasksContextProvider'
import moment from 'moment'
import { task } from '@/lib/type'
import { useParams, useRouter } from 'next/navigation'
import { CalendarDays, Edit2, Mail, User, X } from 'lucide-react'
import toast from 'react-hot-toast'
// import ConfirmModal from '../Modal/ConfirmModal'
import { signOut } from 'next-auth/react'
import { UploadButton } from '@/utils/uploadthing'
import dynamic from 'next/dynamic'

interface ProfileProps {
    profile: {
        name: string,
        email: string,
        image: string,
        joined: Date,
        tasks: task[]
    }
}

interface formData {
    name: string,
    image: string
}


export default function Profile({ profile }: ProfileProps) {
    
    const ConfirmModal = dynamic(() => import('../Modal/ConfirmModal'))
    const { tasks, setTasks } = useTasksContext()
    const { id } = useParams()
    const [isEdit, setIsEdit] = useState(false)
    const [isDeleteImg, setIsDeleteImg] = useState(false)
    const [formData, setFormData] = useState<formData>({
        name: profile.name,
        image: profile.image
    })
    const [deleteAccount, setDeleteAccount] = useState({
        isOpen: false,
        name: '',
        verify: ''
    })
    const router = useRouter()

    useEffect(() => {
        if (tasks === undefined) {
            setTasks(profile.tasks)
        }
    })

    useEffect(() => {
        if (isEdit === false) {
            setFormData({ image: profile.image, name: profile.name })
        }
    }, [isEdit, profile.name, profile.image])

    if (tasks === undefined) {
        return
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const res = await fetch(`/api/user/${id}`, {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                toast.success('Updated')
            } else {
                const error = await res.json()
                toast.error(error)
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            router.refresh()
            setIsEdit(false)
        }
    }

    const handleEditImage = async (imageProp?: any) => {
        try {
            const res = await fetch(`/api/user/${id}`, {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({ ...formData, image: imageProp, oldIMG: profile.image, origin: window.location.origin })
            })
            if (res.ok) {
                toast.success('Updated')
            } else {
                const error = await res.json()
                toast.error(error)
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            router.refresh()
            setIsEdit(false)
        }
    }

    const handleDeleteImage = async () => {
        try {
            const res = await fetch(`/api/user/${id}`, {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({ ...formData, image: '/icons8-user-100.png', oldIMG: profile.image, origin: window.location.origin })
            })

            if (res.ok) {
                toast.success('Updated')
            } else {
                const error = await res.json()
                toast.error(error)
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            router.refresh()
            setIsDeleteImg(false)
            setIsEdit(false)
        }
    }

    const handleDelete = async () => {
        try {
            if (deleteAccount.name.trim() !== profile.name || deleteAccount.verify.trim() !== 'delete my account') {
                toast.error('Not match')
                return
            }
            const deleteAcc = await fetch(`/api/user/${id}`, {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'DELETE',
            })

            if (deleteAcc.ok) {
                await signOut()
            } else {
                const error = await deleteAcc.json()
                toast.error(error)
            }

        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    const overDueTasks = tasks.filter(task => !task.isChecked && moment(task.dueDate).isBefore(moment(), 'days')).length
    const completedTasks = tasks.filter(task => task.isChecked).length

    return (
        <>
            <ConfirmModal
                title='Delete image'
                desc='Are you sure you want to remove your current photo?'
                isOpen={isDeleteImg}
                onClose={() => setIsDeleteImg(false)}
                onConfirm={handleDeleteImage}
            />
            <ConfirmModal
                title='Delete account'
                isOpen={deleteAccount.isOpen}
                onClose={() => setDeleteAccount(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleDelete}
                desc='This will immediately delete all of your data including tasks, tags, and more. This can&#39;t be undone.'>
                <div className='flex flex-col gap-4 text-gray-800'>
                    <div className='rounded-lg bg-red-700 px-2 py-3'>
                        <p className='text-white'><span className='text-white font-bold'>Warning:</span> This action is not reversible. Please be certain.</p>
                    </div>
                    <div className='border my-3' />
                    <div className='flex flex-col gap-4'>
                        <div className='space-y-1'>
                            <h1>Enter the account name <span className='font-bold'>&#34;{profile.name}&#34;</span> to continue:</h1>
                            <input required type="text" name='name' onChange={(e) => setDeleteAccount(prev => ({ ...prev, name: e.target.value }))} value={deleteAccount.name} className='w-full border px-2 py-1 outline-none rounded-lg mb-2' />
                        </div>
                        <div className='space-y-1'>
                            <h1>To verify, type <span className='font-bold'>&#34;delete my account&#34;</span> below:</h1>
                            <input required type="text" name='verify' onChange={(e) => setDeleteAccount(prev => ({ ...prev, verify: e.target.value }))} value={deleteAccount.verify} className='w-full rounded-lg border px-2 py-1 outline-none' />
                        </div>
                    </div>
                </div>
            </ConfirmModal>
            <section className='h-full rounded-lg flex-col flex gap-5 lg:overflow-hidden text-gray-800 2xl:container'>
                <h1 className='md:text-5xl lg:text-start text-center text-4xl font-bold'>Profile</h1>
                <div className='flex flex-col md:flex-row md:items-center justify-between'>
                    <div className='flex lg:gap-4 gap-3 md:my-6 my-3 items-center'>
                        <Image
                            src={profile.image}
                            alt='pfp'
                            width={10000}
                            height={10000}
                            className='w-[100px] md:w-[130px] md:h-[130px] h-[100px] object-cover xl:w-[150px] xl:h-[150px] rounded-full overflow-clip'
                        />
                        <form onSubmit={handleSubmit} className='flex flex-col'>
                            {isEdit
                                ?
                                <input type='text' value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className='w-full p-1 border rounded-lg outline-none' />
                                :
                                <h1 className='text-2xl md:text-3xl font-bold'>{profile.name}</h1>}
                            <h1 className='text-gray-500 lg:text-lg'>{profile.email}</h1>
                        </form>
                    </div>
                    <div className='flex gap-2'>
                        {isEdit &&
                            <>
                                <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        // Do something with the response
                                        handleEditImage(res[0].url)
                                        setIsEdit(false)
                                    }}
                                    onUploadError={(error: Error) => {
                                        // Do something with the error.
                                        toast.error(error.message)
                                    }}
                                />
                                {profile.image !== '/icons8-user-100.png' &&
                                    <Button type='button' onClick={() => setIsDeleteImg(true)} variant={'destructive'}>
                                        Remove photo
                                    </Button>}
                            </>
                        }
                        <Button onClick={() => setIsEdit(prev => !prev)} variant={'ghost'} className={`${isEdit && 'bg-gray-100'} border`}>
                            {isEdit ? <X width={20} height={20} /> : <Edit2 width={20} height={20} />}
                        </Button>
                    </div>
                </div>
                <h1 className='font-bold text-lg'>Personal information</h1>
                <div className='flex flex-col gap-3 -mt-1'>
                    <div className='flex gap-4 items-center'>
                        <div className='p-2 border bg-gray-50 rounded-lg'>
                            <User width={24} height={24} />
                        </div>
                        <div>
                            <h1 className='text-black'>{profile.name}</h1>
                            <h2 className='text-gray-500 text-sm'>Your name</h2>
                        </div>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <div className='p-2 border bg-gray-50 rounded-lg'>
                            <Mail width={24} height={24} />
                        </div>
                        <div>
                            <h1 className='text-black'>{profile.email}</h1>
                            <h2 className='text-gray-500 text-sm'>Your email address</h2>
                        </div>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <div className='p-2 border bg-gray-50 rounded-lg'>
                            <CalendarDays width={24} height={24} />
                        </div>
                        <div>
                            <h1 className='text-black'>{profile.joined.toDateString()}</h1>
                            <h2 className='text-gray-500 text-sm'>Your join date</h2>
                        </div>
                    </div>
                </div>
                <h1 className='font-bold text-lg mt-1'>Statistics</h1>
                <div className='grid lg:grid-cols-4 grid-cols-2 gap-3'>
                    <div className='border rounded-xl py-3 lg:py-5 px-5'>
                        <h1 className='text-xl font-bold text-center'>{tasks.length !== 0 ? (completedTasks * 100 / tasks.length).toFixed(2) : 0}%</h1>
                        <h2 className='text-gray-500 text-center'>Completion rate</h2>
                    </div>
                    <div className='border rounded-xl py-3 lg:py-5 px-5'>
                        <h1 className='text-xl font-bold text-center'>{tasks.length}</h1>
                        <h2 className='text-gray-500 text-center'>Total tasks</h2>
                    </div>
                    <div className='border rounded-xl py-3 lg:py-5 px-5'>
                        <h1 className='text-xl font-bold text-center'>{completedTasks}</h1>
                        <h2 className='text-gray-500 text-center'>Tasks completed</h2>
                    </div>
                    <div className='border rounded-xl py-3 lg:py-5 px-5'>
                        <h1 className='text-xl font-bold text-center'>{overDueTasks}</h1>
                        <h2 className='text-gray-500 text-center'>Overdue</h2>
                    </div>
                </div>
                <div className='mt-auto flex-col flex gap-3'>
                    <h1 className='font-bold text-lg'>Delete account</h1>
                    <div className='space-y-2'>
                        <p className='text-xs text-gray-700'>This will immediately delete all of your data including tasks, tags, and more. This can&#39;t be undone.</p>
                        <Button onClick={() => setDeleteAccount(prev => ({ ...prev, isOpen: true }))} variant={'ghost'} className='h-fit w-fit text-sm py-1 px-2 hover:text-red-600 border-2 text-red-600 border-red-500'>
                            Delete account
                        </Button>
                    </div>
                </div>
            </section>
        </>
    )
}
