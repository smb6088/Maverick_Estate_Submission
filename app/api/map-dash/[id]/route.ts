import retrieveDB from "@/lib/retrieveDB"
import mongoose from "mongoose"
import { NextResponse } from "next/server"
import User from "@/models/UserModel"
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await retrieveDB()
    const db = mongoose.connection.db
    if (db) {
      const listingsCollection = db.collection("Listings")
      const listing = await listingsCollection.findOne({ _id: new mongoose.Types.ObjectId(id) })
      if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 })
      }
      
      const zip = String(listing.zipcode)
      // console.log(zip)
      const crime_data = (await (await (db.collection("Crime").find({"Overall.Zipcode": zip})).toArray()))
      if (!crime_data){
        console.log("Crime data Null")
      }
      const traffic_data = await (await (db.collection("Traffic")).find({
        LATITUDE: { $gte: listing.latitude - 0.07,  $lte: listing.latitude + 0.07 },
        LONGITUDE: {  $gte: listing.longitude - 0.07, $lte: listing.longitude + 0.07}})).toArray()
      //console.log(traffic_data)
      const combined_data = { listing, crime: crime_data, traffic: traffic_data}
      // console.log("Retrieved listing:", combinedData)
      return NextResponse.json(combined_data, { status: 200 })
    }
    return NextResponse.json({ error: "DB fail" }, { status: 500 })
  } catch (error) {
    console.error("Error", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await retrieveDB()
    const body = await request.json()
    const { userId } = body
    if (!userId || !id) {
      return NextResponse.json({ error: "Missing userId or listing ID" }, { status: 400 })
    }
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    // console.log(user)
    const listingId = id.toString()
    const alreadySaved = (user.savedListings ?? []).includes(listingId)
    if (alreadySaved) {
      return NextResponse.json({ message: "Already saved" }, { status: 200 })
    }
    if (!Array.isArray(user.savedListings)) {
      user.savedListings = []
    }
    user.savedListings.push(listingId)
    await user.save()
    // console.log(user)

    return NextResponse.json({ message: "Listing saved successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params
    const { userId } = await req.json()

    await retrieveDB()
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    user.savedListings = user.savedListings.filter(
      (savedId: string) => savedId !== id
    )
    await user.save()
    return NextResponse.json({ message: "Listing removed" }, { status: 200 })
  } catch (error) {
    console.error("Error unsaving listing:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}