import {useRef} from "react";

export const useLoadingIndicator = (isLoading, props)=>{
    const needToHide = useRef(false);
    if(isLoading && typeof props.showLoader === "function"){
        needToHide.current = true;
        props.showLoader();
    }
    else if(needToHide.current && typeof props.hideLoader === "function"){
        props.hideLoader();
        needToHide.current = false
    }
}
