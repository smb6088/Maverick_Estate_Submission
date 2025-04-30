import { NextResponse } from "next/server"
import retrieveDB from "@/lib/retrieveDB"
import mongoose from "mongoose"
import User from "@/models/UserModel"

export async function GET(req: Request) {
  try {
    console.log("In save listing API")
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }
    await retrieveDB()
    const db = mongoose.connection.db
    if (!db){
        return NextResponse.json({error: "Db error"}, {status:400})
    }
    const user = await User.findById(userId)
    if (!user || !Array.isArray(user.savedListings)) {
      return NextResponse.json({ savedListings: [] })
    }
    console.log('Hello')
    const listingsCollection = db.collection("Listings")
    const savedListings = []
    for (const id of user.savedListings) {
      try {
        const listing = await listingsCollection.findOne({ _id: new mongoose.Types.ObjectId(id) })
        if (listing) savedListings.push(listing)
      } catch (err) {
        console.warn(`Invalid ObjectId: ${id}`)
        continue
      }
    }
    console.log(savedListings)
    return NextResponse.json({ savedListings })
  } catch (err) {
    console.error("Error fetching saved listings:", err)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { userId, listingId } = body
    if (!userId || !listingId) {
      return NextResponse.json({ error: "Missing userId or listingId" }, { status: 400 })
    }
    await retrieveDB()
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    user.savedListings = user.savedListings.filter((id: string) => id !== listingId)
    await user.save()
    return NextResponse.json({ message: "Listing unsaved successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error unsaving listing:", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}