import { data } from 'autoprefixer';
import React, { useEffect, useState } from 'react';
import { BiArrowToTop, BiCompass, BiDownArrowAlt, BiLoaderAlt, BiUpArrow, BiUpArrowAlt } from 'react-icons/bi';
import { createStore } from 'react-sweet-state';
import useSWR from 'swr';
import SearchBar from '../components/search';
import { WeatherPreview } from '../components/weather-preview';
import { getLocationCoords } from "../utils/location";
import ProgressBar from 'react-customizable-progressbar'



function useForcast([lat, long]) {

  let query = `http://api.weatherapi.com/v1/forecast.json?key=a4d768eae1cb48cca3523003212102&q=${lat},${long}&days=7`
  let { data, error } = useSWR(query, (url) => fetch(url).then((res) => res.json()))

  return {
    data: data,
    loading: !data && !error,
    error: error
  }
}

function RefreshButton() {



}


export default function Home() {
  let [currentCoords, setCurrentCoords] = useState([51.52, -0.11]) // London

  let { data, isLoading, error } = useForcast(currentCoords)

  let [isCelsius, setCelsius] = useState(true)
  useEffect(() => {
    getLocationCoords().then((val) => setCurrentCoords([val.latitude, val.longitude]))
  }, [])


  return !isLoading && data !== undefined ? <div className="flex h-screen">
    <div className="relative flex flex-col w-1/4">
      <div className="mx-auto">
        <SearchBar setLocation={(location) => { setCurrentCoords(location.latLong) }} />
      </div>
      <div className="mx-auto mt-16">
        <img src={"http:" + data.current.condition.icon} />
      </div>
      <h2 className="mt-5 text-6xl font-medium text-center text-white">
        {data.current.condition.text}
      </h2>
      <h3 className="mt-16 text-center text-white text-9xl">
        {isCelsius ? data.current.temp_c : data.current.temp_f}
        <sup>
          <span>°</span>
          <span>{isCelsius ? "C" : "F"}</span>
        </sup>
      </h3>
      <DateCounter />
      <div className="h-px mx-10 my-10 bg-gray-200 rounded-full "></div>
      <div className="absolute top-0 bottom-0 left-0 right-0" style={{ zIndex: -100 }}>
        <TimeImage />
      </div>
      <div className="p-3 mx-10 mt-auto mb-10 text-4xl font-medium text-center text-white border rounded-lg">
        {data.location.name}
      </div>
    </div>
    <div className="relative flex-col flex-grow h-screen bg-transparent">
      <div className="ml-auto max-w-max">
        <TempButton selected={isCelsius} onClick={() => { !isCelsius && setCelsius(true) }}>
          °
          C
        </TempButton>
        <TempButton selected={!isCelsius} onClick={() => { isCelsius && setCelsius(false) }}>
          °
          F
        </TempButton>
      </div>

      <ol className="flex justify-center w-full">
        {data.forecast.forecastday.map((forecast) => <li className="mx-4" key={forecast.date_epoch}>
          <WeatherPreview isCelsius={isCelsius} forcastData={forecast} />
        </li>)}
      </ol>

      <h4 className="ml-5 text-3xl font-bold text-white my-9">Highlights</h4>

      <div className="flex flex-wrap mx-16">
        <div className="w-1/3">
          <UVIndex uv={data.current.uv} />
        </div>
        <div className="w-1/3">
          <WindStatus windspeed={data.current.wind_kph} direction={data.current.wind_dir} />
        </div>
        <div className="w-1/3">
          <SunriseSunset sunrise={data.forecast.forecastday[0].astro.sunrise} sunset={data.forecast.forecastday[0].astro.sunset} />
        </div>
      </div>

      <div style={{ zIndex: -1 }} className="absolute inset-0 inline-flex bg-black">
        <ConditionVideo code={data.current.condition.code} />
      </div>

    </div>

  </div> :
    <div className="flex w-screen h-screen">
      <div className="m-auto text-5xl">
        <BiLoaderAlt className="animate-spin" />
      </div>
    </div>
}


function UVIndex({ uv = 5 }) {
  return <div className="flex flex-col p-5 pl-10 mx-10 bg-white h-60 rounded-xl">
    <h4 className="text-xl font-medium text-gray-400">UV Index</h4>
    <div className="w-full mt-10 text-center">
      <span className="text-6xl font-medium ">{uv}</span>
    </div>
  </div>
}


function WindStatus({ windspeed, direction }) {
  return <div className="flex flex-col p-5 pl-10 mx-10 bg-white h-60 rounded-xl">
    <h4 className="text-xl font-medium text-gray-400">Wind Status</h4>
    <div className="w-full mt-10 text-left">
      <span className="text-6xl font-medium ">{windspeed}<span className="text-lg"> km/h</span></span>
    </div>
    <div className="mt-auto text-4xl text-blue-500">
      <BiCompass className="inline" />
      <span className="inline text-2xl font-medium text-black align-middle"> {direction}</span>
    </div>
  </div>
}


function SunriseSunset({ sunrise, sunset }) {
  return <div className="flex flex-col p-5 pl-10 mx-10 bg-white h-60 rounded-xl">
    <h4 className="text-xl font-medium text-gray-400">Sunrise & Sunset</h4>
    <div className="flex flex-col my-auto">
      <div className="flex">
        <span className="p-2 text-3xl text-white bg-yellow-300 rounded-full shadow-xl">
          <BiUpArrowAlt />
        </span>
        <span className="self-center ml-4 text-3xl font-medium align-middle">{sunrise}</span>
      </div>
      <div className="flex mt-6">
        <span className="p-2 text-3xl text-white bg-yellow-300 rounded-full shadow-xl">
          <BiDownArrowAlt />
        </span>
        <span className="self-center ml-4 text-3xl font-medium align-middle">{sunset}</span>
      </div>
    </div>

  </div>
}

function TempButton({ selected, children, onClick }) {
  return <button onClick={onClick}
    style={{ outline: "none" }}
    className={`p-3 m-1 text-xl font-bold ${selected ? "text-white bg-black " : "text-black bg-white"} rounded-full`}>
    {children}
  </button>
}

function ConditionVideo({ code }) {

  return <video autoPlay src="/backvids/back.mp4" className="object-fill" loop />

}

function TimeImage() {

  let date = useTimer()
  let hour = date.getHours();

  if (hour >= 5 && hour <= 7 || hour >= 18 && hour <= 20) {
    return <img src="/rising.jpg" className="object-cover h-full" />
  } else if (hour >= 8 && hour <= 18) {
    return <img src="/sun.jpg" className="object-cover h-full" />
  } else {
    return <img src="/moon.jpg" className="object-cover h-full" />
  }


}

function useTimer() {
  let [date, _] = useState(new Date())
  let [seconds, setSeconds] = useState(Date.now())
  date.setTime(seconds)
  let interval;

  useEffect(() => {
    interval = setInterval(() => {
      setSeconds(Date.now())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, []);

  return date
}


function DateCounter() {

  let date = useTimer()

  console.log(date);

  return <p className="mt-10 text-2xl font-medium text-center text-white">
    <span>{date.toLocaleDateString('en-gb', { weekday: 'long' })},</span>
    <span className="text-gray-100"> {date.toLocaleTimeString('en-gb', { hour: '2-digit', minute: '2-digit' })}</span>
  </p>

}



