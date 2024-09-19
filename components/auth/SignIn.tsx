'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'

const initialFormData = {
  email: '',
  password: '',
}

export default function SignInPage() {

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setFormData(prev => (
      {
        ...prev,
        [name]: value
      }))
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault()

      const form = e.currentTarget
      if (formData.email.trim() === '') {
        form.email.focus()
        toast.error('Invalid input fields')
        return
      }
      if (formData.password.trim() === '') {
        form.email.focus()
        toast.error('Invalid input fields')
        return
      }

      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: '/'
      })

    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <section className='h-screen lg:p-10 px-5 xl:w-2/3 md:mx-auto'>
      <form onSubmit={handleSubmit} className='flex lg:flex-row flex-col h-full'>
        <div className='lg:rounded-xl w-full lg:flex items-center justify-center hidden overflow-hidden'>
          <Image
            src={'/emptytoday.png'}
            alt=''
            width={1000}
            height={1000}
            className='bg-cover w-auto'
          />
        </div>
        <div className='flex flex-col gap-5 w-full justify-center items-center h-full'>
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
            <h1 className='text-4xl font-bold text-gray-800 tracking-tight'>Sign in</h1>
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
                <Button onClick={() => setIsShowPassword(prev => !prev)} variant={'ghost'} type='button' className='py-[2px] px-1 h-fit'>
                  <Image
                    src={`/icons8-${isShowPassword ? 'show' : 'hide'}-password-20.png`}
                    alt='eye'
                    width={20}
                    height={20}
                  />
                </Button>
              </div>
            </label>
            <button
              type='submit'
              className='w-full py-3 px-2 bg-[#dc4c3e] transition-all duration-200 text-white ease-in-out hover:bg-[#c04c44] font-bold rounded-lg'>
              Sign in
            </button>
            <div className='flex items-center text-gray-800 gap-2'>
              <div className='w-full h-0 border' />
              <h1>or</h1>
              <div className=' w-full h-0 border' />
            </div>
            <div className='flex font-bold justify-center gap-5 text-gray-900'>
              <button
                type='button'
                onClick={handleGoogleSignIn}
                className='bg-gray-200 rounded-lg w-full text-[#dc4c3e] py-3 hover:bg-opacity-80 transition-all duration-200 ease-in-out'>Google</button>
              <button
                disabled
                type='button'
                onClick={() => { }}
                className='bg-gray-200 rounded-lg w-full text-[#dc4c3e] py-3 hover:bg-opacity-80 transition-all duration-200 ease-in-out'>Facebook (soon)</button>
            </div>
          </div>
          <p className='text-center text-sm text-muted-foreground'>
            Don&#39;t have an account?
            <Link
              href={'signup'}
            >
              <span className='underline ml-1'>Sign up</span>
            </Link>
          </p>
        </div>
      </form>
    </section>
  )
}
