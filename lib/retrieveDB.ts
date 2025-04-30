import mongoose from "mongoose"
export default retrieveDB

let established_conn = false
async function retrieveDB(){
    if (established_conn){
        console.log("Connection to DB already established")
        return
    }
    try{
        const rdb = await mongoose.connect(process.env.MONGO_URI || '', {})
        established_conn = true
        console.log("Connected to DB")
    }
    catch(error){
        console.log("Failed DB connection", error)
        established_conn = false
        process.exit(1)
    }
}
