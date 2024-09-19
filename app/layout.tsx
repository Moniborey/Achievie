import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ToastProvider from '@/providers/ToastProvider'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import FilterContextProvider from '@/context/FilterContextProvider'
import TasksContextProvider from '@/context/TasksContextProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Achievie',
  description: 'Organized your thoughts and get things done',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel='icon' href='/logo/icons8-goal-48.png'/>
      </head>
      <body className={inter.className}>
        <ToastProvider/>
        <TasksContextProvider>
          <FilterContextProvider>
            {children}
          </FilterContextProvider>
        </TasksContextProvider>
      </body>
    </html>
  )
}
