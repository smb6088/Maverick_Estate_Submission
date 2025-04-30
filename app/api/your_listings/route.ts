import { NextResponse } from "next/server"
import retrieveDB from "@/lib/retrieveDB"
import Listing from "@/models/ListingModel"
import User from "@/models/UserModel"
export async function GET(req: Request) {
  try {
    await retrieveDB()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    const user = await User.findById(userId)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    const listings = await Listing.find({_id: { $in: user.your_Listing }})
    return NextResponse.json({ listings })
  } catch (error) {
    console.error("Error fetching your listings:", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
export async function DELETE(req: Request) {
  try {
    await retrieveDB()
    const body = await req.json()
    const { userId, listingId } = body
    if (!userId || !listingId) {
      return NextResponse.json({ error: "Missing userId or listingId" }, { status: 400 })
    }
    await Listing.findByIdAndDelete(listingId)
    await User.findByIdAndUpdate(userId, {$pull: { your_Listing: listingId }})
    return NextResponse.json({ message: "Listing deleted successfully" })
  } catch (error) {
    console.error("Error deleting listing:", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}