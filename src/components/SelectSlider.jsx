import React from 'react'

export default function SelectSlider({ imData, changeArrIndex, activeSlide }) {
    const changeToSelect = (i) => {
        changeArrIndex(i)
    }
    return (
        <div className="flex flex-row gap-10 justify-center items-center mx-auto p-4">
            {imData.map((item, index) => (
                <img onClick={() => changeToSelect(index)} src={`./images/${item}.png`} className={`h-24 ${activeSlide === index ? "opacity-95" : "opacity-50"}`} />
            ))}
        </div>
    )
}