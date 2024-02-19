import mongoose, { Schema, SchemaTypeOptions } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema= new Schema({
content:{
    type:String,
    required:true},

    video:{
        type:Schema.Types.ObjectId,
        ref:"video"
    },
    owner:{
     type:Schema.Types.ObjectId,
     ref:"User"
    }

}, {timestamps:true
})

//pluging provide a avilablity for kha se start kar ke kha tak comment dene hai
videoSchema.pluging(mongooseAggregatePaginate)
export const comment =mongoose.model("Comment", commentSchema)