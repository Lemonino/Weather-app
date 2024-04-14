import React, { useEffect, useState } from 'react';
import * as images from './images'
import { FaSearch, FaTrash } from "react-icons/fa";

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(images.daytimeImage);
    const [pastSearches, setPastSearches] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    const API_KEY = '6bb02090a7f80e91a6965ba07567b9d1';
    const API_URL = `http://api.openweathermap.org/data/2.5/weather`;

    const changeBackgroundImage = (weather) => {
        const currentTime = new Date().getTime();
        const sunriseTime = weather.sys.sunrise * 1000; // Convert seconds to milliseconds
        const sunsetTime = weather.sys.sunset * 1000; // Convert seconds to milliseconds
        setBackgroundImage(currentTime > sunriseTime && currentTime < sunsetTime ? images.daytimeImage : images.nighttimeImage);
    }

    const removePastSearch = (index) => {
        const newPastSearches = [...pastSearches];
        newPastSearches.splice(index, 1);
        setPastSearches(newPastSearches);
    };

    const searchPastSearch = (city) => {
        setCity(city);
        fetchWeather(city);
    }

    useEffect(() => {
        const checkIfMobile = () => {
            const mobile = window.matchMedia('(max-width: 768px)');
            setIsMobile(mobile.matches);
        };

        checkIfMobile();

        const handleResize = () => {
            checkIfMobile();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchWeather = (city) => {
        fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then((data) => {
                setWeatherData(data);
                changeBackgroundImage(data);
                setError(null);
                const time = new Date().toLocaleString();
                setPastSearches([...pastSearches, { city, time }]);
            })
            .catch((err) => {
                setError(err.message);
                setWeatherData(null);
            });
    };

    const renderTemperature = () => {
        if (!weatherData) return null;
        return (
            <div className={`${backgroundImage === images.nighttimeImage ? 'text-white' : 'text-black'}`}>
                <div className='flex flex-row justify-between'>
                    <p className='flex flex-col items-start'>Today's Weather:
                    <p className={`${backgroundImage === images.nighttimeImage ? 'text-white' : 'text-purple-600'} text-7xl font-bold mb-4`}>{Math.round(weatherData.main.temp)}°C</p>
                    </p>
                    <img src={backgroundImage === images.nighttimeImage ? images.cloudImage : images.sunImage} alt={backgroundImage === images.nighttimeImage ? "Cloud" : "Sun"} className="w-24 h-24" />
                </div>
                <p className='flex'>
                <p className='mr-1'>H: {Math.round(weatherData.main.temp_max)} ° </p>
                <p>L: {Math.round(weatherData.main.temp_min)}°C</p>
                </p>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <p>{weatherData.name},{weatherData.sys.country}</p>
                    <p>{new Date().toLocaleString()}</p>
                    <p>Humidity: {weatherData.main.humidity}%</p>
                    <p>{weatherData.weather[0].description}</p>
                </div>
            </div>
        );
    };

    const renderPastSearches = () => {
        return (
            <div>
                <h3 className={`${backgroundImage === images.nighttimeImage ? 'text-white' : 'text-black'} text-lg font-semibold mt-4 flex`}>Search History</h3>
                <ul className="list-disc pl-6">
                    {pastSearches.map((search, index) => (
                        <li key={index} className="text-base list-none">
                            <div className={`${backgroundImage === images.nighttimeImage ? 'bg-black' : 'bg-white'} rounded-md m-2 opacity-75 ${backgroundImage === images.nighttimeImage ? 'text-white' : 'text-black'} flex items-center justify-between p-2`}>
                                <span className={`font-bold`}>{search.city} - {search.time}</span>
                                <div>
                                    {/* render search and trash button */}
                                    <div className={`m-1 inline-block rounded-full ${backgroundImage === images.nighttimeImage ? 'bg-gray-600' : 'bg-black-600'} ${backgroundImage === images.daytimeImage ? 'border border-gray-400' : ''} px-2 py-1`}>
                                        <button onClick={() => searchPastSearch(search.city)}><FaSearch className={`${backgroundImage === images.nighttimeImage ? 'text-white' : 'text-purple-600'}`} /></button>
                                    </div>
                                    <div className={`m-1 inline-block rounded-full ${backgroundImage === images.nighttimeImage ? 'bg-gray-600' : 'bg-black-600'} ${backgroundImage === images.daytimeImage ? 'border border-gray-400' : ''} px-2 py-1`}>
                                        <button onClick={() => removePastSearch(index)}><FaTrash className={`${backgroundImage === images.nighttimeImage ? 'text-white' : 'text-gray-600'}`} /></button>
                                    </div>
                                </div>

                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className={`justify-content: center h-screen bg-cover bg-center ${backgroundImage}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className=''>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="px-6 py-2 rounded-lg"
                />
                <button onClick={() => fetchWeather(city)} className='px-2 py-3 rounded-md bg-purple-600 ml-2 mb-4'><FaSearch className='text-lg'></FaSearch></button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {/* weather data */}
            <div className='flex justify-center'>
                <div className={`${backgroundImage === images.nighttimeImage ? 'bg-black' : 'bg-white'} rounded-lg text-full bg-opacity-50 mt-4 p-4`} style={{ width: isMobile ? '80%' : '70%' }}>
                    {renderTemperature()}
                    {renderPastSearches()}
                </div>
            </div>
        </div>
    );
};

export default Weather;
