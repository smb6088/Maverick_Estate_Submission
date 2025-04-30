"use client"
import { useState, useEffect } from "react"
type detFieldFragment = { streetNumber: string, street: string, zip: string, city: string, state: string
    propStatus: string, propType: string, apt: string, price: string, bed: string, bath:string,
    room:string, sqft: string, floor: string, remark: string, avail:string, availDate: string, description: string}

export function DetailsUploadFormFragment({streetNumber, street, zip, city, state,
    propStatus, propType, apt , price, bed, bath,
      room, sqft, floor, remark, avail, availDate, description, updateFragments}: {streetNumber: string, street: string, zip: string, city: string, state: string,
    propStatus: string, propType: string, apt: string, price: string, bed: string, bath:string,
      room:string, sqft: string, floor: string, remark: string, avail:string, availDate: string, description: string
    ,updateFragments: (fields: Partial<detFieldFragment>) => void}){
    const [propStatus_x, setPropStatus] = useState(propStatus)
    const [propType_x, setPropType] = useState(propType)
    const [houseNum_x, setHouseNum] = useState(streetNumber)
    const [street_x, setStreet] = useState(street)
    const [apt_x, setApt] = useState(apt)
    const [zip_x, setZip] = useState(zip)
    const [city_x, setCity] = useState(city)
    const [state_x, setState] = useState(state)
    const [price_x, setPrice] = useState(price)
    const [bed_x, setBed] = useState(bed)
    const [bath_x, setBath] = useState(bath)
    const [room_x, setRoom] = useState(room)
    const [sqft_x, setSqft] = useState(sqft)
    const [floor_x, setFloor] = useState(floor)
    const [remark_x, setRemark] = useState(remark)
    const [avail_x, setAvail] = useState(avail)
    const [availDate_x, setAvailDate] = useState(availDate)
    const [desc_x, setDesc] = useState(description)

    useEffect(() => {updateFragments({streetNumber: houseNum_x, street: street_x, zip: zip_x, city: city_x, state: state_x,
          propStatus: propStatus_x, propType: propType_x, apt: apt_x, price: price_x, bed: bed_x, bath: bath_x, room: room_x, sqft: sqft_x, 
          floor: floor_x, remark: remark_x, avail: avail_x, availDate: availDate_x, description: desc_x})}, [houseNum_x, street_x, zip_x, city_x, state_x, propStatus_x, propType_x, apt_x, price_x, bed_x, bath_x, room_x, sqft_x, floor_x, remark_x, avail_x, availDate_x, desc_x]
    )
    return(
        <div className="mt-10 mx-0 -mb-15 pb-10 max-h-[100vh] overflow-y-auto">
        <div className="text-blue-950 bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 space-y-8">

      <section>
        <h3 className="text-blue-950 text-lg font-bold mb-3">TYPE</h3>
        <div className="pt-3 -mx-0 md:flex flex-wrap mb-4">
          <div className="md:w-1/3 px-3 mb-4">
            <label htmlFor="status" className="block uppercase text-blue-950 text-xs font-bold mb-2">Status</label>
            <div className="text-blue-950 flex items-center space-x-2">
              <select id="status" value={propStatus_x} onChange={e=>{setPropStatus(e.target.value)}}  className="border border-gray-300 bg-gray-100 rounded py-2 px-3 w-2/3 focus:outline-none focus:border-blue-500">
                <option value="">-- SELECT STATUS --</option>
                <option value="FOR_SALE">For Sale</option>
                <option value="FOR_RENT">For Rent</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
         
          <div className="-ml-24 md:w-1/3 px-3 mb-4">
            <label htmlFor="property-type" className="block uppercase text-gray-700 text-xs font-bold mb-2">Property Type</label>
            <select id="property-type" value={propType_x} onChange={e=>{setPropType(e.target.value)}}  className="text-blue-950 block w-full bg-gray-100 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500">
              <option value="">-- SELECT TYPE --</option>
              <option value="SINGLE_FAMILY">Single Family</option>
              <option value="MULTI_FAMILY">Multi Family</option>
              <option value="APARTMENT">Apartment</option>
              <option value="TOWNHOUSE">Townhouse</option>
              <option value="CONDO">Condo</option>
              <option value="MANUFACTURED">Manufactured</option>
              <option value="LOT">Lot</option>
            </select>
          </div>
        </div>
        
      </section>

      <section>
        <h3 className="text-blue-950 text-lg font-bold mb-3">ADDRESS</h3>
        <div className="pt-3 -mx-0 md:flex flex-wrap mb-4">
          <div className="md:w-1/4 px-3 mb-4">
            <label htmlFor="house-number" className="block uppercase text-gray-700 text-xs font-bold mb-2">House No.</label>
            <input id="house-number" value={houseNum_x} onChange={e=>{setHouseNum(e.target.value)}} type="text" placeholder="" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="md:w-1/4 px-3 mb-4">
            <label htmlFor="street" className="block uppercase text-gray-700 text-xs font-bold mb-2">Street</label>
            <input id="street" value={street_x} onChange={e=>{setStreet(e.target.value)}} type="text" placeholder="" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
          </div>
          
          {propType==="APARTMENT" && <div className="md:w-1/4 px-3 mb-4">
            <label htmlFor="apt-unit" className="block uppercase text-gray-700 text-xs font-bold mb-2">Apt/Unit #</label>
            <input id="apt-unit" type="text" value={apt_x} onChange={e=>{setApt(e.target.value)}} placeholder="" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
          </div>}
        </div>
        <div className="pt-3 -mx-0 md:flex flex-wrap mb-4">
          <div className="md:w-1/4 px-3 mb-4">
            <label htmlFor="zip" className="block uppercase text-gray-700 text-xs font-bold mb-2">Zip</label>
            <input id="zip" type="text" value={zip_x} onChange={e=>{setZip(e.target.value)}} placeholder="" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="md:w-1/4 px-3 mb-4">
            <label htmlFor="city" className="block uppercase text-gray-700 text-xs font-bold mb-2">City</label>
            <input id="city" type="text" value={city_x} onChange={e=>{setCity(e.target.value)}} placeholder="" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="md:w-1/4 px-3 mb-4 relative">
            <label htmlFor="state" className="block uppercase text-gray-700 text-xs font-bold mb-2">State</label>
            <input type="text" id="state" value={state_x} onChange={e=>{setState(e.target.value)}} className="block w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded focus:outline-none focus:border-blue-500"/>
            

          </div>
          
        </div>
      </section>

      <section>
        <h3 className="text-blue-950 text-lg font-bold mb-3">PRICE/RENT</h3>
        <div className="pt-3 -mx-0 md:flex flex-wrap mb-4">
          <div className="md:w-1/4 px-3">
          <label htmlFor="price" className="block uppercase text-gray-700 text-xs font-bold mb-2">Listing Price (USD)</label>
            <input type="number" step="1000" value={price_x} onChange={e=>{setPrice(e.target.value)}} placeholder="0" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-blue-950 text-lg font-bold mb-3">MEASUREMENTS</h3>
        <div className="pt-3 -mx-0 md:flex flex-wrap mb-4">
            <div className="md:w-1/6 px-3 mb-4">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">Beds(s)</label>
              <input type="number" placeholder="0" value={bed_x} onChange={e=>{setBed(e.target.value)}} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="md:w-1/6 px-3 mb-4">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">Baths(s)</label>
              <input type="number" placeholder="0" value={bath_x} onChange={e=>{setBath(e.target.value)}} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="md:w-1/6 px-3 mb-4">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">Room(s)</label>
              <input type="number" value={room_x} onChange={e=>{setRoom(e.target.value)}} placeholder="0" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="md:w-1/6 px-3 mb-4">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">Sqft.</label>
              <input type="number" placeholder="0" value={sqft_x} onChange={e=>{setSqft(e.target.value)}} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="md:w-1/6 px-3 mb-4">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">Floor(s)</label>
              <input type="number" placeholder="0" value={floor_x} onChange={e=>{setFloor(e.target.value)}} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="md:w-1/6 px-3 mb-4">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">Optional Remarks</label>
              <input type="text" placeholder="" value={remark_x} onChange={e=>{setRemark(e.target.value)}} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" />
            </div>

        </div>
      </section>

      <section>
        <h3 className="text-blue-950 text-lg font-bold mb-3">AVAILABILITY</h3>
        <div className="pt-3 -mx-0 md:flex flex-wrap mb-4">
            <div className="md:w-1/3 px-3 mb-4">
                <label htmlFor="availability-status" className="block uppercase text-gray-700 text-xs font-bold mb-2">Availability Status</label>
      <select id="availability-status" value={avail_x} onChange={e=>setAvail(e.target.value)}className="appearance-none block w-full bg-gray-100 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500">
        <option value="">-- SELECT STATUS --</option>
        <option value="Available">Available</option>
        <option value="Pending">Pending</option>
      </select>
            </div>
            {avail_x==="Pending" && <div className="ml-8 md:w-1/5 px-3 mb-4">
            <label htmlFor="available-date" className="block uppercase text-gray-700 text-xs font-bold mb-2">
                Available Starting On
            </label>
            <input id="available-date" type="date" value={availDate_x} onChange={e=>{setAvailDate(e.target.value)}}
                className="bg-gray-100 border border-gray-300 rounded py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            />
            </div>}
        </div>
        </section>

     
      <section>
        <h3 className="text-blue-950 text-lg font-bold mb-3">ADDITIONAL</h3>
        <div className="mx-3 mb-4">
          <label htmlFor="desc" className="block uppercase text-gray-700 text-xs font-bold mb-2">Listing Description</label>
          <textarea id="desc" rows={3} value={desc_x} onChange={e=>{setDesc(e.target.value)}} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"></textarea>
        </div>
      </section>

    </div>
    </div>
    )
}