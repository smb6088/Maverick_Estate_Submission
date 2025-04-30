'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import { Component } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react"
import axios from "axios"
import { NotebookPen } from "lucide-react"
type UserDetails = {
  username: string | null
  email: string | null
  password: string | null
  profilePicture?: string | null
}
export default function UserProfile() {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: null,
    email: null,
    password: null,
    profilePicture: null,
  })
  const { data: session, status } = useSession()
  const [savedListings, setSavedListings] = useState([])
  const [editingField, setEditingField] = useState<keyof UserDetails | null>(null)
  const [editedValue, setEditedValue] = useState("")
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    retypeNewPassword: "",
  })
  const [yourListings, setYourListings] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchYourListings = async () => {
      if (session?.user?.id) {
        try {
          const res = await axios.get("/api/your_listings", {params: { userId: session.user.id }})
          setYourListings(res.data.listings)
        } catch (err) {
          console.error("Failed to fetch your listings:", err)
        }
      }
    }
    fetchYourListings()
  }, [session])

  useEffect(() => {
    setUserDetails((prev) => ({
      ...prev,
      // @ts-ignore
      username: session?.user?.username || prev.username,
      email: session?.user?.email || prev.email,
      // We don’t set password from session, normally you wouldn’t store it
      // profilePicture can remain local or come from session if you have that
    }))
  }, [session])

  useEffect(() => {
    const fetchSavedListings = async () => {
      //@ts-ignore
      if (session?.user?.id) {
        try {
          //@ts-ignore
          const res = await axios.get("/api/save_listing", { params: { userId: session.user.id }})
          setSavedListings(res.data.savedListings)
        } catch (err) {
          console.error("Failed to fetch saved listings:", err)
        }
      }
    }
    fetchSavedListings()
  }, [session])

  if (status === "loading") {
    return <p>Loading session...</p>
  }
  if (!session) {
    return <p>You need to log in!</p>
  }

  const handleEditField = (field: keyof UserDetails) => {
    setEditingField(field)
    setEditedValue(userDetails[field] || "")
    if (field === "password") {
      setPasswordFields({ currentPassword: "", newPassword: "", retypeNewPassword: "" })
    }
  }

  const handleSaveField = () => {
    if (editingField === "password") {
      if (passwordFields.newPassword !== passwordFields.retypeNewPassword) {
        alert("New passwords do not match.")
        return
      }
      if (passwordFields.currentPassword !== userDetails.password) {
        alert("Current password is incorrect.")
        return
      }
      setUserDetails({ ...userDetails, password: passwordFields.newPassword })
    } else if (editingField) {
      setUserDetails({ ...userDetails, [editingField]: editedValue })
    }
    setEditingField(null)
  }

  const handleCancelEdit = () => {
    setEditingField(null)
    setEditedValue("")
  }

  const handleRemoveListing = async (listingId: string) => {
    if (!session?.user?.id) return
  
    try {
      await axios.delete("/api/save_listing", { data: { userId: session.user.id, listingId}})
      setSavedListings((prev) => prev.filter((listing: any) => listing._id !== listingId))
    } catch (err) {
      console.error("Error removing listing:", err)
    }
  }

  const handleDeleteYourListing = async (listingId: string) => {

    if (!session?.user?.id) return
    try {
      await axios.delete("/api/your_listings", { data: { userId: session.user.id,listingId}})
      setYourListings((prev) => prev.filter((listing: any) => listing._id !== listingId))
    } catch (err) {
      console.error("Error deleting listing:", err)
    }
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex">
      <div className="w-1/4 bg-ultramarine-950 text-white flex flex-col items-center py-10 px-6">
        <h2 className="text-4xl font-bold mb-6">User Profile</h2>
        <div className="space-y-6 w-full">
          {Object.entries(userDetails).map(([key, value]) => (
            key !== "profilePicture" && (
              <div
                key={key}
                className="flex items-center justify-between border-b border-gray-500 pb-4"
              >
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-300">
                    {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </div>
                  {editingField === key ? (
                    <input
                      type="text"
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  ) : (
                    <div className="mt-1">
                      {key === "password"
                        ? "********"
                        : value || `You haven't added a ${key.replace(/([A-Z])/g, " $1").toLowerCase()} yet.`}
                    </div>
                  )}
                </div>
                {editingField === key ? (
                  <div className="flex items-center space-x-3 ml-4">
                    <button
                      onClick={handleSaveField}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-600  text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditField(key as keyof UserDetails)}
                    className="bg-ultramarine-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition ml-4"
                  >
                    Edit
                  </button>
                )}
              </div>
            )
          ))}
        </div>
      </div>
        <div className="w-3/4 flex flex-col px-16 py-12 bg-ultramarine-50">
          {savedListings.length > 0 && (
          <h3 className="text-2xl font-semibold text-gray-700 mb-8">Saved Listings</h3>)}
          {savedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
              <NotebookPen className="w-40 h-40 mb-2 text-black-rock-950 border-blue-300" />
              <p className="text-lg">No Saved listings to show</p>
              </div>
              ) : (
              <div className="flex flex-col gap-6">
                {savedListings.map((listing) => (
                  <div
                  key={listing._id}
                  onClick={() => router.push(`/map-dash/${listing._id}`)}
                  className="relative w-full bg-white rounded-lg shadow-md p-4 border border-gray-300 hover:shadow-lg hover:scale-[1.01] transition transform flex gap-4">
                    <button onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveListing(listing._id)}}
                      className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 transition">
                        &times;
                    </button>
              <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-md border">
                <img src={listing?.hiResImageLink || "/placeholder.png"}
                alt="Property" 
                className="w-full h-full object-cover"/>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-lg font-bold text-gray-800">{listing.address?.streetAddress}</h4>
                <p className="text-gray-600"> {listing.address?.city}, {listing.address?.state} </p>
                <p className="text-gray-600"> ${listing.price.toLocaleString()} - {listing.bedrooms} Beds, {listing.bathrooms} Baths </p>
                <p className="text-gray-600"> Listing Status: {listing.homeStatus?.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</p>
              </div>
            </div>))}
        </div>)}
        {yourListings.length > 0 && (
          <>
          <h3 className="text-2xl font-semibold text-gray-700 mt-12 mb-8">Your Listings</h3>
        <div className="flex flex-col gap-6">
          {yourListings.map((listing) => (
            <div
            key={listing._id}
            onClick={() => router.push(`/map-dash/${listing._id}`)}
            className="relative w-full bg-white rounded-lg shadow-md p-4 border border-gray-300 hover:shadow-lg hover:scale-[1.01] transition transform flex gap-4">
          <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-md border">
              <button onClick={(e) => {
                e.stopPropagation()
                handleDeleteYourListing(listing._id)}}
                className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 transition">
                &times;
              </button>
              <img
              src={listing?.hiResImageLink || "/placeholder.png"}
              alt="Property"
              className="w-full h-full object-cover"/>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-lg font-bold text-gray-800">{listing.address?.streetAddress}</h4>
            <p className="text-gray-600">{listing.address?.city}, {listing.address?.state}</p>
            <p className="text-gray-600"> ${listing.price.toLocaleString()} - {listing.bedrooms} Beds, {listing.bathrooms} Baths</p>
            <p className="text-gray-600"> Listing Status: {listing.homeStatus?.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</p>
          </div>
        </div>))}
        </div>
      </>)}
    </div>
  </div>
  </>
)}