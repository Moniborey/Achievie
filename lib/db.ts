import mongoose from "mongoose";

const connectMongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string)
    } catch (error) {
        console.log('Something went wrong',error)
    }
}

export default connectMongoDB