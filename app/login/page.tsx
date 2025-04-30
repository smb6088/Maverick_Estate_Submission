"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  const result = await signIn("credentials", {
      redirect: false,        
      email,
      password,
    })

    if (result?.ok) {
      window.location.href = "/"
    } else {
      setError(result?.error || "Something went wrong")
    }
  }

  return (
    <div className="bg-ultramarine-50 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-[1100px] h-[600px] flex border border-gray-300">
        <div className="w-1/3 flex flex-col justify-center items-center p-8 z-10 bg-ultramarine-200 rounded-xl">
          <h2 className="text-4xl font-medium text-black-rock-950 mb-6">Login</h2>
          {error && <p className="text-red-600">{error}</p>}
          <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black-rock-950 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-4 h-12 rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black-rock-950 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black-rock-950 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 p-4 h-12 rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black-rock-950 transition-all"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="w-5 h- text-black-rock-950" /> : <Eye className="w-5 h-5 text-black-rock-950" />}
              </span>
            </div>
            <div className="text-right">
              <a href="/register" className="text-sm text-black-rock-950 hover:underline">
                Don&apos;t have an account? Register
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-black-rock-950 text-white py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-105 hover:bg-ultramarine-950 transition transform duration-300"
            >
              Login
            </button>
          </form>

        </div>
        <div className="w-2/3 bg-[#ffffff] text-white flex justify-center items-center overflow-hidden rounded-xl">
          <Image src="/real_estate_logo.png" alt="description" width={500} height={300} />
          <div className="absolute inset-0 bg-black opacity-5"></div>
        </div>
      </div>
    </div>
  )
}