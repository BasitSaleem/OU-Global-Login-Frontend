// 'use client'
// import React from "react";
// import "./darkToggle.css";
// import { useDarkMode } from "@/hooks/useDarkMode";

// const DarkToggle = () => {
//     const { isDarkMode, toggleDarkMode } = useDarkMode();

//     return (
//         <label className="ui-switch">
//             <input
//                 type="checkbox"
//                 checked={isDarkMode}
//                 onChange={toggleDarkMode}
//             />
//             <div className="slider">
//                 <div className="circle"></div>
//             </div>
//         </label>
//     );
// };

// export default DarkToggle;


'use client'
import React, { useState, useEffect } from "react";
import "./darkToggle.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { isDarkModeReducer } from "@/redux/slices/darkMode.slice";

const DarkToggle = () => {
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode)
    console.log("DARK MODE", isDarkMode);

    const dispatch = useDispatch()
    const handleToggle = () => {
        dispatch(isDarkModeReducer(!isDarkMode))
    };



    return (
        <label className="ui-switch">
            <input type="checkbox" checked={isDarkMode} onChange={handleToggle} />
            <div className="slider">
                <div className="circle"></div>
            </div>
        </label>
    );
};

export default DarkToggle;
