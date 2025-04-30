import{ Schema, model, models } from 'mongoose'

export interface IListing {
  zpid: number
  city: string
  state: string
  address: {
    streetAddress: string
    city: string
    state: string
    zipcode: string
  }
  apt?: string | null
  homeStatus: string
  price: number
  zipcode: string
  streetAddress: string
  county?: string | null
  bedrooms: number
  bathrooms: number
  schools?: Array<{
    distance?: number | null
    name: string
    rating: number
    level?: string | null
  }> | null
  description: string
  latitude: number
  longitude: number
  hiResImageLink?: string | null
  photoCount: number
  originalPhotos?: Array<{
    caption: string
    mixedSources: {
      jpeg: Array<{
        url: string
        width: number
      }>
    }
  }> | null
  overallScore? : number | null
  imageUrls?: Array<string>,
}

const ListingSchema = new Schema<IListing>({
  zpid: { type: Number, },
  city: { type: String, required: true },
  state: { type: String, required: true },
  apt: {type: String, default: null},
  homeStatus: { type: String, required: true },
  address: {
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
  },
  zipcode: { type: String, required: true },
  streetAddress: { type: String, required: true },
  county: { type: String, default: null },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  schools: [{
      distance:{type:Number ,default:null},
      name:{type:String ,required:true},
      rating:{type:Number },
      level:{type:String ,default:null}
   }],
  description: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required:true },
  hiResImageLink:{type:String , default: null},
photoCount:{type:Number ,required:true},
originalPhotos: [{
  caption: { type: String },
  mixedSources: {
    jpeg: [{
      url: { type: String },
      width: { type: Number },
    }],
  },
}],
overallScore: {type: Number, default: null},
imageUrls: [{ type: String }],
},
{
  collection: 'Listings'
})

const ListingModel = models.Listing || model<IListing>('Listing', ListingSchema)
export default ListingModel
