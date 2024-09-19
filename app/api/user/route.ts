import User from "@/models/User"
import { NextResponse } from "next/server"
import bcrypt from 'bcrypt'
import connectMongoDB from "@/lib/db"

export async function POST(req: Request) {
    try {
        const userData = await req.json()

        if (!userData.email || !userData.password) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(userData.email)) {
            return NextResponse.json({ message: 'Invalid Email' }, { status: 400 })
        }

        await connectMongoDB()
        const duplicate = await User.findOne({ email: userData.email }).lean().exec()

        if (duplicate) {
            return NextResponse.json({ message: 'Duplicate Email' }, { status: 409 })
        }

        const hashPassword = await bcrypt.hash(userData.password, 10)
        userData.password = hashPassword

        const newUser = await new User({
            name: userData.email.split('@')[0],
            email: userData.email,
            password: userData.password
        })

        newUser.userID = newUser._id.toString()
        newUser.save()

        return NextResponse.json({ message: 'User Created' }, { status: 201 })
    } catch (error) {
        return NextResponse.json('Internal error', { status: 500 })
    }
}