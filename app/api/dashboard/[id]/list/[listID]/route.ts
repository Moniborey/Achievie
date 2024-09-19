import connectMongoDB from "@/lib/db";
import List from "@/models/List";
import Task from "@/models/Task";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,{params}:{params:{id:string,listID:string}}){
    try {
        const { id,listID } = params
        const data = await req.json()

        await connectMongoDB();
        const user = await User.findOne({ userID: id })

        if (!user) {
            return NextResponse.json('Unauthenticated', { status: 400 })
        }

        if (!listID) {
            return NextResponse.json('Tag Required', { status: 400 })
        }

        await List.findByIdAndUpdate(listID,{
            name:data.name,
            color:data.color
        })

        return NextResponse.json('Tag Updated',{status:200})

    } catch (error) {
        return NextResponse.json('Internal Error', { status: 500 })
    }
}

export async function DELETE(req:Request,{params}:{params:{id:string,listID:string}}){
    try {
        const { id,listID } = params

        await connectMongoDB();
        const user = await User.findOne({ userID: id })
        const deletedList = await List.findById(listID)

        if (!user) {
            return NextResponse.json('Unauthenticated', { status: 400 })
        }
        
        if (!listID) {
            return NextResponse.json('Tag Required', { status: 400 })
        }

        const DeleteList =  List.findByIdAndDelete(listID)
        const DeleteListUser = User.findOneAndUpdate({ lists: listID }, {
            $pull: { lists: new mongoose.Types.ObjectId(listID) }
        })
        const DeleteTaskUser = await User.updateMany(
            { $pullAll: { tasks: deletedList.tasks } }
          );
        const DeleteAllTaskFromList = Task.deleteMany({list:listID})

        await Promise.all([DeleteAllTaskFromList,DeleteList,DeleteListUser,DeleteTaskUser])

        return NextResponse.json('Tag Deleted',{status:200})

    } catch (error) {
        return NextResponse.json('Internal Error', { status: 500 })
    }
}