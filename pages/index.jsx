import { data } from 'autoprefixer';
import React, { useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { createStore } from 'react-sweet-state';
import useSWR from 'swr';
import SearchBar from '../components/search';
import { getLocationCoords } from "../utils/location";



const store = createStore({
  initialState: {
    isRefreshing: true
  },

  actions: {
    loadForcast: (forcastData) => ({ setState, getState }) => {
      setState({ isRefreshing: getState().isRefreshing, ...forcastData })
    },
    setRefreshing: (val) => ({ setState, getState }) => {
      setState({ ...getState, isRefreshing: val })
    }
  }
})


function useForcast([lat, long]) {

  let query = `http://api.weatherapi.com/v1/forecast.json?key=a4d768eae1cb48cca3523003212102&q=${lat},${long}&days=5`
  let { data, error } = useSWR(query, (url) => fetch(url).then((res) => res.json()))

  return {
    data: data,
    loading: !data && !error,
    error: error
  }
}

function RefreshButton() {



}

function initStore() {

}

export default function Home() {
  let [currentCoords, setCurrentCoords] = useState([51.52, -0.11]) // London

  let { data, isLoading, error } = useForcast(currentCoords)
  useEffect(() => {
    getLocationCoords().then((val) => setCurrentCoords([val.latitude, val.longitude]))
  }, [])

  if (!isLoading) {
    console.log(data)
  }

  let date = new Date(Date.now())

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
        {data.current.temp_c}
        <sup>
          <span>°</span>
          <span>C</span>
        </sup>
      </h3>
      <DateCounter />
      <div className="h-px mx-10 my-10 bg-gray-200 rounded-full "></div>
      <div className="absolute top-0 bottom-0 left-0 right-0" style={{ zIndex: -100 }}>
        <TimeImage />
      </div>
    </div>

  </div> :
    <div className="flex w-screen h-screen">
      <div className="m-auto text-5xl">
        <BiLoaderAlt className="animate-spin" />
      </div>
    </div>
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



