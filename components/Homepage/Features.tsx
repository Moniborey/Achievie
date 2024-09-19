'use client'

import React, { useEffect, useState } from 'react'
import Section from './Section'
import Image from 'next/image'

interface features {
    id: string
    subhead: string,
    heading: string,
    desc: string,
    img: string
}

const ffeatures: features[] = [{
    id: 'feature1',
    subhead: 'Clear your mind',
    heading: 'The fastest way to get tasks out of your head.',
    desc: 'Type just about anything into the task field and Achievie’s will instantly fill your to-do list.',
    img: 'feature1'

}, {
    id: 'feature2',
    subhead: 'Focus on what’s important',
    heading: 'Reach that mental clarity you’ve been longing for.',
    desc: 'Your tasks are automatically sorted into Today, Upcoming, and custom Filter views to help you prioritize your most important work.',
    img: 'feature2.1'
}, {
    id: 'feature3',
    subhead: 'Organize your work, too',
    heading: 'Where all your tasks can finally coexist.',
    desc: 'Give your team a shared space to collaborate and stay on top of it all – alongside but separate from your personal tasks and projects.',
    img: 'feature3'
}]

export default function Features() {

    const [scrollPosition, setScrollPosition] = useState(0)
    const [featureIMG, setFeatureIMG] = useState('feature1')

    useEffect(() => {
        const handleScrollFeatures = () => {
            const scrollY = window.scrollY
            const feature2OffsetTop = document.getElementById('feature2')?.offsetTop
            const feature3OffsetTop = document.getElementById('feature3')?.offsetTop
            setScrollPosition(scrollY)

            if (feature2OffsetTop && feature3OffsetTop) {
                if (scrollPosition >= feature2OffsetTop - 250 && scrollPosition < feature3OffsetTop - 250) {
                    setFeatureIMG('feature2.1')
                } else if (scrollPosition >= feature3OffsetTop - 250) {
                    setFeatureIMG('feature3')
                } else {
                    setFeatureIMG('feature1')
                }
            }
        }
        window.addEventListener('scroll', handleScrollFeatures)
        return () => {
            window.removeEventListener('scroll', handleScrollFeatures)
        }
    }, [scrollPosition, featureIMG])

    return (
        <Section id='features' className='overflow-visible lg:pr-5 flex'>
            <div className='w-full flex flex-col'>
                {
                    ffeatures.map(feature => (
                        <section id={feature.id} key={feature.id} className='h-screen max-h-[40rem] w-full max-w-[30rem] mx-auto flex flex-col lg:mb-0 mb-7 md:mb-24 justify-center gap-7'>
                            <h2 className='font-semibold text-lg text-[#de483a]'>{feature.subhead}</h2>
                            <h1 className='text-3xl md:leading-[3rem] md:text-4xl font-bold text-gray-800'>{feature.heading}</h1>
                            <p className='text-gray-600 font-semibold text-lg md:text-xl'>{feature.desc}</p>
                            <Image
                                src={`/${feature.img}.png`}
                                alt={feature.img}
                                width={10000}
                                height={10000}
                                className='object-fill w-full md:min-h-[360px] md:max-h-[450px] max-h-[280px] min-h-[280px] mt-2 block lg:hidden border border-gray-300 rounded-lg overflow-hidden'
                            />
                        </section>
                    ))
                }
            </div>
            <div className='border border-gray-300 max-w-[650px] h-[528px] rounded-xl overflow-hidden hidden lg:block w-full sticky top-32'>
                <Image
                    src={`/${featureIMG}.png`}
                    alt={featureIMG}
                    width={10000}
                    height={10000}
                    className='object-fill h-full m-auto'
                />
            </div>
        </Section>
    )
}
