import React from 'react'
import Section from './Section'
import Image from 'next/image'
import Link from 'next/link'

const socialLinks = [{
    icon:'icons8-facebook-30.png',
    href:''
},{
    icon:'icons8-instagram-30.png',
    href:''
},{
    icon:'icons8-x-30.png',
    href:''
}]

export default function Footer() {
    return (
        <main className='bg-gradient-to-b lg:pt-20 pb-5 from-transparent via-[#ffefe5] to-[#ffefe5]'>
            <Section className='flex flex-col md:gap-10 gap-7'>
                <p className='text-3xl md:text-4xl lg:text-5xl font-bold mx-auto lg:w-3/4 text-center text-gray-800'>
                    Gain calmness and clarity with <br className='hidden mt-2 md:block'/> our most beloved productivity app
                </p>
                <Link href={'api/auth/signin'} className='bg-[#de483a] hover:bg-[#c04c44] w-fit hover:text-white px-5 py-3 lg:rounded-xl rounded-lg mx-auto text-base lg:text-lg text-white font-bold'>
                    Start for free
                </Link>
                <footer className='pt-5 lg:p-10 border-t border-gray-300 flex lg:flex-row flex-col'>
                    <div className='flex gap-5 items-center lg:block w-full lg:w-1/3'>
                        <div className='flex lg:mb-4 mb-0 gap-1 lg:w-full select-none items-center'>
                            <Image
                                src={'/logo/icons8-goal-48.png'}
                                alt=''
                                width={10000}
                                height={10000}
                                className='w-[45px] object-cover h-[45px] flex-shrink-0 grayscale'
                            />
                            <h1 className='font-bold hidden lg:block pointer-events-none text-gray-800 md:text-2xl text-xl'>Achievie</h1>
                        </div>
                        <p className='font-semibold w-full text-gray-800 lg:w-4/5'>Join us to organize work and life with Achievie.</p>
                    </div>
                    <div className='flex mt-5 lg:mt-0 flex-1 flex-col lg:flex-row justify-between px-14'>
                        <div className='flex font-semibold text-gray-800 py-5 flex-col gap-2 lg:py-0'>
                            <h1 className='font-bold md:mb-5'>Features</h1>
                            <h2>
                                How It Works
                            </h2>
                        </div>
                        <div className='flex text-gray-800 font-semibold py-5 flex-col gap-2 lg:py-0'>
                            <h1 className='font-bold md:mb-5'>About Me</h1>
                            <h2>Student</h2>
                            <h2>moniboreyc</h2>
                            <h2>Cambodian</h2>
                        </div>
                        <div className='py-5 lg:py-0 flex lg:flex-col gap-5'>
                            {
                                socialLinks.map(link=>(
                                    <Link target='_blank' key={link.icon} href={link.href}>
                                        <Image 
                                        src={`/${link.icon}`}
                                        alt=''
                                        width={10000}
                                        height={10000}
                                        className='object-cover size-[30px]'
                                        />
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </footer>
                <div className='w-full flex justify-between'>
                    <div className='flex select-none text-xs text-gray-700 items-center'>
                        <h1 className='px-2 py-1'>Security</h1>
                        <h1 className='px-2 py-1 border-x border-gray-600'>Privacy</h1>
                        <h1 className='px-2 py-1'>Terms</h1>
                    </div>
                    <h1 className='text-xs text-gray-700'>V0.1</h1>
                </div>
            </Section>
        </main>
    )
}
