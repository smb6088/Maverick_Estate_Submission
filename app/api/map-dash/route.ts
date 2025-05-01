import retrieveDB  from "@/lib/retrieveDB"
import mongoose from "mongoose"
import { NextResponse } from "next/server"
export async function GET(req:any) {
        const { searchParams } = new URL(req.url)
        const curr_page_num = parseInt(searchParams.get("page") || "1", 10)
        const limit_per_page = parseInt(searchParams.get("limit") || "10", 10)
        const skip_listings = (curr_page_num - 1) * limit_per_page
    try{
        await retrieveDB()
        const db = mongoose.connection.db
        if(db){
            const listingsCollection = db.collection("Listings")
            const projection = {_id: 1, price: 1, bedrooms: 1, bathrooms: 1, address: 1, latitude: 1, longitude: 1, hiResImageLink: 1}
            const searchQuery = searchParams.get("search") || ""
            const query = searchQuery ? {$or: [{ "address.zipcode": searchQuery },  { "address.streetAddress": { $regex: searchQuery, $options: "i"}}]} : {}
            // const searchQuery = searchParams.get("search") || ""
            const listings = await listingsCollection.find(query, {projection}).skip(skip_listings).limit(limit_per_page).toArray()
            const totalListings = await listingsCollection.countDocuments({})
            const totalPages = Math.ceil(totalListings / limit_per_page)
            //console.log("Retrieved listings", listings)
            return NextResponse.json({listings,totalPages,currentPage: curr_page_num,}, { status: 200 })
        }
    }
    catch(error){
        console.error("Error", error)
        return NextResponse.json({error:" Error"},{status: 500})
    }
}