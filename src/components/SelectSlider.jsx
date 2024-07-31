import React from 'react'

export default function SelectSlider({ imData }) {
    return (
        <div className="flex flex-row gap-10 justify-center items-center mx-auto p-4">
            {imData.map((item) => (
                <img src={`./images/${item}.png`} className="h-24" />
            ))}
        </div>
    )
}