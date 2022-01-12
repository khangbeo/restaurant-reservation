import React, { useEffect, useState } from 'react'
import { listTables, updateTable } from '../utils/api'
import { useHistory, useParams } from 'react-router'
import ErrorAlert from '../layout/ErrorAlert'

export default function ReservationSeats() {
    const [tables, setTables] = useState([])
    const [selectOptions, setSelectOptions] = useState('')
    const [error, setError] = useState(null)
    const { reservationId } = useParams()
    console.log(reservationId)
    const history = useHistory()
    useEffect(loadTables, [])

    function loadTables() {
        const abortController = new AbortController();
        setError(null);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setError);
        return () => abortController.abort();
    }

    function changeHandler({ target }) {
        setSelectOptions({ [target.name]: target.value })
    }

    function handleSubmit(event) {
        event.preventDefault()
        const abortController = new AbortController()
        updateTable(reservationId, Number(selectOptions.table_id), abortController.signal)
            .then(() => history.push('/dashboard'))
            .catch(setError)

        return () => abortController.abort()
    }
    return (
        <div>
            <h1>Seat Reservation</h1>
            <ErrorAlert error={error} />

            <form onSubmit={handleSubmit}>
                <h2>Table name - Table capacity</h2>
                {tables && (
                    <div>
                        <select name='table_id' required onChange={changeHandler}>
                            <option value=''>Choose a Table</option>
                            {tables.map(table => (
                                <option value={table.table_id} key={table.table_id}>
                                    {table.table_name} - {table.capacity}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <button onClick={history.goBack}>Cancel</button>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}