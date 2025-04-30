import retrieveDB from "@/lib/retrieveDB";
import User from "@/models/UserModel";
import bcrypt from 'bcrypt'
import { NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
export async function POST(req: any){
    try{
        retrieveDB()
        const body = await req.json()
        if (await User.findOne({email: body.email})){
            return NextResponse.json({error: "Account already exists for this email"})
        }
        const user = new User({username: body.username, email: body.email, password: await bcrypt.hash(body.password, 12)})
        await user.save()
        console.log("User registered:", user.email)
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: "1d" })
        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify?token=${token}`
        await transporter.sendMail({
            from: `"Maverick Estate" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Verify your email",
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your account.</p>`,
          }).then(() => console.log("Verification email sent")).catch(err => console.error("Email failed:", err))
            console.log("email: ", user.email)
            console.log("link: ", verificationLink)
        return NextResponse.json({message: "Registration sucessful. Please verify your email."})
    }
    catch(error){
        return NextResponse.json({error: "Error"})
    }
}