import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/UserModel"
import retrieveDB from "@/lib/retrieveDB"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) return NextResponse.json({ error: "Token missing" }, { status: 400 })

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    const email = decoded.email
    await retrieveDB()
    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    if (user.verified) {
      return NextResponse.json({ message: "Already verified" })
    }
    user.verified = true
    await user.save()
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
  }
}