import React from 'react';



export function WeatherPreview({ forcastData, isCelsius = true }) {
    let minTemp = isCelsius ? forcastData.day.mintemp_c : forcastData.day.mintemp_f
    let maxTemp = isCelsius ? forcastData.day.maxtemp_c : forcastData.day.maxtemp_f
    let icon = "http:" + forcastData.day.condition.icon
    let day = (new Date(forcastData.date_epoch * 1000)).toLocaleDateString(undefined, { weekday: "short" })
    return <div className="flex flex-col px-8 py-4 bg-white rounded-lg w-max">
        <span className="text-lg font-semibold text-center">{day}</span>
        <img src={icon} />
        <span className="w-24 font-semibold text-center ">
            <span>{maxTemp}°</span>
            <span className="ml-2 text-gray-400">{minTemp}°</span>
        </span>
    </div>
}