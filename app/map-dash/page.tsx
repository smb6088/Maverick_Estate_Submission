'use client'

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { Filter, Search } from 'lucide-react'
import { Button } from "@/app/components/ui/button"
import Loading from "@/app/components/ui/Loading"
import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { IListing } from '@/models/ListingModel'
import { debounce } from "lodash-es"
import Navbar from "@/app/components/Navbar"

export default function PropertyMap() {
  const [listings, setListings] = useState<IListing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const limit = 10
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  const [priceRange, setPriceRange] = useState<string>('')
  const [bedroomFilter, setBedroomFilter] = useState<string>('')
  const [bathroomFilter, setBathroomFilter] = useState<string>('')
  const [filteredListings, setFilteredListings] = useState<IListing[]>([])
  const [isFilterActive, setIsFilterActive] = useState(false)

  const fetchListings = (pageNum: number, query: string = "") => {
    setLoading(true)
    fetch(`/api/map-dash?page=${pageNum}&limit=${limit}&search=${query}`)
      .then(res => res.json())
      .then(data => {
        setListings(data.listings)
        setTotalPages(data.totalPages)
        setLoading(false)
        if (isFilterActive) {
          applyFilters(data.listings)
        }
      })
      .catch(error => {
        console.error('Fetch error:', error)
        setLoading(false)
      })
  }

  const debouncedSearch = debounce((query: any) => {
    setDebouncedSearchQuery(query)
  }, 2000)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const query = event.target.value
    setSearchQuery(query)
    debouncedSearch(query)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }
  
  const applyFilters = (listingsToFilter = listings) => {
    if (!priceRange && !bedroomFilter && !bathroomFilter) {
      setFilteredListings([])
      setIsFilterActive(false)
      return
    }
  
  setIsFilterActive(true)

  const filtered = listingsToFilter.filter(listing => {
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number)
        if (listing.price < minPrice || listing.price > maxPrice) {
          return false
        }
      }

      if (bedroomFilter && listing.bedrooms < parseInt(bedroomFilter)) {
        return false
      }

      if (bathroomFilter && listing.bathrooms < parseInt(bathroomFilter)) {
        return false
      }

      return true
    })

    setFilteredListings(filtered)
  }

  const resetFilters = () => {
    setPriceRange('')
    setBedroomFilter('')
    setBathroomFilter('')
    setFilteredListings([])
    setIsFilterActive(false)
  }

  useEffect(() => {
    fetchListings(page, debouncedSearchQuery)
  }, [page, debouncedSearchQuery])

  if (loading) return <Loading/>

  const displayListings = isFilterActive ? filteredListings : listings

  return (
    <>
    <Navbar/>
    <div className="flex h-screen w-full overflow-hidden">
      <div className="h-full w-[500px] overflow-y-auto bg-ultramarine-50 shadow-lg z-10">
        {isFilterActive && (
          <div className="w-full text-center py-2 bg-ultramarine-50 text-black-rock-950 font-medium">
            Showing {filteredListings.length} of {listings.length} properties
          </div>
        )}
        <div className="p-4">
          <PaginationControls page={page} totalPages={totalPages} onPageChange={handlePageChange} />

          {displayListings.length > 0 ? (
            <div className="space-y-4">
              {displayListings.map((listing, index) => (
                <motion.div
                  id={listing._id}
                  key={listing._id}
                  className={`rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow ${
                    selectedListingId === listing._id ? 'border-2 border-black-rock-950 bg-blue-50' : 'border border-gray-200'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.01 }}
                  onClick={() => setSelectedListingId(listing._id)}
                >
                  <Link href={`http://localhost:3000/map-dash/${listing._id}`}>
                    <img src={listing.zpid!==null ? listing.hiResImageLink ?? undefined : listing.imageUrls?.[0]} alt="image" className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 text-black-rock-950">${listing.price.toLocaleString()}</h3>
                      <p className="text-black-rock-950 mb-2 text-sm">
                        {listing.address.streetAddress}, {listing.address.city}, {listing.address.state}, {listing.address.zipcode}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 text-black-rock-950">
                          <span>{listing.bedrooms} Beds</span>
                          <span>{listing.bathrooms} Bath</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-xl font-medium">No properties match your filters</p>
              {isFilterActive && (
                <button
                  onClick={resetFilters}
                  className="mt-4 text-black-rock-950 hover:text-ultramarine-950 font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          <PaginationControls page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute top-2 left-2 z-10 bg-ultramarine-50 rounded-lg shadow-lg p-4 w-[400px]">
          <div className="relative w-full mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="relative flex-1 min-w-[120px]">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-950"
              >
                <option value="">Price</option>
                <option value="0-250000">$0 - $250,000</option>
                <option value="250001-500000">$250,000 - $500,000</option>
                <option value="500001-750000">$500,000 - $750,000</option>
                <option value="750001-1000000">$750,000 - $1,000,000</option>
                <option value="1000000-2000000">$1,000,000 - $2,000,000</option>
                <option value="2000000-4000000">$2,000,000 - $4,000,000</option>
                <option value="4000000-999999999">$4,000,000+</option>
              </select>
            </div>
            <div className="relative flex-1 min-w-[100px]">
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black-rock-950"
              >
                <option value="">Beds</option>
                <option value="1">1+ Bed</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
                <option className= "hover: bg-ultramarine-950"value="5">5+ Beds</option>
              </select>
            </div>
            <div className="relative flex-1 min-w-[100px]">
              <select
                value={bathroomFilter}
                onChange={(e) => setBathroomFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-950"
              >
                <option value="">Baths</option>
                <option value="1">1+ Bath</option>
                <option value="2">2+ Baths</option>
                <option value="3">3+ Baths</option>
                <option value="4">4+ Baths</option>
                <option value="5">5+ Baths</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => applyFilters()}
              className="flex-1 bg-black-rock-950 hover:bg-ultramarine-950 text-white px-4 py-2 rounded-md shadow-sm flex items-center justify-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </button>
            <button
              type="button"
              onClick={resetFilters}
              disabled={!isFilterActive}
              className={`flex-1 px-4 py-2 rounded-md shadow-sm ${
                isFilterActive 
                  ? "bg-black-rock-300 hover:bg-ultramarine-950 text-black hover:text-white" 
                  : "bg-black-rock-50 text-black cursor-not-allowed"
              }`}
            >
              Reset
            </button>
          </div>
        </div>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <Map
            className="h-full w-full"
            defaultCenter={{ lat: 32.705002, lng: -97.122780 }}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI
          >
            {displayListings.map((listing) => (
              <Marker
                key={listing._id}
                position={{ lat: listing.latitude, lng: listing.longitude }}
                onClick={() => {
                  setSelectedListingId(listing._id)
                  document.getElementById(listing._id)?.scrollIntoView({ behavior: 'smooth', block: 'center'})
                }}
              />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
    </>
  )
}

const PaginationControls = ({ page, totalPages, onPageChange }: { page: number, totalPages: number, onPageChange: (newPage: number) => void }) => {
  const visiblePages = Array.from({ length: Math.min(7, totalPages) }, (_, i) => i + 1)

  return (
    <div className="flex justify-center my-4">
      <Button variant="ghost" disabled={page === 1} onClick={() => onPageChange(page - 1)} className="text-black">
        {"<"}
      </Button>
      {visiblePages.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant="ghost"
          onClick={() => onPageChange(pageNumber)}
          className={`mx-1 w-8 h-8 rounded-full text-black ${
            page === pageNumber ? "border border-blue-400" : "border border-transparent"
          }`}
        >
          {pageNumber}
        </Button>
      ))}
      <Button variant="ghost" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className="text-black">
        {">"}
      </Button>
    </div>
  )
}
