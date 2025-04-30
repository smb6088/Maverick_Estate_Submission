"use client"
type revFragment={
    streetNumber: string, street: string, zip: string, city: string, state: string,
        propStatus: string, propType: string, apt: string, price: string, bed: string, bath:string,
          room:string, sqft: string, floor: string, remark: string, avail:string, availDate: string, description: string, images: File[]
}
export function ReviewUploadFormFragment(
    {streetNumber, street, zip, city, state, propStatus, propType, apt, price, bed, bath,
          room, sqft, floor, remark, avail, availDate, description, images, updateFragments}
    :{streetNumber: string, street: string, zip: string, city: string, state: string,
        propStatus: string, propType: string, apt: string, price: string, bed: string, bath:string,
          room:string, sqft: string, floor: string, remark: string, avail:string, availDate: string, description: string, images: File[],
        updateFragments: (fields: Partial<revFragment>) =>void}){
    return(
        <div className="-ml-20 mt-10 -mb-6 w-full max-h-[100vh] overflow-y-auto">
        <div className="text-blue-950 space-y-10 px-6 py-4 max-w-4xl mx-auto text-left">
        <div>
            <h2 className="text-2xl font-bold mb-4">Address</h2>
            <div className="mr- grid grid-cols-[200px_1fr] gap-y-2">
            <div><strong>Street Number:</strong></div><div>{streetNumber}</div>
            <div><strong>Street:</strong></div><div>{street}</div>
            <div><strong>Zip:</strong></div><div>{zip}</div>
            <div><strong>City:</strong></div><div>{city}</div>
            <div><strong>State:</strong></div><div>{state}</div>
            <div><strong>Apt #:</strong></div><div>{apt}</div>
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold mb-4">Type</h2>
            <div className="grid grid-cols-[200px_1fr] gap-y-2">
            <div><strong>Property Status:</strong></div><div>{propStatus}</div>
            <div><strong>Property Type:</strong></div><div>{propType}</div>
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold mb-4">Measurements</h2>
            <div className="grid grid-cols-[200px_1fr] gap-y-2">
            <div><strong>Bedrooms:</strong></div><div>{bed}</div>
            <div><strong>Bathrooms:</strong></div><div>{bath}</div>
            <div><strong>Rooms:</strong></div><div>{room}</div>
            <div><strong>Square Feet:</strong></div><div>{sqft}</div>
            <div><strong>Floor:</strong></div><div>{floor}</div>
            <div><strong>Remarks:</strong></div><div>{remark}</div>
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold mb-4">Availability</h2>
            <div className="grid grid-cols-[200px_1fr] gap-y-2">
            <div><strong>Availability:</strong></div><div>{avail}</div>
            <div><strong>Available Date:</strong></div><div>{availDate}</div>
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold mb-4">Price</h2>
            <div className="grid grid-cols-[200px_1fr] gap-y-2">
            <div><strong>Price:</strong></div><div>{price}</div>
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <div>{description}</div>
        </div>
        <div>
        <h2 className="text-2xl font-bold mb-4">Images</h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((im,index) => { const img_prev = URL.createObjectURL(im)
                return(
                    <div key={index} className="relative">
                        <img src={img_prev} className="relative h-auto max-w-full rounded-lg shadow-lg"/>
                    </div>
                )
            })}
        </div>
        </div>
        </div>
        </div>

      
    )
    
}