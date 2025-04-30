"use client"
import { useState } from "react"
import { SearchBar } from "./SearchBar"

type adrFieldFragment = { fullAddress: string, streetNumber: string, street: string, zip: string, city: string, state: string,
    latitude: string, longitude: string
}
export function AddrUploadFormFragment({fullAddress, streetNumber, street, zip, city, state,latitude,longitude,updateFragments}
    : {fullAddress: string, streetNumber: string, street: string, zip: string, city: string, state: string, latitude:string, longitude:string, 
    updateFragments: (fields: Partial<adrFieldFragment>) => void}){
    
    const [barFocus, setBarFocus] = useState(false)
    const [searchString, setSearchString] = useState("")
    return(
        <>
        <h2 className="mt-10 text-2xl font-bold text-blue-950 mb-12">Enter the address of your property to search for it...</h2>
        <SearchBar searchString={fullAddress} onSearchStringChange={(fields) => updateFragments(fields)}/>
        {/* <h2 className="mt-1 text-1xl font-bold text-blue-950 mb-1">{searchString}</h2>
        <h2 className="mt-1 text-1xl font-bold text-blue-950 mb-1">fullAddress: {fullAddress}</h2>
        <h2 className="mt-1 text-1xl font-bold text-blue-950 mb-1">streetNumber: {streetNumber}</h2>
        <h2 className="mt-1 text-1xl font-bold text-blue-950 mb-1">street: {street}</h2>
        <h2 className="mt-1 text-1xl font-bold text-blue-950 mb-1">zip: {zip}</h2>
        <h2 className="mt-1 text-1xl font-bold text-blue-950 mb-1">city: {city}</h2>
        <h2 className="mt-1 text-1xl font-bold text-blue-950 mb-1">state: {state}</h2> */}
        </>
    )
    
}