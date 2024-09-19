'use client'

import React, { useRef } from 'react'

export default function IntroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const fastForward = (duration: any) => {
        if (videoRef.current) {
            setTimeout(() => {
                videoRef.current!.pause();
              }, duration);
            videoRef.current!.play()
        }
    };
    return (
        <video onClick={() => fastForward(1500)} ref={videoRef} src="/logo/introvideo.webm" className='w-auto' width={10000} height={10000} muted>Intro</video>
    )
}
