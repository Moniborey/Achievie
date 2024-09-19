'use client'

import DetailDrawer from '@/components/Modal/Drawer';
import { Modal } from '@/components/Modal/Modal';
import React from 'react'
import { useMediaQuery } from 'react-responsive';
import AddTaskForm from './AddTaskForm';

interface TaskModalProps{
  isOpen:boolean;
  onClose:()=>void;
  onConfirm?:()=>void;
  loading?:boolean;
  title?:string;
  dueDate?:Date
}

export default function TaskModal(props:TaskModalProps) {

  const isMedium = useMediaQuery({
    query: '(min-width: 768px)'
  })

  if(isMedium){
    return (
      <Modal
      hideHeader={false}
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.title}
      classname='min-w-fit p-5'
      >
        <AddTaskForm dueDate={props.dueDate} onClose={props.onClose}/>
      </Modal>
    )
  }

  return (
    <DetailDrawer
    hideHeader={false}
    isOpen={props.isOpen}
    title={props.title}
    onClose={props.onClose}
    classname='h-[75dvh]'
    >
      <AddTaskForm dueDate={props.dueDate} onClose={props.onClose}/>
    </DetailDrawer>
  )
}
