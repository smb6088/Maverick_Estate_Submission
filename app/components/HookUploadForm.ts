import { ReactElement, useState } from "react"
export function hookUploadForm(formFragments: ReactElement[]){
    const [currIdx, setCurrIdx] = useState(0)
    function nextFragment(){
        setCurrIdx(i => Math.min(formFragments.length -1, i+1))
    }
    function prevFragment(){
        setCurrIdx(i => Math.max(0, i-1))
    }
    function jumpToFragment(idx: any){
        setCurrIdx(idx)

    }
    return {
        currIdx, fragment: formFragments[currIdx],
        jumpToFragment, nextFragment, 
        prevFragment, formFragments
    }
}