import connectMongoDB from "@/lib/db"
import List from "@/models/List"
import User from "@/models/User"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const listData = await req.json()

        await connectMongoDB();

        const user = await User.findOne({ userID: id })

        if (!user) {
            return NextResponse.json('Unauthenticated', { status: 400 })
        }

        if (!listData.name || !listData.color) {
            return new NextResponse('Name and Color requires', { status: 400 })
        }

        const newList = await List.create(listData)

        await User.findOneAndUpdate({ userID: id }, {
            $push: { lists: new mongoose.Types.ObjectId(newList._id) }
        })

        return NextResponse.json('List Created', { status: 201 })

    } catch (error) {
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        await connectMongoDB();
        const user = await User.findOne({ userID: id })

        if (!user) {
            return NextResponse.json('Unauthenticated', { status: 400 })
        }

        const ListData = await List.find({ userID: id }).lean()

        return NextResponse.json(ListData) 

    } catch (error) {
        return NextResponse.json('Internal Error', { status: 500 })
    }
}