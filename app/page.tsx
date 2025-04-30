"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, School, Car, Shield } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import Navbar from "@/app/components/Navbar"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Home() {
  const router = useRouter()
  const { data: session } = useSession()

  const [listings, setListings] = useState<any[]>([])
  const [recentListings, setRecentListings] = useState<any[]>([])
  const carouselRef = useRef<HTMLDivElement>(null)
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({left: -320, behavior: 'smooth'})
    }
  }
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }
  useEffect(() => {
    const fetchListings = async () => {
      try {
        //@ts-ignore
        if (session?.user?.id) {
          //@ts-ignore
          const res = await fetch(`/api/recent?userId=${session.user.id}`)
          const data = await res.json()
          setRecentListings(data.listings || [])
        } else {
          const res = await fetch(`/api/map-dash?page=1&limit=10`)
          console.log("Listing getting baby!!!!!!!!")
          const data = await res.json()
          setListings(data.listings || [])
        }
      } catch (err) {
        console.error("Failed to fetch listings", err)
      }
    }
  fetchListings()
}, [])


  const handleSearch = () => {
    router.push('/map-dash')
  }
  return (
        <>
    <Navbar/>
    <div>
      <main className="min-h-screen">
      <section className="relative h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3" alt="Luxury Home" className="w-full h-full object-cover"/>
        </div>
        <div className="relative z-20 text-center text-ultramarine-50 max-w-4xl mx-auto px-4">
          <motion.h1 className="text-5xl md:text-7xl font-bold mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            Discover Your Perfect Home
          </motion.h1>
          <motion.p className="text-xl mb-8 text-ultramarine-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
            Make data-driven decisions with comprehensive neighborhood insights
          </motion.p>
          <motion.div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <Button size="lg" className=" justify-self-center ml-52 bg-primary hover:bg-primary/90 text-ultramarine-50 hover:underline text-lg" onClick={handleSearch}>
              Search Properties
            </Button>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl font-bold text-center mb-12 text-black-rock-950" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Make Informed Decisions
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{ icon: MapPin, title: "Flight Proximity", desc: "Know your distance to nearest airports" }, { icon: Car, title: "Traffic Data", desc: "Real-time traffic and commute insights" }, { icon: Shield, title: "Crime Statistics", desc: "Detailed neighborhood safety metrics" }, { icon: School, title: "School Ratings", desc: "Access to education quality data" }].map((feature, index) => (
              <motion.div key={index} className="p-6 rounded-xl bg-black-rock-50 shadow-lg hover:shadow-xl transition-shadow" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }}>
                <feature.icon className="w-12 h-12 mb-4 text-black-rock-950" />
                <h3 className="text-xl font-semibold mb-2 text-black-rock-950">{feature.title}</h3>
                <p className="text-black-rock-950">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-ultramarine-50">
      <div className="container mx-auto px-4">
        <motion.h2 className="text-3xl font-bold text-center mb-12 text-black-rock-950" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        {session?.user?.id ? "Recently Viewed" : "Featured Properties"}
        </motion.h2>
        <div className="flex items-center gap-4">
                <button onClick={scrollLeft} className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black-rock-950 hover:bg-gray-100 shadow-lg transition duration-200 shrink-0">
                  <ChevronLeft className="w-6 h-6" />
                </button>
            <div ref={carouselRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-4">
            {(session?.user?.id ? recentListings : listings).map((listing, index) => (
              <motion.div
                key={listing._id}
                className="min-w-[300px] max-w-[300px] bg-white shadow-lg rounded-xl overflow-hidden flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.01 }}
              >
                <Link href={`/map-dash/${listing._id}`}>
                  <img src = {listing.zpid === null ? listing.imageUrls?.[0] || "/placeholder.png": listing.hiResImageLink || listing.imageUrls?.[0] || "/placeholder.png"}          
                    alt={listing.address?.streetAddress || "Property"} className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-black-rock-950">
                      {listing.address?.streetAddress || "Unknown Address"}
                    </h3>
                    <p className="text-black-rock-950 mb-4">
                      {listing.address?.city}, {listing.address?.state} {listing.address?.zipcode}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary text-black-rock-950">
                        ${listing.price.toLocaleString()}
                      </span>
                      <div className="flex gap-4 text-black-rock-950">
                        <span>{listing.bedrooms} beds</span>
                        <span>{listing.bathrooms} baths</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <button onClick={scrollRight} className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black-rock-950 hover:bg-gray-100 shadow-lg transition duration-200 shrink-0">
              <ChevronRight className="w-6 h-6" />
            </button>
        </div>
      </div>
    </section>

    </main>
    <footer className="bg-black-rock-950 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-ultramarine-50">&copy; 2025 Maverick Estate.</p>
        </div>
      </div>
    </footer>
    </div>
    </>
  )
}