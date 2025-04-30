import retrieveDB from "@/lib/retrieveDB"
import User from "@/models/UserModel"
import bcrypt from 'bcrypt'
import { NextResponse} from "next/server"
export async function POST(req: any){
    try{
        retrieveDB()
        const body = await req.json()
        const user_from_db = await User.findOne({email: body.email})
        if (!user_from_db){
            return NextResponse.json({error: "Account does not exist"})
        }
        if (!(await bcrypt.compare(body.password, user_from_db.password))){
            return NextResponse.json({error: "Incorrect Password"})
        }
        return NextResponse.json({message: "Login Successful"})
    }
    catch(error){
        return NextResponse.json({error: "Server Error..."})
    }
}
