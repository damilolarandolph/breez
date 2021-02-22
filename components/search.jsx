import React, { useState } from 'react'
import { BiLoaderAlt, BiSearch, BiTargetLock } from 'react-icons/bi'
import useSWR from 'swr'
import { getLocationCoords } from '../utils/location'


const fetcher = (url) => fetch(url).then(res => res.json())

export function useSearch(query) {
    if (query.length == 0) {
        query = "l"
    }
    let qString = encodeURIComponent(query)
    let url = `http://api.weatherapi.com/v1/search.json?key=a4d768eae1cb48cca3523003212102&q=${qString}`
    const { data, error } = useSWR(url, fetcher)
    let getProp = (index, prop) => data[index][prop]


    return {
        data: {
            length: data !== undefined ? data.length : 0,
            getId: (index) => getProp(index, "id"),
            getName: (index) => getProp(index, "name"),
            getRegion: (index) => getProp(index, "region"),
            getCountry: (index) => getProp(index, "country"),
            getLatLong: (index) => [getProp(index, "lat"), getProp(index, "lon")]
        },
        isLoading: !error & !data,
        isError: error
    }
}


let deBounce = function (func, timeOut) {
    let timeOutNumber;

    return function (args) {
        if (timeOutNumber != undefined) {
            clearTimeout(timeOutNumber)
        }
        timeOutNumber = setTimeout(func, timeOut, args)
    }
}
function CurrentLocationButton({ setLocation }) {

    const [query, setQuery] = useState("")
    let { data, isLoading, error } = useSearch(query)
    if (!isLoading && !error && query.length !== 0) {
        let obj = { latLong: data.getLatLong(0), name: data.getName(0) }
        setLocation(obj)
    }

    return <button
        onClick={() => getLocationCoords().then((val) => setQuery(`${val.latitude},${val.longitude}`))}
        className={`p-1 my-auto  rounded-full text-white border outline-none ${isLoading ? "animate-pulse" : ''}`}>
        <BiTargetLock />
    </button>

}
export default function SearchBar({ setLocation }) {

    const [query, setQuery] = useState("")
    const [hasFocus, setFocus] = useState(false)
    let { data, isLoading, error } = useSearch(query)
    let handler = deBounce((e) => {
        setQuery(e.target.value)
    }, 1000)


    let items = []
    if (!isLoading && !error) {
        for (let item = 0; item < 5 && item < data.length; ++item) {

            items.push({ latLong: data.getLatLong(item), name: data.getName(item), id: data.getId(item) })
        }
    }

    return <div className="relative">
        <div style={{ zIndex: 100 }} onFocusCapture={() => setFocus(true)} className="relative max-w-min">
            <input className="p-5 pl-6 ml-4 text-white bg-transparent border-b outline-none"
                onInput={handler} placeholder="Search for places" />
            <span className="absolute top-0 bottom-0 inline-flex text-2xl">
                <CurrentLocationButton setLocation={setLocation} />
            </span>
            <span className="absolute top-0 bottom-0 left-0 inline-flex text-2xl text-white">
                {isLoading ? <BiLoaderAlt className="my-auto animate-spin" /> :
                    <BiSearch className="my-auto" />}
            </span>{hasFocus ?
                <ol className="absolute left-0 right-0 z-10 ">
                    {items.map((item) => <SearchResult key={item.id} text={item.name} onClick={() => { setLocation(item); setFocus(false) }} />)}
                </ol> : ''
            }
        </div>
        {hasFocus ?
            <div onClick={() => setFocus(false)} className="absolute top-0 w-screen h-screen "></div> : ''}
    </div>
}






function SearchResult({ onClick, text }) {

    return <li onClick={onClick} className="p-4 font-semibold duration-200 bg-gray-200 cursor-pointer hover:bg-gray-400">{text}</li>

}