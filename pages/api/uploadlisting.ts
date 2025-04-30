import { IncomingForm } from 'formidable'
import fs from 'fs'
import path from 'path'
import ListingModel from '@/models/ListingModel'
import retrieveDB from '@/lib/retrieveDB'
import User from "@/models/UserModel"

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDir = path.join(process.cwd(), '/public/uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const parseForm = (req: any): Promise<{ fields: any, files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      multiples: true,
      filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
    })

    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}


export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    await retrieveDB()

    const { fields, files } = await parseForm(req)
    const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images]
    const imageUrls = uploadedFiles.map((file: any) =>
      file.newFilename ? `/uploads/${file.newFilename}` : `/uploads/${path.basename(file.filepath)}`
    )
    console.log(fields)
    const {
      fullAddress,
      streetNumber,
      street,
      zip,
      city,
      state,
      latitude,
      longitude,
      propStatus,
      propType,
      apt,
      price,
      bed,
      bath,
      room,
      sqft,
      floor,
      remark,
      avail,
      availDate,
      description,
    } = fields
    const normalizedData = {
      zpid: null,
      city: city?.[0] || '',
      state: state?.[0] || '',
      address: {
        streetAddress: streetNumber?.[0] + " " + street?.[0],
        city: city?.[0] || '',
        state: state?.[0] || '',
        zipcode: zip?.[0] || '',
      },
      homeStatus: propStatus?.[0] || '',
      price: parseFloat(price?.[0] || '0'),
      zipcode: zip?.[0] || '',
      streetAddress: streetNumber?.[0] + " " +street?.[0],
      county: null,
      bedrooms: parseInt(bed?.[0] || '0'),
      bathrooms: parseInt(bath?.[0] || '0'),
      schools: null,
      description: description?.[0] || '',
      latitude: parseFloat(latitude?.[0] || '0'),
      longitude: parseFloat(longitude?.[0] || '0'),
      hiResImageLink: imageUrls.length > 0 ? imageUrls[0] : null,
      photoCount: imageUrls.length,
      originalPhotos: null,
      overallScore: null
    }
    console.log(normalizedData)
    const new_listing = new ListingModel({...normalizedData, imageUrls})
    await new_listing.save()
    const userId = fields.userId?.[0]
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: { your_Listing: new_listing._id.toString() }
      })
    }
    return res.status(200).json({ message: 'Upload complete', imageUrls })
  } catch (err: any) {
    console.error('Error during upload:', err)
    return res.status(500).json({ error: err.message })
  }
}