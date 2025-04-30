"use client"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Avatar } from "@radix-ui/react-avatar"
import { User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Loading from "@/app/components/ui/Loading"

const Navbar: React.FC = () => {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const { data: session, status } = useSession()
  // if (session){
  //   setLoggedIn(true)
  // }
  const handleProfileClick = () => {
    router.push("/user_profile")
  }

  const handleSignIn = () => {
    router.push("/login")
  }

  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/" })
  }
  if (status === "loading") {
    return <Loading/>
  }

  return (
    <nav className="w-full h-16 px-4 bg-white border-b flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-black-rock-950 font-semibold hover:underline">
          HomePage
        </Link>
        <Link
          href="/map-dash"
          className="text-black-rock-950 font-semibold hover:underline"
        >
          Search for Property
        </Link>
        <Link
          href="/uploadlisting"
          className="text-black-rock-950 font-semibold hover:underline"
        >
          List a Property
        </Link>
      </div>
            <div
        className="
          absolute 
          left-1/2 
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
        "
      >
      </div>
      <div className="flex items-center gap-4">
        <div
          className="cursor-pointer rounded-full p-1 hover:bg-gray-100"
          onClick={handleProfileClick}
        >
           {session ? (
          <Avatar className="h-8 w-8">
            <User className="h-5 w-5 text-gray-600" />
          </Avatar>): (<></>)}
        </div>

        {session ? (
          <Button className= "bg-black-rock-950 hover:bg-ultramarine-950"variant="outline" onClick={handleLogOut}>
            Log Out
          </Button>
        ) : (
          <Button className= "bg-black-rock-950 hover:bg-ultramarine-950"variant="outline" onClick={handleSignIn}>
            Sign In
          </Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
