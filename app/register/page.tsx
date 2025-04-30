'use client'
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
export default function Register() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (password !== password2) {
      setPasswordMismatch('Passwords do not match')
      return
    }
    try {
      const rep = await axios.post('/api/register', { username, email, password })
      console.log(rep.data)
      router.push("/login")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="bg-ultramarine-50 min-h-screen flex justify-center items-center ">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-[1100px] h-[600px] flex border border-gray-300">
        <div className="w-2/3 bg-[#4C5C84] text-white flex justify-center items-center overflow-hidden">
          <img
            src="/real_estate_logo.png"
            alt="Real Estate Illustration"
            className="w-full h-full object-cover scale-103"
          />
          <div className="absolute inset-0 bg-black opacity-5"></div>
        </div>
        <div className="w-1/3 flex flex-col justify-center items-center p-8 z-10 bg-ultramarine-200 rounded-xl">
          <h2 className="text-4xl font-medium text-black-rock-950 mb-6">Registration</h2>
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-black-rock-950 w-5 h-5" />
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 p-4 h-12 rounded-lg border border-gray-300 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black-rock-950 transition-all"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black-rock-950 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-4 h-12 rounded-lg border border-gray-300 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black-rock-950 transition-all"
              />
            </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black-rock-950 w-5 h-5 " />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 p-4 h-12 rounded-lg border border-gray-300 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black-rock-950 transition-all"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-black-rock-950" /> : <Eye className="w-5 h-5 text-black-rock-950" />}
                </span>
              </div>
              <div className="relative ">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black-rock-950 w-5 h-5" />
                <input
                  type={showPassword2 ? "text" : "password"}
                  placeholder="Re-enter Password"
                  onChange={(e) => setPassword2(e.target.value)}
                  className={`w-full pl-10 pr-10 p-4 h-12 rounded-lg border  shadow-sm text-black focus:outline-none transition-all ${
                    passwordMismatch
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-black-rock-950'
                  }`}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword2((prev) => !prev)}
                >
                  {showPassword2 ? <EyeOff className="w-5 h-5 text-black-rock-950" /> : <Eye className="w-5 h-5 text-black-rock-950" />}
                </span>
                {passwordMismatch && (
                  <p className="text-sm text-red-500 mt-1 ml-1">{passwordMismatch}</p>
                )}
              </div>
            <div className="text-right">
              <a href="/login" className="text-sm text-black-rock-950 hover:underline">
                Have an account? Login instead
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-black-rock-950 text-white py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-105 hover:bg-ultramarine-950 hover:text-white transition transform duration-300"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}