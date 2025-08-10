
import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 5 },
    profilePic: { type: String, default: "" },
    bio: { type: String },
    requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    connections: {
        type: Map,
        of: {
            type: String // or Number
        }
    }
}, { timestamps: true })

export const User = model("User", userSchema);