import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { previous, next, today } from "../utils/date-time"
import { useHistory } from "react-router";
import Reservations from "../reservations/Reservations";
import TableList from "../tables/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const query = useQuery()
  const history = useHistory()
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([])
  const [date, setDate] = useState(query.get("date") || today())

  useEffect(loadDashboard, [date])
  useEffect(loadTables, [])

  function loadTables() {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);
    return () => abortController.abort();
  }

  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  function handleDateChange({ target }) {
    setDate(target.value)
  }

  function handlePreviousDate() {
    setDate(previous(date))
    history.push(`dashboard?date=${previous(date)}`)
  }
  function handleNextDate() {
    setDate(next(date))
    history.push(`dashboard?date=${next(date)}`)
  }
  return (
    <main>
      <div className="dashboard-header text-center">
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3 flex-column align-items-center">
          <h4 className="mb-0">Reservations for date</h4>

          <div>
            <label htmlFor="reservation_date" className="form-label mt-3 mr-2">
              Search for a date:
            </label>
            <input
              type="date"
              pattern="\d{4}-\d{2}-\d{2}"
              name="reservation_date"
              onChange={handleDateChange}
              value={date}
            />
          </div>

          <div className="buttons">
            <button
              className="btn btn-primary mb-4 mr-3"
              onClick={() => handlePreviousDate(date)}
            >
              Previous
            </button>
            <button
              className="btn btn-primary mb-4 mr-3"
              onClick={() => setDate(today())}
            >
              Today
            </button>
            <button
              className="btn btn-primary mb-4 mr-3"
              onClick={() => handleNextDate(date)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ErrorAlert error={error} />
      <Reservations reservations={reservations} />
      <TableList tables={tables} />

    </main>
  );
}

export default Dashboard;
