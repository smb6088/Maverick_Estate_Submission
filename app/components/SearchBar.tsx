"use client"
import { useState, useRef } from "react"
import { useJsApiLoader, StandaloneSearchBox} from '@react-google-maps/api'
export function SearchBar({searchString, onSearchStringChange} : { searchString: string, onSearchStringChange: (fields: {fullAddress: string, streetNumber: string, street: string, zip: string, city: string, state: string, latitude: string, longitude: string}) => void}){
    const [barFocus, setBarFocus] = useState(false)
    const inputRef = useRef<google.maps.places.SearchBox | null>(null)
    const [input, setInput] = useState(searchString)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["marker", "places"]
    })
    const handlePlacesChanged = () => {
        const places = inputRef.current?.getPlaces() || []
        const place = places[0]
        const components = place.address_components || []
        const geometry = place.geometry?.location
        const streetNumber = components.find(c => c.types.includes("street_number"))?.long_name || ""
        const street = components.find(c => c.types.includes("route"))?.long_name || ""
        const city = components.find(c => c.types.includes("locality"))?.long_name || components.find(c => c.types.includes("sublocality"))?.long_name || components.find(c => c.types.includes("neighborhood"))?.long_name || ""
        const state = components.find(c => c.types.includes("administrative_area_level_1"))?.short_name || ""
        const zip = components.find(c => c.types.includes("postal_code"))?.long_name || ""
        const fullAddress = place.formatted_address || place.name || ""
        const latitude = String(geometry?.lat())
        const longitude = String(geometry?.lng())
    
        console.log({ streetNumber, street, city, state, zip, latitude, longitude })
        onSearchStringChange({fullAddress, streetNumber, street, zip, city, state, latitude, longitude})

        setInput(fullAddress)
    }
    return(
        <div className={`mx-auto relative transition-all duration-700 ease-in-out flex-shrink-0 ${barFocus ? "w-full bg-slate-50/0" : "w-96"}`}>
    {isLoaded && <StandaloneSearchBox onLoad = {(ref) => inputRef.current = ref} onPlacesChanged={handlePlacesChanged}>
        <>
        <input type = "text" value={input} onChange={e => setInput(e.target.value)} placeholder = "Enter the address of the property..."
         className = {"w-full py-6 pl-20 pr-22 text-gray-700 bg-white border rounded-full shadow-lg outline-none transition-all ${barFocus ? 'border=blue-500' : 'border-gray-300'}"}
         onFocus={() => setBarFocus(true)} onBlur={() => setBarFocus(false)} 
         />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-9 h-9 transition-colors duration-3000 ease-in-out ${barFocus ? "text-blue-500" : "text-gray-400"}`}
          fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
          <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} 
           d = "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
    </>
    </StandaloneSearchBox>
    }
      </div>
    )
}