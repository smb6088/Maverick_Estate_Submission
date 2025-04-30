import mongoose, { Schema, model, models, SchemaType } from "mongoose"
import ListingModel from "./ListingModel"
const userSchema = new mongoose.Schema({
    username: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    savedListings: { type: [String], default: [] },
    verified: { type: Boolean, default: true },
    recent_listing: {type: [String], default: []},
    your_Listing: { type: [String], default: [] },
})
const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User