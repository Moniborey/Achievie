import mongoose, {Schema} from "mongoose";

const taskSchema = new Schema(
    {
        userID: String,
        task: {
            type: String,
            require: true,
        },
        priority:{
            type: String,
            require: true,
            default:'P4'
        },
        isChecked: {
            type: Boolean,
            require: true,
            default: false
        },
        description: String,
        dueDate: Date,
        list: {
            type: Schema.Types.ObjectId,
            ref:'List'
        }
    },
    {
        timestamps:true
    }
)

const Task = mongoose.models.Task || mongoose.model('Task',taskSchema)

export default Task