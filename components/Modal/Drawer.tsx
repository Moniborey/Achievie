'use client'

import React from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { cn } from '@/utils/CN';

interface TaskDetailDrawerProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  classname?: string;
  hideHeader: boolean
}

export default function DetailDrawer({
  title,
  description,
  isOpen,
  onClose,
  children,
  classname,
  hideHeader
}: TaskDetailDrawerProps) {

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onChange}>
      <DrawerContent className={cn('h-[100dvh] p-4 rounded-md', classname)}>
        {!hideHeader && <DrawerHeader className="text-left p-0">
          <DrawerTitle className='text-3xl text-gray-800'>
            {title}
          </DrawerTitle>
          <DrawerDescription>
            {description}
          </DrawerDescription>
        </DrawerHeader>}
        {children}
      </DrawerContent>
    </Drawer>
  )
}
