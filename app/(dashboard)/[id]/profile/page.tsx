import Profile from '@/components/Profile/Profile'
import User from '@/models/User'
import formatTasks from '@/utils/formatTasks'
import React from 'react'

export default async function ProfilePage({params}:{params:{id:string}}) {
  const user = await User.findOne({userID:params.id}).lean().populate({
    path:'tasks',
    populate:{
      path:'list'
    }
  }).exec() as any
  const formattedUser = {
    name:user.name,
    email:user.email,
    image:user.image,
    joined:user.createdAt,
    tasks:formatTasks(user.tasks)
  }
  return (
    <Profile profile={formattedUser}/>
  )
}
