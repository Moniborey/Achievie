'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'

const initialFormData = {
    email: '',
    password: '',
    cpassword: ''
}

export default function SignUpPage() {

    const [isShowPassword, setIsShowPassword] = useState(false)
    const [formData, setFormData] = useState(initialFormData)
    const router = useRouter()

    const handleChange = (e: any) => {
        const { name, value } = e.target

        setFormData(prev => (
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const validate = (e: any) => {
        const form = e.currentTarget
        if (formData.cpassword.trim() !== formData.password.trim()) {
            form.password.focus()
            return false
        }
        if (formData.email.trim() === '') {
            form.email.focus()
            return false
        }
        return true
    }

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault()
            if (!validate(e)) {
                toast.error('Invalid input fields')
                return
            }
            const response = await fetch('/api/user', {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                toast.success('Signup successfully')
                router.push('signIn')
            }else{
                const res = await response.json()
                toast.error(res.message)
            }
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <section className='h-screen lg:p-10 px-5 xl:w-2/3 mx-auto'>
            <form onSubmit={handleSubmit} className='flex lg:flex-row flex-col lg:gap-5 h-full'>
                <div className='lg:rounded-xl lg:flex items-center justify-center hidden w-full overflow-hidden'>
                    <Image
                        src={'/emptylist.png'}
                        alt=''
                        width={1000}
                        height={1000}
                        className='bg-cover w-auto'
                    />
                </div>
                <div className='w-full flex flex-col gap-5 justify-center items-center h-full'>
                    <div className='flex flex-col mx-2 gap-5 w-full md:w-[440px]'>
                        <Link href={'/'} className='flex gap-1 m-auto items-center mb-10'>
                            <Image
                                src={'/logo/icons8-goal-48.png'}
                                alt='logo'
                                width={48}
                                height={48}
                            />
                            <h1 className='text-3xl text-[#dc4c3e] font-bold tracking-tight'>Achievie</h1>
                        </Link>
                        <h1 className='text-4xl font-bold text-gray-800 tracking-tight'>Sign up</h1>
                        <label className='p-2 w-full flex text-sm text-gray-800 flex-col gap-1 border rounded-lg'>
                            Email
                            <input
                                required
                                type="email"
                                placeholder='Enter your email...'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                className='outline-none text-base'
                            />
                        </label>
                        <label className='p-2 w-full flex text-sm text-gray-800 flex-col gap-1 border rounded-lg'>
                            Password
                            <div className='flex justify-between'>
                                <input
                                    required
                                    type={isShowPassword ? 'text' : "password"}
                                    placeholder='Enter your password...'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    className='outline-none text-base'
                                />
                            </div>
                        </label>
                        <label className='p-2 w-full flex text-sm text-gray-800 flex-col gap-1 border rounded-lg'>
                            Confirm password
                            <input
                                required
                                type={isShowPassword ? 'text' : "password"}
                                placeholder='Confirm your password...'
                                name='cpassword'
                                value={formData.cpassword}
                                onChange={handleChange}
                                className='outline-none text-base'
                            />
                        </label>
                        <Button onClick={() => setIsShowPassword(prev => !prev)} variant={'ghost'} type='button' className='p-2 text-sm text-gray-700 -mt-4 ml-auto flex gap-2 h-fit w-fit'>
                            <Image
                                src={`/icons8-${isShowPassword ? 'show' : 'hide'}-password-20.png`}
                                alt='eye'
                                width={20}
                                height={20}
                            />Password
                        </Button>
                        <button
                            type='submit'
                            className='w-full py-3 px-2 bg-[#dc4c3e] transition-all duration-200 text-white ease-in-out hover:bg-[#c04c44] font-bold rounded-lg'
                        >
                            Sign up
                        </button>
                    </div>
                    <p className='text-center text-sm text-muted-foreground'>
                        Already signed up?
                        <Link
                            href={'signIn'}
                        >
                            <span className='underline ml-1'>Go to login</span>
                        </Link>
                    </p>
                </div>
            </form>
        </section>
    )
}
