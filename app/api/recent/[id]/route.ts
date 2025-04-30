import retrieveDB from "@/lib/retrieveDB"
import { NextResponse } from "next/server"
import mongoose from "mongoose"
import User from "@/models/UserModel"

export async function POST(request: Request, context: { params: Promise<{id: string}> }) {
  try {
    const {id: listingId} = await context.params
    const body = await request.json()
    const { userId } = body
    if (!userId) {
      return NextResponse.json({error: "Missing user"}, { status: 400 })
    }
    if (!listingId) {
      return NextResponse.json({error: "Missing listing" }, {status: 400 })
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({error: "Invalid user ID format" }, { status: 400 })
    }
    await retrieveDB()
    const user = await User.findById(userId, { recent_listing: 1 }).lean()
    if (!user) {
      return NextResponse.json({message: "User not found"}, {status: 404 })
    }
    //@ts-ignore
    if (user.recent_listing && user.recent_listing[user.recent_listing.length - 1] === listingId) {
      return NextResponse.json({message: "Listing already the most recent", success: true}, {status: 200})
    }
    await User.updateOne({_id: userId}, {$pull: {recent_listing: listingId}})
    await User.updateOne({ _id: userId },{$push: {recent_listing: {$each: [listingId], $slice: -10}}})

    return NextResponse.json({message: "Listing added to recent views successfully", success: true}, {status: 200})

  } catch (error) {
    console.error("Error adding recent listing:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({error: "Failed to add recent listing", details: errorMessage}, {status: 500})
  }
}