import "./Bookings.css";
import axios from "axios";
import { useState, useEffect } from "react";

function Bookings(props) {
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedRow, setSelectedRow] = useState({ booking: {}, index: null });
  const [updatedBooking, setUpdatedBooking] = useState(selectedRow.booking);
  const [modalOpen, setModalOpen] = useState(false);
  const url = "http://localhost:8080/api/bookings";

  function bookingCreate() {
    const emptyBooking = {
      court: "Court",
      date: "Date",
      time: "Time",
      fname: "First Name",
      lname: "Last Name",
      hnum: "House No.",
      pnum: 0,
      email: "Email",
      gnum: 0,
      paid: false,
    };

    const index = props.bookings.length + 1;

    axios
      .post(url, emptyBooking)
      .then((res) => {
        console.log("Successfully made a new booking");

        // Redundant but allows for the bookings to be updated faster
        let updatedBookings = props.bookings;
        updatedBookings.push(emptyBooking);

        props.setBookings([...updatedBookings]);
        
        props.getAllBookings();
    
        handleDoubleClick(emptyBooking, index);
      })
      .catch((err) => {
        console.error("API Request Error:", err);
      });
  }

  function bookingDeleteAll(event) {
    if (window.confirm("Are you sure you would like to delete all bookings?")) {
      axios
        .delete(url)
        .then((res) => {
          console.log("Successfully deleted all bookings");

          // Redundant but allows for the bookings to be updated faster
          props.setBookings([]);
        })
        .catch((err) => {
          console.error("API Request Error:", err);
        });
    }

    props.getAllBookings();
  }

  function handleSelect(event) {
    console.log(event.target.parentElement.parentElement.getAttribute("id"));
    setSelectedBookings([
      ...selectedBookings,
      event.target.parentElement.parentElement.getAttribute("id"),
    ]);
  }

  function bookingDelete(event) {
    selectedBookings.forEach(function (selectedBooking) {
      console.log(selectedBooking);
      const searchFactors = selectedBooking.split("|");
      const court = searchFactors[0];
      const date = searchFactors[1];
      const time = searchFactors[2];

      const dateURL = date.replaceAll("/", "%252F");
      const timeURL = time.replaceAll(":", "%3A").replaceAll(" ", "%20");

      axios
        .delete(url + "/" + court + "/" + dateURL + "/" + timeURL)
        .then((res) => {
          console.log("Successfully deleted the booking");

          // Redundant but allows for the bookings to be updated faster
          const bookingDeletedIndex = props.bookings.findIndex(
            (booking) =>
              booking.court === court &&
              booking.date === date &&
              booking.time === time
          );

          let updatedBookings = props.bookings;
          updatedBookings.splice(bookingDeletedIndex, 1);

          props.setBookings([...updatedBookings]);
          setSelectedBookings([]);
        })
        .catch((err) => {
          console.error("API Request Error:", err);
        });
    });
    props.getAllBookings();
  }

  function handleDoubleClick(booking, index) {
    setSelectedRow({ booking: booking, index: index });
    setUpdatedBooking(booking);
    console.log("Double Clicked");
    setModalOpen(true);
  }

  function bookingUpdate(event) {
    const id = event.target.id;
    let objectKey = "";
    console.log("Booking Changed");

    switch (id) {
      case "court-input":
        objectKey = "court";
        break;

      case "date-input":
        objectKey = "date";
        break;

      case "time-input":
        objectKey = "time";
        break;

      case "firstName-input":
        objectKey = "fname";
        break;

      case "lastName-input":
        objectKey = "lname";
        break;

      case "houseNumber-input":
        objectKey = "hnum";
        break;

      case "phoneNumber-input":
        objectKey = "pnum";
        break;

      case "email-input":
        objectKey = "email";
        break;

      case "guest-input":
        objectKey = "gnum";
        break;

      case "paid-input":
        objectKey = "paid";
        break;

      default:
        break;
    }

    const bookingChanged = Object.assign({}, updatedBooking, {
      [objectKey]:
        objectKey === "paid" ? event.target.checked : event.target.value,
    });

    console.log(JSON.stringify(bookingChanged));
    setUpdatedBooking(bookingChanged);
  }

  function postBooking() {
    const court = selectedRow.booking.court;
    const dateURL = selectedRow.booking.date.replaceAll("/", "%252F");
    const timeURL = selectedRow.booking.time
      .replaceAll(":", "%3A")
      .replaceAll(" ", "%20");

    axios
      .put(url + "/" + court + "/" + dateURL + "/" + timeURL, updatedBooking)
      .then((res) => {
        console.log("Successfully updated the booking");

        // Redundant but allows for the bookings to be updated faster
        let updatedBookings = props.bookings;
        updatedBookings[selectedRow.index] = updatedBooking;

        props.setBookings([...updatedBookings]);
        props.getAllBookings();
        setModalOpen(false);
      })
      .catch((err) => {
        console.error("API Request Error:", err);
      });

  }

  function handleCancel() {
    setModalOpen(false);
  }

  function handleSort(sortBy) {
    var bookings = props.bookings;
    if (sortBy == "Court") {
      for (let i = 0; i < bookings.length; i++) {
        for (let j = 0; j < bookings.length - i - 1; j++) {
          if (bookings[j].court > bookings[j + 1].court) {
            let temp = bookings[j];
            bookings[j] = bookings[j + 1];
            bookings[j + 1] = temp;
          }
        }
      }
    } else if (sortBy == "Date") {
      for (let i = 0; i < bookings.length; i++) {
        for (let j = 0; j < bookings.length - i - 1; j++) {
          if (bookings[j].date > bookings[j + 1].date) {
            let temp = bookings[j];
            bookings[j] = bookings[j + 1];
            bookings[j + 1] = temp;
          }
        }
      }
    } else if (sortBy == "Time") {
      for (let i = 0; i < bookings.length; i++) {
        for (let j = 0; j < bookings.length - i - 1; j++) {
          if (bookings[j].time > bookings[j + 1].time) {
            let temp = bookings[j];
            bookings[j] = bookings[j + 1];
            bookings[j + 1] = temp;
          }
        }
      }
    } else if (sortBy == "Fname") {
      for (let i = 0; i < bookings.length; i++) {
        for (let j = 0; j < bookings.length - i - 1; j++) {
          if (bookings[j].fname > bookings[j + 1].fname) {
            let temp = bookings[j];
            bookings[j] = bookings[j + 1];
            bookings[j + 1] = temp;
          }
        }
      }
    } else if (sortBy == "Lname") {
      for (let i = 0; i < bookings.length; i++) {
        for (let j = 0; j < bookings.length - i - 1; j++) {
          if (bookings[j].lname > bookings[j + 1].lname) {
            let temp = bookings[j];
            bookings[j] = bookings[j + 1];
            bookings[j + 1] = temp;
          }
        }
      }
    } else if (sortBy == "Hnum") {
      for (let i = 0; i < bookings.length; i++) {
        for (let j = 0; j < bookings.length - i - 1; j++) {
          if (bookings[j].hnum > bookings[j + 1].hnum) {
            let temp = bookings[j];
            bookings[j] = bookings[j + 1];
            bookings[j + 1] = temp;
          }
        }
      }
    } else if (sortBy == "Pnum") {
      for (let i = 0; i < bookings.length; i++) {
        for (let j = 0; j < bookings.length - i - 1; j++) {
          if (bookings[j].pnum > bookings[j + 1].pnum) {
            let temp = bookings[j];
            bookings[j] = bookings[j + 1];
            bookings[j + 1] = temp;
          }
        }
      }
    } else if (sortBy == "Email") {
      for (let i = 0; i < bookings.length; i++) {
        for (let j = 0; j < bookings.length - i - 1; j++) {
          if (bookings[j].email > bookings[j + 1].email) {
            let temp = bookings[j];
            bookings[j] = bookings[j + 1];
            bookings[j + 1] = temp;
          }
        }
      }
    } else if (sortBy == "Guest") {
      for (let i = 0; i < bookings.length; i++) {
        for (let j = 0; j < bookings.length - i - 1; j++) {
          if (bookings[j].gnum > bookings[j + 1].gnum) {
            let temp = bookings[j];
            bookings[j] = bookings[j + 1];
            bookings[j + 1] = temp;
          }
        }
      }
    } else if (sortBy == "Paid") {
      for (let i = 0; i < bookings.length; i++) {
        for (let j = 0; j < bookings.length - i - 1; j++) {
          if (bookings[j].paid > bookings[j + 1].paid) {
            let temp = bookings[j];
            bookings[j] = bookings[j + 1];
            bookings[j + 1] = temp;
          }
        }
      }
    }
    props.setBookings([...bookings]);
  }

  return (
    <div className="Bookings">
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th
              onClick={function () {
                handleSort("Court");
              }}
            >
              Court
            </th>
            <th
              onClick={function () {
                handleSort("Date");
              }}
            >
              Date
            </th>
            <th
              onClick={function () {
                handleSort("Time");
              }}
            >
              Time
            </th>
            <th
              onClick={function () {
                handleSort("Fname");
              }}
            >
              First Name
            </th>
            <th
              onClick={function () {
                handleSort("Lname");
              }}
            >
              Last Name
            </th>
            <th
              onClick={function () {
                handleSort("Hnum");
              }}
            >
              House No.
            </th>
            <th
              onClick={function () {
                handleSort("Pnum");
              }}
            >
              Phone No.
            </th>
            <th
              onClick={function () {
                handleSort("Email");
              }}
            >
              Email
            </th>
            <th
              onClick={function () {
                handleSort("Guest");
              }}
            >
              Guest
            </th>
            <th
              onClick={function () {
                handleSort("Paid");
              }}
            >
              Paid Status
            </th>
          </tr>
        </thead>
        <tbody>
          {props.bookings.map(function (booking, index) {
            return (
              <tr
                id={booking.court + "|" + booking.date + "|" + booking.time}
                onDoubleClick={function () {
                  handleDoubleClick(booking, index);
                }}
              >
                <td className="select-td">
                  <input
                    onChange={handleSelect}
                    className="select"
                    type="checkbox"
                    unchecked
                  />
                </td>
                <td className="court-td">
                  <label
                    // onChange={handleChange}
                    className="court booking-info"
                  >
                    {booking.court}
                  </label>
                </td>
                <td className="date-td">
                  <label
                    // onChange={handleChange}
                    className="date booking-info"
                  >
                    {booking.date}
                  </label>
                </td>
                <td className="time-td">
                  <label
                    // onChange={handleChange}
                    className="time booking-info"
                  >
                    {booking.time}
                  </label>
                </td>
                <td className="fname-td">
                  <label
                    // onChange={handleChange}
                    className="fname booking-info"
                  >
                    {booking.fname}
                  </label>
                </td>
                <td className="lname-td">
                  <label
                    // onChange={handleChange}
                    className="lname booking-info"
                    type="text"
                    size="10"
                  >
                    {booking.lname}
                  </label>
                </td>
                <td className="hnum-td">
                  <label
                    // onChange={handleChange}
                    className="hnum booking-info"
                  >
                    {booking.hnum}
                  </label>
                </td>
                <td className="pnum-td">
                  <label
                    // onChange={handleChange}
                    className="pnum booking-info"
                  >
                    {booking.pnum}
                  </label>
                </td>
                <td className="email-td">
                  <label
                    // onChange={handleChange}
                    className="email booking-info"
                  >
                    {booking.email}
                  </label>
                </td>
                <td className="gnum-td">
                  <label
                    // onChange={handleChange}
                    className="gnum booking-info"
                  >
                    {booking.gnum}
                  </label>
                </td>
                <td className="paid-td">
                  {booking.paid ? (
                    <input className="paid" type="checkbox" checked disabled />
                  ) : (
                    <input
                      className="paid"
                      type="checkbox"
                      unchecked
                      disabled
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="booking-options-container">
        <button
          onClick={bookingCreate}
          id="create-booking-btn"
          className="booking-options-btn"
        >
          Create A New Booking
        </button>
        <button
          onClick={bookingDelete}
          id="delete-booking-btn"
          className="booking-options-btn"
        >
          Delete Selected Bookings
        </button>
        <button
          onClick={bookingDeleteAll}
          id="delete-all-booking-btn"
          className="booking-options-btn"
        >
          Delete All Bookings
        </button>
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-form">
            <label id="court-label" className="modal-label">Court: </label>
            <input
              type="text"
              onChange={bookingUpdate}
              id="court-input"
              className="modal-input"
              name="court-input"
              pattern="[A-Za-z]{2,}"
              value={updatedBooking.court}
              size="12"
            />
            <br />
            <label id="date-label" className="modal-label">Date: </label>
            <input
              type="text"
              onChange={bookingUpdate}
              id="date-input"
              className="modal-input"
              name="date-input"
              pattern="[A-Za-z]{2,}"
              value={updatedBooking.date}
              size="11"
            />
            <br />
            <label id="time-label" className="modal-label">Time: </label>
            <input
              type="text"
              onChange={bookingUpdate}
              id="time-input"
              className="modal-input"
              name="time-input"
              pattern="[A-Za-z]{2,}"
              value={updatedBooking.time}
              size="9"
            />
            <br />
            <label id="fname-label" className="modal-label">First Name: </label>
            <input
              type="text"
              onChange={bookingUpdate}
              id="firstName-input"
              className="modal-input"
              name="firstName-input"
              pattern="[A-Za-z]{2,}"
              value={updatedBooking.fname}
              size="10"
            />
            <br />
            <label id="lname-label" className="modal-label">Last Name: </label>
            <input
              type="text"
              onChange={bookingUpdate}
              id="lastName-input"
              className="modal-input"
              name="lastName-input"
              pattern="[A-Za-z]{2,}"
              value={updatedBooking.lname}
              size="10"
            />
            <br />
            <label id="hnum-label" className="modal-label">House No.: </label>
            <input
              type="text"
              onChange={bookingUpdate}
              id="houseNumber-input"
              className="modal-input"
              name="houseNumber-input"
              pattern="[A-Z]-[0-9]{3,4}"
              value={updatedBooking.hnum}
              size="7"
            />
            <br />
            <label id="pnum-label" className="modal-label">Phone No.: </label>
            <input
              type="tel"
              onChange={bookingUpdate}
              id="phoneNumber-input"
              className="modal-input"
              name="phoneNumber-input"
              pattern="[0-9]{10}"
              value={updatedBooking.pnum}
              size="11"
            />
            <br />
            <label id="email-label" className="modal-label">Email: </label>
            <input
              type="email"
              onChange={bookingUpdate}
              id="email-input"
              className="modal-input"
              name="email-input"
              value={updatedBooking.email}
              size="10"
            />
            <br />
            <label id="guest-label" className="modal-label">Guest: </label>
            <input
              type="number"
              onChange={bookingUpdate}
              id="guest-input"
              className="modal-input"
              name="guest-input"
              min="0"
              value={updatedBooking.gnum}
              style={{ width: 2 + "em" }}
            />
            <br />
            <label id="paid-label" className="modal-label">Paid: </label>
            {updatedBooking.paid ? (
              <input
                type="checkbox"
                onChange={bookingUpdate}
                id="paid-input"
                className="modal-input"
                name="paid-input"
                checked
              />
            ) : (
              <input
                type="checkbox"
                onChange={bookingUpdate}
                id="paid-input"
                className="modal-input"
                name="paid-input"
                unchecked
              />
            )}
            <br />
            <button
              id="update-btn"
              className="modal-options-btn"
              type="button"
              onClick={postBooking}
            >
              Update
            </button>
            <button
              id="cancel-btn"
              className="modal-options-btn"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
