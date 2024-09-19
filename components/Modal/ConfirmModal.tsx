'use client'

import React from 'react'
import { Modal } from './Modal'
import { Button } from '../ui/button';
import { cn } from '@/utils/CN';

interface ConfirmModalProps{
    isOpen:boolean;
    onClose:()=>void;
    onConfirm:()=>void;
    loading?:boolean;
    desc?:string
    title:string
    classname?:string
    confirmtext?:string
    children?:React.ReactNode
}

export default function ConfirmModal({confirmtext='Confirm',...props}:ConfirmModalProps) {
  return (
    <Modal
    isOpen={props.isOpen}
    onClose={props.onClose}
    title={props.title}
    description={props.desc}
    classname={cn('',props.classname)}
    >
      <section>
        {props.children}
        <div className="pt-10 space-x-2 flex items-center justify-end w-full">
            <Button
            variant={'outline'}
            onClick={props.onClose}
            disabled={props.loading}
            className='lg:w-fit w-full'
            >
            Cancel
            </Button>
            <Button
            variant={'destructive'}
            onClick={props.onConfirm}
            disabled={props.loading}
            className='lg:w-fit w-full'
            >
            {confirmtext}
            </Button>
        </div>
      </section>
    </Modal>
  )
}
