import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        userID: String,
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require:true,
        },
        password: {
            type: String,
            require:true,
        },
        image: {
            type: String,
            default: '/icons8-user-100.png'
        },
        lists:[{type:Schema.Types.ObjectId,ref:'List'}],
        tasks:[{type:Schema.Types.ObjectId,ref:'Task'}]
    },
    {
        timestamps: true
    }
)

const User = mongoose.models.User || mongoose.model('User',userSchema)

export default User