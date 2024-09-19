import mongoose, {Schema} from "mongoose";

const listSchema = new Schema(
    {
        userID: String,
        name: String,
        color: String,
        tasks:[{type:Schema.Types.ObjectId,ref: 'Task'}]
    },
    {
        timestamps:true,
    }
)

const List = mongoose.models.List || mongoose.model('List',listSchema)

export default List