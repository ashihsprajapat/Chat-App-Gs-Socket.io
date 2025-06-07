

import mongoose, { model, Schema } from "mongoose";
import { User } from "./user.js";

const messageSchema = new Schema({
    sender: {
        type: Schema.ObjectId,
        ref:User,
        required: true,

    },
    reciver: {
        type: Schema.ObjectId,
        ref:User,
        required: true,
    },
   

    
}, {timestamps:true})

export const Message= model("Message", messageSchema);