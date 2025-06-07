

import mongoose, { model, Schema } from "mongoose";
import { User } from "./user.js";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    reciever: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    text: { type: String },
    image: { type: String },
    seen: { type: Boolean, default: false },


}, { timestamps: true })

export const Message = model("Message", messageSchema);