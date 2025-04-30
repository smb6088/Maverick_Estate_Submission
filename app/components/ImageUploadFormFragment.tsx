"use client"
import { useEffect, useState } from "react"
type detImageFragment={
    images: File[]
}
export function ImageUploadFormFragment({images, updateFragments}:{images: File[], updateFragments:(fields: Partial<detImageFragment>)=>void}){
    const [image_arr, setImage_Arr] = useState<File[]>(images)
    const handleUploadChange = (e: any) => {
        const images = Array.from(e.target.files as File[])
        if (images){
            setImage_Arr((prev) => [...prev, ...images])
    
        }
    }
    const handleRemoval = (e: any, index: any) =>{
        e.preventDefault()
        setImage_Arr((prev: any)=>{
            const newImgArr = prev.filter((file: any, currentIndex: any)=>{
                return currentIndex !== index
            })
            return newImgArr
        })
    }
    useEffect(()=>{updateFragments({images: image_arr})}, [image_arr])
    return(
        <div className="mt-10 -mb-6 w-full max-h-[100vh] overflow-y-auto">
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (Do not exceed 50MB)</p>
            </div>
            
            </label>
            <input id="dropzone-file" type="file" onChange={handleUploadChange} multiple className="hidden" />
        </div> 
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {image_arr.map((im,index) => { const img_prev = URL.createObjectURL(im)
                return(
                    <div key={index} className="relative">
                        <img src={img_prev} className="relative h-auto max-w-full rounded-lg shadow-lg"/>
                        <button
                            onClick={(e) => handleRemoval(e, index)}
                            className="w-8 h-8 absolute top-1 right-1 bg-slate-50/30 rounded-sm p-1 text-red-700 hover:text-red-600 hover:bg-opacity-100 transition"
                            
                            >
                            {"x"}
                        </button>
                    </div>
                )
            })}
        </div>
        </div>
    )
}