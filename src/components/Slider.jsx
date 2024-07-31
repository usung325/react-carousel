import React, { useState } from 'react'

export default function Slider() {
    const arr1 = ['im1', 'im2', 'im3']

    const [activeSlide, changeArrIndex] = useState(0);
    const clickLeft = () => {
        changeArrIndex((prev) => prev > 0 ? prev - 1 : 0)
    }
    const clickRight = () => {
        changeArrIndex((prev) => prev < arr1.length - 1 ? prev + 1 : prev)
    }

    return (
        <div className="max-w-full mx-auto bg-green-200">
            <div className="flex justify-center items-center space-x-10">
                <button onClick={clickLeft} className="bg-slate-400 px-3 rounded-2xl max-h-10"> {'<'} </button>
                {arr1.map((item, index) => (
                    <img src={`./images/${item}.png`} key={item} className={`bg-slate-700 ${activeSlide === index ? "" : "hidden"}`} />
                ))}
                <button onClick={clickRight} className="bg-slate-400 px-3 rounded-2xl max-h-10"> {'>'} </button>
            </div>
        </div>
    )
} 