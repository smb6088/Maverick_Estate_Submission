import { Loader2 } from "lucide-react"
import React from "react"

const Loading = () => {
  return (
    <div className="fixed inset-0 flex gap-2 items-center justify-center bg-ultramarine-50">
      <Loader2 className="w-6 h-6 animate-spin text-black-rock-950" />
      <span className="text-sm font-medium text-primary-700 text-black-rock-950">Loading...</span>
    </div>
  )
}

export default Loading