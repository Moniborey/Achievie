'use client'

import React, { Dispatch } from 'react'
import { useMediaQuery } from 'react-responsive';
import { Modal } from '../Modal/Modal';
import TaskDetailDrawer from '../Modal/Drawer';
import TaskDetailContent from './TaskDetailContent';

interface TaskDetailProps{
  isOpen:boolean;
  onClose:()=>void;
  onConfirm?:()=>void;
  onCheck:(data:any)=>Promise<void>;
  loading:boolean;
  title?:string;
  task:any
  onEdit:(taskID: any) => Promise<void>
  onDelete:Dispatch<React.SetStateAction<{
    isOpen: boolean;
    selectedID: string;
}>>
}

export default function TaskDetail(props:TaskDetailProps) {

  const isDesktop = useMediaQuery({
    query: '(min-width: 1024px)'
  })

  if(isDesktop){
    return (
      <Modal
      hideHeader={true}
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.title}
      classname='min-w-[860px] p-0'
      >
        <TaskDetailContent onCheck={props.onCheck} onEdit={props.onEdit} isLoading={props.loading} onDelete={props.onDelete} taskID={props.task}/>
      </Modal>
    )
  }

  return (
    <TaskDetailDrawer
    hideHeader={true}
    isOpen={props.isOpen}
    title={props.title}
    onClose={props.onClose}
    classname='h-[95dvh] p-0'
    >
      <TaskDetailContent onCheck={props.onCheck} onEdit={props.onEdit} isLoading={props.loading} onDelete={props.onDelete} taskID={props.task}/>
    </TaskDetailDrawer>
  )
}
