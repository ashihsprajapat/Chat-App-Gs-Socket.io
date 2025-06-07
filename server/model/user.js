
import mongoose,{model,Schema} from "mongoose";

const userSchema= new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true, minlength:5},
    profilePic:{type:String, default:""},
    bio:{type:String}
}, {timestamps:true})

export const User= model("User", userSchema);