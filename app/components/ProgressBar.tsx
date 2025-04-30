"use client"

export default function ProgressBar({curr_index}:{curr_index : number}){
    const fragments = ["Looking Up Address", "Property Details", "Images Upload", "Review"]
    const percent = ((curr_index+1)/fragments.length) * 100

    return(
        <div className="w-full bg-white rounded-lg border p-6 space-y-4">
        <p className="text-gray-800 font-semibold text-lg">{`Step ${curr_index + 1}: ${fragments[curr_index]}...`}</p>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-900 transition-all duration-300" style={{ width: `${percent}%` }}></div>
        </div>
  
        <div className="flex justify-between text-sm font-medium">
          {fragments.map((fragment, index) => (<span key={fragment} className={index <= curr_index ? "text-blue-950 mx-5" : "text-gray-500 mx-10"}>
              {fragment}
            </span>
          ))}
        </div>
      </div>
    )
    
}