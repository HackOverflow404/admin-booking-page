import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Bookings from "./Bookings.js";
import Settings from "./Settings.js";

function App() {
  const [price, setPrice] = useState();
  const [maxDate, setMaxDate] = useState();
  const [courts, setCourts] = useState([]);
  const [timings, setTimings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const url = "http://localhost:8080/api/bookings";

  useEffect(() => {
    getAllBookings();
    getSettings();
  }, []);

  function getSettings() {
    axios
      .get(url + "/settings")
      .then((res) => {
        setPrice(res.data.price);
        setMaxDate(res.data.maxDateInterval);
        setTimings([res.data.timeRangeBegin, res.data.timeRangeEnd]);
        setCourts(res.data.courts);
      })
      .catch((err) => {
        console.error("API Request Error:", err);
      });
  }

  function getAllBookings() {
    axios
      .get(url)
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.error("API Request Error:", err);
      });
  }

  function handleForm(event) {
    event.preventDefault();

    const settings = {
      price: price,
      maxDateInterval: maxDate,
      timeRangeBegin: timings[0],
      timeRangeEnd: timings[1],
      courts: courts,
    };

    console.log(settings);

    axios
      .post(url + "/settings", settings)
      .then((res) => {
        console.log("Successfully set settings");
        alert("The settings have been changed");
      })
      .catch((err) => {
        console.error("API Request Error:", err);
      });
  }

  return (
    <div className="App">
      <Bookings
        bookings={bookings}
        setBookings={setBookings}
        getAllBookings={getAllBookings}
      />
      <Settings
        setPrice={setPrice}
        setMaxDate={setMaxDate}
        setCourts={setCourts}
        setTimings={setTimings}
        price={price}
        maxDate={maxDate}
        minTime={timings[0]}
        maxTime={timings[1]}
        courts={courts}
        onSubmit={handleForm}
      />
    </div>
  );
}

export default App;
