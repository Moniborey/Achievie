import connectMongoDB from "@/lib/db"
import List from "@/models/List"
import Task from "@/models/Task"
import User from "@/models/User"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const taskData = await req.json()

        if (!taskData.task) {
            return NextResponse.json('Task Required', { status: 400 })
        }

        await connectMongoDB();
        const newTask = taskData.list !== ''
            ?
            await new Task({
                userID: id,
                task: taskData.task,
                description: taskData.description,
                priority:taskData.priority,
                dueDate: taskData.dueDate !== ''
                    ? Date.parse(taskData.dueDate)
                    : Date.now(),
                list: taskData.list
            }).save()
            :
            await new Task({
                userID: id,
                task: taskData.task,
                description: taskData.description,
                priority:taskData.priority,
                dueDate: taskData.dueDate !== ''
                    ? Date.parse(taskData.dueDate)
                    : Date.now(),
            }).save()

        if (taskData.list !== '') {
            await List.findOneAndUpdate({ _id: taskData.list }, {
                $push: { tasks: new mongoose.Types.ObjectId(newTask._id) }
            })
        }

        await User.findOneAndUpdate({ userID: id }, {
            $push: { tasks: new mongoose.Types.ObjectId(newTask._id) }
        })

        return NextResponse.json('Task Created', { status: 201 })

    } catch (error) {
        return NextResponse.json('Internal error', { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const taskData = await req.json()
        await connectMongoDB();
        const user = await User.find({ userID: id })
        const arrayOfIDs = taskData.overDueTasks.map((task:any)=>task._id)

        if (!user) {
            return NextResponse.json('Unauthenticated', { status: 400 })
        }

        if (!taskData.overDueTasks) {
            return NextResponse.json('Task Required', { status: 400 })
        }

        await Task.updateMany({_id:{ $in : arrayOfIDs}},
            {
                dueDate:taskData.dueDate
            })

        return NextResponse.json('Task Updated', { status: 200 })

    } catch (error) {
        return NextResponse.json('Internal error', { status: 500 })
    }
}