
import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";



export async function main() {
        await mongoose.connect(`${process.env.DBURL}/Chat-App-GS`);
        console.log("Connect ot DB")
}