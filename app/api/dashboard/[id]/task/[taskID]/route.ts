import connectMongoDB from "@/lib/db";
import List from "@/models/List";
import Task from "@/models/Task";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { taskID: string, id: string } }) {
    try {
        const { id, taskID } = params
        const task = await req.json()

        await connectMongoDB()

        const user = await User.find({ userID: id })

        if (!user) {
            return NextResponse.json('Unauthenticated', { status: 400 })
        }

        if (!task) {
            return NextResponse.json('Task Required', { status: 400 })
        }

        if (task.list.hasOwnProperty('name')) {
            await Task.findByIdAndUpdate(taskID,
                {
                    task: task.task,
                    description: task.description,
                    list: task?.list,
                    dueDate: task.dueDate,
                    isChecked: task.isChecked,
                    priority:task.priority
                })
            await List.findOneAndUpdate({ tasks: taskID }, {
                $pull: { tasks: new mongoose.Types.ObjectId(taskID) }
            })
            await List.findByIdAndUpdate({ _id: task.list._id }, {
                $push: { tasks: new mongoose.Types.ObjectId(taskID) }
            })
        } else {
            await Task.findByIdAndUpdate(taskID,
                {
                    task: task.task,
                    description: task.description,
                    dueDate: task.dueDate,
                    isChecked: task.isChecked,
                    priority:task.priority,
                    $unset: { list : '' }
                })
            await List.findOneAndUpdate({ tasks: taskID }, {
                $pull: { tasks: new mongoose.Types.ObjectId(taskID) }
            })
        }

        return NextResponse.json('Task Updated', { status: 200 })

    } catch (error) {
        return NextResponse.json('Internal Error', { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const taskID = await req.json()

        await connectMongoDB()

        const user = await User.find({ userID: id })

        if (!user) {
            return NextResponse.json('Unauthenticated', { status: 400 })
        }

        if (!taskID) {
            return NextResponse.json('Task Required', { status: 400 })
        }

        const deleteTask = Task.findByIdAndDelete(taskID)
        const deleteTaskUser = User.findOneAndUpdate({ userID: id }, {
            $pull: { tasks: new mongoose.Types.ObjectId(taskID) }
        })
        const deleteTaskList = List.findOneAndUpdate({ tasks: taskID }, {
            $pull: { tasks: new mongoose.Types.ObjectId(taskID) }
        })

        await Promise.all([deleteTask, deleteTaskUser, deleteTaskList])

        return NextResponse.json('Task Deleted', { status: 200 })

    } catch (error) {
        return NextResponse.json('Internal Error', { status: 500 })
    }
}