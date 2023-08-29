import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../assets/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../assets/styles/weather.css";

const Weather = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});

  const getCurrentLoc = async (e) => {
    await axios
      .get(config.currentLoc)
      .then((res) => {
        setCurrentLocation(res.data.city);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const search = async () => {
    await axios
      .get(config.weatherURL, {
        params: {
          q: query ? query : currentLocation,
          units: "metric",
          APPID: config.ApiKey,
        },
      })
      .then((res) => {
        setWeather(res?.data);
        setQuery("");
        // console.log("res", res?.data);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message)
      });
  };

  useEffect(() => {
    getCurrentLoc();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      search();
    }
  }, [currentLocation]);


  return (
    <div className="main-container">
      <input
        type="text"
        className="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="submit_btn" onClick={() => search()}>Click</button>
      {weather?.main && (
        <div className="city">
          <h2 className="city-name">
            <span>{weather.name}</span>
            <sup>{weather.sys.country}</sup>
          </h2>
          <div className="city-temp">
            {Math.round(weather?.main?.temp)}
            <sup>&deg;C</sup>
          </div>
          <div className="info">
            <img
              className="city-icon"
              src={`https://openweathermap.org/img/wn/${weather?.weather?.[0]?.icon}@2x.png`}
              alt={weather?.weather?.[0]?.description}
            />
            <p>{weather?.weather?.[0]?.description}</p>
          </div>
          <span className="view_more">View More</span>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Weather;
