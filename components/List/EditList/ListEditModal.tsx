'use client'

import DetailDrawer from '@/components/Modal/Drawer';
import { Modal } from '@/components/Modal/Modal';
import React from 'react'
import { useMediaQuery } from 'react-responsive';
import ListForm from '../ListForm/ListForm';
import { list } from '@/lib/type';

interface ListDetailProps{
  isOpen:boolean;
  onClose:()=>void;
  onConfirm?:()=>void;
  loading?:boolean;
  title?:string;
  list?:list
}

export default function ListDetail(props:ListDetailProps) {

  const isMedium = useMediaQuery({
    query: '(min-width: 800px)'
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
        <ListForm SetIsOpenNewList={props.onClose} Data={props.list}/>
      </Modal>
    )
  }

  return (
    <DetailDrawer
    hideHeader={false}
    isOpen={props.isOpen}
    title={props.title}
    onClose={props.onClose}
    classname='h-[50dvh]'
    >
      <ListForm SetIsOpenNewList={props.onClose} Data={props.list}/>
    </DetailDrawer>
  )
}
