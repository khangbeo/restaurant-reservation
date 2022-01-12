import React, { useEffect, useState } from 'react'
import { listTables, updateTable } from '../utils/api'
import { useHistory, useParams } from 'react-router'
import ErrorAlert from '../layout/ErrorAlert'

export default function ReservationSeats() {
    const [tables, setTables] = useState([])
    const [selectOptions, setSelectOptions] = useState('')
    const [error, setError] = useState(null)
    const { reservationId } = useParams()
    const history = useHistory()
    useEffect(() => {
        const abortController = new AbortController();
        setError(null);
        async function loadTables() {
            try {
                const response = await listTables(abortController.signal)
                setTables(response)
            } catch (error) {
                setError(error)
            }
        }
        loadTables()
        return () => abortController.abort();
    }, [])

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
            <ErrorAlert error={error} />
            <h1>Seat Reservation</h1>

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
                <button type='submit'>Submit</button>
                <button onClick={history.goBack}>Cancel</button>
            </form>
        </div>
    )
}