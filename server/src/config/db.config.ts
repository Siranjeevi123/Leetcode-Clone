import mongoose from "mongoose";

export default async function main(){
    let uri = process.env.DB_CONNECT_STRING;
    // console.log(uri);
    if(!uri) throw new Error("DB_CONNECT_STRING not set");
    try{
        await mongoose.connect(uri);
    }catch(error){
        console.error("MongoDB connection failed:", error);
    }
}

