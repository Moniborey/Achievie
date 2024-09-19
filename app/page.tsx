import { getServerSession } from 'next-auth'
import React from 'react'
import { options } from './api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import User from '@/models/User'
import connectMongoDB from '@/lib/db'
import HomePage from '@/components/Homepage/HomePage'

export default async function page() {

  const session = await getServerSession(options)

  if (session) {
    await connectMongoDB()
    const user = await User.findOne({ userID: session.id }).lean().exec() as any
    if (user) {
      redirect(`/${user.userID}`)
    }
  }

  return (
    <HomePage />
  )
}
