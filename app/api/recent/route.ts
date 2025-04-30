import { NextResponse } from "next/server"
import mongoose from "mongoose"
import retrieveDB from "@/lib/retrieveDB"
import User from "@/models/UserModel"
import Listing from "@/models/ListingModel"

interface UserDoc {
  recent_listing: string[]
}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 })
    }
    await retrieveDB()
    const user = await User.findById(userId).lean() as UserDoc | null
    if (!user || !Array.isArray(user.recent_listing) || user.recent_listing.length === 0) {
      return NextResponse.json({ listings: [] }, { status: 200 })
    }
    const listingIds = user.recent_listing.map((id: string) => new mongoose.Types.ObjectId(id))
    let listings = await Listing.find({ _id: { $in: listingIds } }).lean()
    //@ts-ignore
    const listingsMap = new Map(listings.map(listing => [listing._id.toString(), listing]))
    //@ts-ignore
    listings = user.recent_listing.map((id: string) => listingsMap.get(id)).filter(Boolean)
    return NextResponse.json({ listings }, { status: 200 })
  } catch (error) {
    console.error("Error fetching recent listings:", error)
    return NextResponse.json({ error: "Failed to fetch recent listings", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}