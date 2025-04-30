"use client"
import axios from 'axios'
import Navbar from "@/app/components/Navbar"
import { useState, FormEvent } from "react"
import { motion } from "framer-motion"
import { hookUploadForm } from "../components/HookUploadForm"
import {House} from "lucide-react"
import { AddrUploadFormFragment } from "../components/AddrUploadFormFragment"
import { DetailsUploadFormFragment } from "../components/DetailsUploadFormFragment"
import { ImageUploadFormFragment } from "../components/ImageUploadFormFragment"
import { ReviewUploadFormFragment } from "../components/ReviewUploadFormFragment"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
type FieldData = { fullAddress: string, streetNumber: string, street: string, zip: string, city: string, state: string,
  latitude: string, longitude: string, propStatus: string, propType: string, apt: string, price: string, bed: string, bath:string,
    room:string, sqft: string, floor: string, remark: string, avail:string, availDate: string, description: string, images: File[]}
const initial_fields: FieldData = { fullAddress: "", streetNumber: "", street:"", zip:"", city:"", state:"",
  latitude: "", longitude: "", propStatus: "", propType: "", apt: "", price: "", bed: "", bath: "",
    room:"", sqft: "", floor: "", remark: "", avail: "", availDate: "", description: "", images: []}
export default function UploadPage(){
    const [data, setData] = useState(initial_fields)
    function updateFragments(partialFields: Partial<FieldData>){
      setData(prev => { 
        return {...prev, ...partialFields}
      })
    }
    const { data: session } = useSession()
    const router = useRouter()
    const { formFragments, currIdx, fragment, prevFragment, nextFragment } = hookUploadForm(
      [<AddrUploadFormFragment {...data} updateFragments={updateFragments}/>
      , <DetailsUploadFormFragment {...data} updateFragments={updateFragments}/>, 
      <ImageUploadFormFragment {...data} updateFragments={updateFragments}/>, <ReviewUploadFormFragment {...data} updateFragments={updateFragments}/>
    ])
    const fragments = ["Looking Up Address", "Property Details", "Images Upload", "Review"]
    const percent = ((currIdx+1)/fragments.length) * 100
    async function formSubmit(e: FormEvent){
      e.preventDefault()
      if (currIdx < formFragments.length - 1){
        nextFragment()
      }
      else{
        console.log('HELLO')
        const formData = new FormData()
        for (const [key, value] of Object.entries(data)) {
          if (key !== 'images' && typeof value === 'string') {
            formData.append(key, value)
          }
        }
        data.images.forEach((file) => {
          formData.append('images', file)
        });
        if (session?.user?.id) {

          formData.append("userId", session.user.id)

        } else {

          console.warn("No user session available — userId not appended.")

        }
        try {
          const res = await axios.post('/api/uploadlisting', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          console.log('Form submitted successfully:', res.data)
          router.push('/user_profile')
        } catch (err) {
          console.error('Submission failed:', err)
        }
      }
    }
    return(
        <>
        <Navbar/>
        <main className="min-h-screen bg-blue-950">
                  <motion.section className="bg-slate-50 border-b" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="container mx-auto px-0 py-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h1 className="text-3xl font-bold mb-2 text-blue-950">
                            {"Upload Your Listing"}
                          </h1>
                          <p className="text-blue-950 flex items-center gap-2">
                            <House className="w-4 h-4" /> 
                            {"Got something to sell? Let's sell it!"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                  <form onSubmit={formSubmit}>
                    <motion.div className={currIdx===0 ? "rounded-lg shadow-lg w-auto mx-10 my-10 h-[70vh] bg-slate-50/95 flex flex-col justify-center items-center px-16 py-16":"rounded-lg shadow-lg w-auto mx-10 my-10 h-[120vh] bg-slate-50/95 flex flex-col justify-center items-center px-16 py-16"}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0 }}
                      >   
                        <div className="-mt-10 w-full bg-slate-50/95 rounded-lg p-6 space-y-4">
                          <p className="text-gray-800 font-semibold text-lg">{`Step ${currIdx + 1}: ${fragments[currIdx]}...`}</p>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-900 transition-all duration-300" style={{ width: `${percent}%` }}></div>
                          </div>
                          <div className="flex justify-between text-sm font-medium">
                            {fragments.map((fragment, index) => (<span key={fragment} className={index <= currIdx ? "text-blue-950 mx-5" : "text-gray-500 mx-10"}>
                                {fragment}
                              </span>))}
                          </div>
                      </div>
                      {fragment}
                      <div className="mt-auto w-full flex justify-end space-x-8">
                        {currIdx !== 0 && <button onClick={(e)=>{window.scrollTo({top:0, left:0, behavior:'smooth'}), e.currentTarget.blur(),prevFragment()}}type="button" className="mt-10 -mb-10 px-10 py-3 text-sm font-medium text-center text-slate-50 bg-blue-950 rounded-lg hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-850 dark:bg-blue-900 dark:hover:bg-blue-700 dark:focus:ring-blue-850 transition-colors duration-950">Back</button>}
                        <button onClick={(e)=> {window.scrollTo({top:0, left:0, behavior:'smooth'}), e.currentTarget.blur()}} type="submit" className="mt-10 -mb-10 px-10 py-3 text-sm font-medium text-center text-slate-50 bg-blue-950 rounded-lg hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-850 dark:bg-blue-900 dark:hover:bg-blue-700 dark:focus:ring-blue-850 transition-colors duration-950 ease-in-out">{currIdx !== formFragments.length - 1 ? "Next" : "Submit"}</button>
                      </div>
                    </motion.div>
                  </form>
            </main>
            
        </>
    )
}