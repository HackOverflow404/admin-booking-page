import "./Settings.css";

function Settings(props) {
  function handlePriceChange(event) {
    props.setPrice(event.target.value);
  }

  function handleDateChange(event) {
    props.setMaxDate(event.target.value);
  }

  function handleCourtChange(event) {
    props.courts[Number(event.target.id)] = event.target.value; // Because it is an array, it will not throw an error even though tempCourts is a const
    console.log(props.courts);
    props.setCourts([...props.courts]);
  }

  function handleAddCourt(event) {
    event.preventDefault();
    props.setCourts([...props.courts, ""]);
  }

  function handleRemoveCourt(event) {
    event.preventDefault();
    const index = parseInt(event.target.id.match(/\d+/));
    console.log("Deleting " + props.courts[index]);
    props.courts.splice(index, 1);
    console.log(props.courts);
    props.setCourts([...props.courts]);
  }

  function handleTimeMaxChange(event) {
    const newTime = event.target.value;
    let date = new Date("January 1, 1970 " + newTime);
    let options = { hour: "2-digit", minute: "2-digit", hour12: true };
    let convertedTime = date.toLocaleString("en-US", options);

    props.setTimings([props.minTime, convertedTime]);
    console.log(convertedTime);
  }

  function handleTimeMinChange(event) {
    const newTime = event.target.value;
    let date = new Date("January 1, 1970 " + newTime);
    let options = { hour: "2-digit", minute: "2-digit", hour12: true };
    let convertedTime = date.toLocaleString("en-US", options);

    props.setTimings([convertedTime, props.maxTime]);
    console.log(convertedTime);
  }

  return (
    <div className="Settings">
      <form onSubmit={props.onSubmit}>
        <input type="submit" id="submit-button" value="Save Changes" />
        <label className="settings-label" id="price-label" for="price">
          Price Per Guest:
        </label>
        <input
          className="settings-input"
          type="number"
          id="price"
          name="price"
          min="0"
          pattern="[0-9]+"
          defaultValue={props.price}
          onChange={handlePriceChange}
          required
        />
        <br />
        <label className="settings-label" id="maxDate-label" for="maxDate">
          Max Date Interval:
        </label>
        <input
          className="settings-input"
          type="number"
          id="maxDate"
          name="maxDate"
          pattern="[1-9][0-9]*"
          defaultValue={props.maxDate}
          onChange={handleDateChange}
          required
        />
        <br />
        <label className="settings-label" id="timeRange-label" for="timeRange">
          Time Range:
        </label>
        <span id="timeRange-span">
          <input
            className="settings-input"
            type="time"
            id="timeRangeBegin"
            name="timeRange"
            value={new Date(
              "January 1, 1970 " + props.minTime
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            step="3600"
            onChange={handleTimeMinChange}
            required
          />
          <label
            className="settings-label time-label"
            id="timeRangeDash"
            for="timeRange"
          >
            -
          </label>
          <input
            className="settings-input"
            type="time"
            id="timeRangeEnd"
            name="timeRange"
            value={new Date(
              "January 1, 1970 " + props.maxTime
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            step="3600"
            onChange={handleTimeMaxChange}
            required
          />
        </span>
        <label className="settings-label" id="courts-label" for="courts">
          Courts:
        </label>
        <br />
        <div className="courts-div">
          {props.courts.map((court, index) => {
            return (
              <div className={"court-input-div"}>
                <input
                  type="text"
                  className="courts settings-input"
                  name="courts"
                  pattern="[A-Za-z\s]+"
                  id={index}
                  value={court}
                  onChange={handleCourtChange}
                  required
                />
                <button
                  className="delete-court"
                  id={index + "-delete"}
                  onClick={handleRemoveCourt}
                >
                  X
                </button>
                <br />
              </div>
            );
          })}
          <button className="add-court" onClick={handleAddCourt}>
            Add Court
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
