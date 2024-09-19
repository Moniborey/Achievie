import connectMongoDB from "@/lib/db"
import List from "@/models/List"
import Task from "@/models/Task"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{ params }: { params: { id: string } }){
    try {

        const userData = await req.json()

        const {id} = params
        if(userData.name===''){
            return NextResponse.json('Name cannot be empty',{status:400})
        }
    
        await connectMongoDB()
        const foundUser = User.findOne({userID:id})
        if(!foundUser){
            return NextResponse.json('Unauthorized',{status:400})
        }
        await User.findOneAndUpdate({userID:id},{
            name:userData.name,
            image:userData.image
        })

        if(userData.hasOwnProperty('oldIMG')){
            const arrayUrl = userData.oldIMG.split('/')
            const imgName = arrayUrl[arrayUrl.length-1]
            await fetch(`${userData.origin}/api/uploadthing`,{method:"DELETE",body:JSON.stringify(imgName)})
        }
    
        return NextResponse.json('User updated',{status:200})
    
    } catch (error) {
        return NextResponse.json('Internal error',{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{id:string}}){
    try {

        const {id} = params
        await connectMongoDB()
        const foundUser = await User.findOne({userID:id})
        if(!foundUser){
            return NextResponse.json('Unauthorized',{status:400})
        }

        const deleteUser =  User.findOneAndDelete({userID:id})
        const deleteListUser = List.deleteMany({userID:id})
        const deleteTasksUser = Task.deleteMany({userID:id})

        await Promise.all([deleteUser,deleteListUser,deleteTasksUser])
        return NextResponse.json('User deleted',{status:200})

    } catch (error) {
        return NextResponse.json('Internal error',{status:500})
    }
}