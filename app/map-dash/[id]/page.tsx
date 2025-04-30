"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { IListing } from "@/models/ListingModel"
import { motion } from "framer-motion"
import Loading from "@/app/components/ui/Loading"
import NoiseMap from "@/app/components/NoiseMap"
import Navbar from "@/app/components/Navbar"
import { MapPin, School, Car, House, Shield, BedDouble, Bath, Heart, X } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import "react-medium-image-zoom/dist/styles.css"
import ImageGallery from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css"
import axios from "axios"
import { useSession } from "next-auth/react"
import TrafficHeatmap from "@/app/components/TrafficMap"
interface ICrime {
  Overall: {
    Zipcode: string
    "Overall Crime Grade": string
    "Violent Crime Grade": string
    "Property Crime Grade": string
    "Other Crime Grade": string
    Fact: string
  }
}

interface TrafficDataPoint {
  TRFC_STATN_ID: string
  AADT_RPT_QTY: number
  LATITUDE: number
  LONGITUDE: number
  ON_ROAD: string
}

export default function ListingPage() {
  const { data: session } = useSession()
  const params = useParams()
  const id = params?.id
  const [isSaved, setIsSaved] = useState(false)
  const [data, setData] = useState<{ listing: IListing, crime: ICrime[], traffic: TrafficDataPoint[] } | null>( null)
  const [loading, setLoading] = useState(true)
  const [showGallery, setShowGallery] = useState(false)
  const [mapTab, setMapTab] = useState<"standard" | "noise" | "traffic">("traffic")
  
  const isScraped = () => {
    if (listing.zpid === null){
      return false
    }
    return true
  }

  const getGalleryImages = () => {
    console.log(data?.listing)
    if (!data?.listing?.originalPhotos && !data?.listing?.imageUrls) return []
    if (isScraped()){
      return data?.listing?.originalPhotos?.map((photo) => ({
      original: photo.mixedSources.jpeg[0].url,
      thumbnail: photo.mixedSources.jpeg[0].url,
    }))}
    if(isScraped() == false){
      return data?.listing?.imageUrls?.map((url) => ({
        original: url,
        thumbnail: url,
      }))
    }
  }

  const [noiseScore, setNoiseScore] = useState<number | null>(null)
  const [trafficScore, setTrafficScore] = useState<number | null>(null)
  const calculateOverallScore = () => {
    if (!crimeData || !trafficScore) return null
    const crimeGradeMap: { [key: string]: number } = {
    'A+': 5.0,
    'A': 4.7,
    'A-': 4.3,
    'B+': 4.0,
    'B': 3.7,
    'B-': 3.3,
    'C+': 3.0,
    'C': 2.7,
    'C-': 2.3,
    'D+': 2.0,
    'D': 1.7,
    'D-': 1.3,
    'F': 0.5
    }
  
  const crimeScore = crimeData?.Overall?.["Overall Crime Grade"] 
    ? crimeGradeMap[crimeData.Overall["Overall Crime Grade"]] || 3
    : 3
  const schoolRating = parseFloat(getAverageSchoolRating())
  const schoolScore = isNaN(schoolRating) ? 3 : (schoolRating / 2)
  const trafficScoreValue = trafficScore !== null ? trafficScore / 2 : 2.5
  
  const weights = {
    crime: 0.4,
    school: 0.4,
    traffic: 0.2
  }
  
  const weightedScore = ((crimeScore * weights.crime) +(schoolScore * weights.school) +(trafficScoreValue * weights.traffic))
  
  return Math.round((weightedScore / 5) * 100)
}

  useEffect(() => {
    if (id) {
      fetch(`/api/map-dash/${id}`)
        .then((res) => res.json())
        .then((fetchedData) => {
          setData(fetchedData)
          setLoading(false)
          console.log(fetchedData)
          let v = 1
          if (session?.user?.id && id && v == 1) {
            axios.post(`/api/recent/${id}`, {
              userId: session.user.id
            })
            .catch(error => {
              console.error('Error recording view:', error)
            })
            v=v+1
          }
          if (session?.user?.id && fetchedData?.listing?._id) {
            axios
              .get(`/api/save_listing?userId=${session.user.id}`)
              .then((res) => {
                const savedIds = res.data?.savedListings.map((l: any) => l._id) || []
                setIsSaved(savedIds.includes(fetchedData.listing._id))
              })
          }
        })
        .catch((error) => {
          console.error("Error fetching listing:", error)
          setLoading(false)
        })
    }
  }, [id, session])

  useEffect(() => { 
    if (data?.listing && trafficScore !== null) { 
      const overallScore = calculateOverallScore()
      if (overallScore !== null) {
        axios.post(`/api/overall/${id}`, { overallScore })
          .then(response => console.log("Score updated:", response.data))
          .catch(error => console.error("Update error:", error))
      }
    }
  }, [id, data, trafficScore])

  
  useEffect(() => {    
    if (
      (mapTab === "standard") &&
      data?.listing &&
      typeof window !== "undefined"
    ) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) return

      import("@googlemaps/js-api-loader").then(({ Loader }) => {
        const loader = new Loader({ apiKey, version: "weekly", libraries: ["marker", "places"] })

        loader.load().then(() => {
          const mapId = "standard-map"
          const mapContainer = document.getElementById(mapId)
          if (!mapContainer) return
          const map = new google.maps.Map(mapContainer, {
            center: { lat: data.listing.latitude, lng: data.listing.longitude, },
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
          })
          new google.maps.Marker({
            position: {
              lat: data.listing.latitude,
              lng: data.listing.longitude,
            },
            map: map,
            title: data.listing.streetAddress
          })
        })
      })
    }
  }, [mapTab, data])

  if (loading) return <Loading/>
  if (!data) return <div className="bg-ultramarine-200 text-black-rock-950">Listing not found</div>

  const { listing, crime } = data
  const crimeData = crime && crime.length > 0 ? crime[0] : null

  const getAverageSchoolRating = () => {
    if (isScraped()){
      const validSchools = listing.schools?.filter((school) => school.rating !== null)
      if (validSchools?.length === 0) return "N/A"
      const averageRating =
      //@ts-ignore  
      validSchools?.reduce((sum, school) => sum + school.rating, 0) /
      //@ts-ignore
      validSchools.length
      return averageRating.toFixed(1)
    }
    else{
      return "N/A"
    }
  }
  const handleSaveListing = async () => {
    if (!session?.user) return
  
    try {
      //@ts-ignore
      const res = await axios.post(`/api/map-dash/${id}`, { listing, userId: session.user.id})
      if (res.status === 200) {
        setIsSaved(true)
        console.log("Listing saved!")
      } else {
        console.warn("Failed to save listing:", res.data)
      }
    } catch (err) {
      console.error("Error saving listing:", err)
    }
  }
  
  const handleUnsaveListing = async () => {
    if (!session?.user) return
    try {
      //@ts-ignore
      const res = await axios.delete(`/api/map-dash/${id}`, {data: { userId: session.user.id }})
      if (res.status === 200) {
        setIsSaved(false)
        console.log("Listing unsaved!")
      } else {
        console.warn("Unsave failed", res.data)
      }
    } catch (err) {
      console.error("Error unsaving listing:", err)
    }
  }
    const imagesToShow = isScraped()
      ? listing.originalPhotos?.slice(0, 5).map(p => p.mixedSources.jpeg[0].url)
      : listing.imageUrls?.slice(0, 5)
  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-ultramarine-50">
      {showGallery && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            className="absolute top-10 right-4 z-50 bg-white p-2 rounded-full text-blue-950"
            onClick={() => setShowGallery(false)}
          >
            <X />
          </button>
          <div className="w-full h-full bg-ultramarine-50">
            <ImageGallery
              items={getGalleryImages()}
              showThumbnails={true}
              showFullscreenButton={false}
              showPlayButton={false}
              slideDuration={250}
              showIndex={true}
            />
          </div>
        </div>
      )}
      <motion.section
        className="bg-white border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-black-rock-950">
                {listing.streetAddress}
              </h1>
              <p className="text-black-rock-950 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {listing.address.city}, {listing.address.state}{" "}
                {listing.address.zipcode}
              </p>
            </div>
            <div className="flex gap-4">
              {session?.user && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={isSaved ? undefined : handleSaveListing}
                    disabled={isSaved}
                    className={`${
                      isSaved
                        ? "bg-red-500 text-white border-red-500 cursor-default"
                        : "hover:bg-ultramarine-950 bg-black-rock-950"
                    }`}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {isSaved ? "Saved" : "Save"}
                  </Button>

                  {isSaved && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-10 w-10 text-black-rock-950 hover:text-ultramarine-950 hover:text-xl"
                      onClick={handleUnsaveListing}
                    >
                      <X />
                    </Button>
                  )}
                </div>
              )}
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full text-white p-0"
              >
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
      <motion.section className="container mx-auto px-4 py-8">
        <div className="relative grid grid-cols-4 gap-4 h-[500px]">
          {imagesToShow?.map((imageUrl, index) => {
            const isMainPhoto = index === 0
            return (
              <div
                key={index}
                className={`${isMainPhoto ? "col-span-2 row-span-2" : ""}`}
              >
                <img
                  src={imageUrl}
                  alt={`Property photo ${index + 1}`}
                  className={`w-full h-full object-cover cursor-pointer ${
                    isMainPhoto
                      ? "rounded-l-xl"
                      : index === 3
                      ? "rounded-tr-xl"
                      : ""
                  }`}
                  onClick={() => setShowGallery(true)}
                />
              </div>)
          })}
        </div>
      </motion.section>

      
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card className="mb-8 text-black-rock-950 bg-ultramarine-200">
                <CardHeader>
                  <CardTitle>Property Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-black-rock-950">
                      <BedDouble className="w-5 h-5 text-black-rock-950" />
                      <span>{listing.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2 text-black-rock-950">
                      <Bath className="w-5 h-5 text-black-rock-950" />
                      <span>{listing.bathrooms} Bathrooms</span>
                    </div>
                  </div>
                  <p className="text-black-rock-950">{listing.description}</p>
                </CardContent>
              </Card>

             
              <Tabs defaultValue="neighborhood" className="w-full text-black-rock-950">
                <TabsList className="w-full justify-start">
                  <TabsTrigger className="hover:bg-ultramarine-950 rounded-md hover:text-white data-[state=active]:bg-black-rock-950 hover:rounded-md"value="neighborhood">Neighborhood</TabsTrigger>
                  <TabsTrigger className="hover:bg-ultramarine-950 rounded-md hover:text-white data-[state=active]:bg-black-rock-950 hover:rounded-md" value="schools">Schools</TabsTrigger>
                </TabsList>
                <TabsContent value="neighborhood">
                  <Card className="bg-ultramarine-200">
                    <CardHeader>
                      <CardTitle>Neighborhood Insights</CardTitle>
                      <CardDescription>Comprehensive data about the area</CardDescription>
                    </CardHeader>
                    <CardContent >
                      <div className="grid gap-4">
                        {[
                          {
                            icon: House,
                            title: "Overall Neighborhood Score",
                            value: `${calculateOverallScore()}/100`,
                            desc: "Combined score based on crime, schools and traffic",
                          },
                          {
                            icon: Shield,
                            title: "Crime Rating",
                            value: crimeData?.Overall?.["Overall Crime Grade"] || "N/A",
                            desc: crimeData?.Overall?.Fact || "No crime data available",
                          },
                          {
                            icon: School,
                            title: "School Rating",
                            value: `${getAverageSchoolRating()}/10`,
                            desc: `Average score based on ${
                              listing.schools?.filter((s) => s.rating).length
                            } nearby schools`,
                          },
                          {
                            icon: Car,
                            title: "Traffic Score",
                            value: `${trafficScore || "N/A"}/10`,
                            desc: "Traffic congestion rating based on AADT data",
                          },
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <item.icon className="w-8 h-8 text-primary" />
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-2xl font-bold my-1">{item.value}</p>
                              <p className="text-black-rock-950">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="schools">
                  <Card className="bg-ultramarine-200">
                    <CardHeader>
                      <CardTitle>Schools Information</CardTitle>
                      <CardDescription>Details about nearby schools</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {listing.schools?.map((school, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <School className="w-8 h-8 text-primary" />
                            <div>
                              <h3 className="font-semibold">{school.name}</h3>
                              <p className="text-2xl font-bold my-1">{school.rating}/10</p>
                              <p className="text-black-rock-950">
                                Distance: {school.distance} miles.
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          > 
            <Card className="top-4 bg-ultramarine-200 mb-4">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-black-rock-950">
                  ${listing.price.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="overflow-hidden border rounded-lg top-4 bg-ultramarine-200 mb-4">
             <CardHeader className="pb-2">
               <CardTitle className="text-xl font-bold text-black-rock-950">Map View</CardTitle>
               <Tabs value={mapTab} onValueChange={(v) => setMapTab(v as 'standard' | 'noise'| 'traffic')}>
                 <TabsList className="mt-2 text-black-rock-950">
                   <TabsTrigger className="hover:bg-ultramarine-950 rounded-md hover:text-white data-[state=active]:bg-black-rock-950 hover:rounded-md"value="traffic">Traffic View</TabsTrigger>
                   <TabsTrigger className="hover:bg-ultramarine-950 rounded-md hover:text-white data-[state=active]:bg-black-rock-950 hover:rounded-md"value="noise">Noise View</TabsTrigger>
                   <TabsTrigger className="hover:bg-ultramarine-950 rounded-md hover:text-white data-[state=active]:bg-black-rock-950 hover:rounded-md"value="standard">Standard View</TabsTrigger>
                 </TabsList>
               </Tabs>
             </CardHeader>
             <CardContent className="p-0 bg-white">
               <div style={{ height: "300px", width: "100%" }}>
                 <div className="rounded-lg shadow-lg overflow-hidden h-full w-full">
                   {mapTab === "noise" ? (
                     <NoiseMap
                       center={{ lat: listing.latitude, lng: listing.longitude }}
                       zoom={15}
                       onNoiseScoreCalculated={setNoiseScore}
                     />
                   )
                   : mapTab === "traffic" ? (
                    <TrafficHeatmap
                    center={{ lat: listing.latitude, lng: listing.longitude }}
                    zoom={15}
                    trafficData={data?.traffic || []}
                    onTrafficScoreCalculated={setTrafficScore}
                  />
                  ):
                   (
                     <div id="standard-map" className="w-full h-full" />
                   )}
                 </div>
               </div>
             </CardContent>
           </Card>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  )
}
