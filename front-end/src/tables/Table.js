import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import ErrorAlert from '../layout/ErrorAlert'
import { listReservations } from '../utils/api'
import { deleteTable } from '../utils/api'

export default function Table({ table, index }) {
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null)
    const history = useHistory()

    useEffect(() => {
        listReservations().then(setReservations)
    }, [])
    function handleFinish(tableId) {
        if (window.confirm('Is this table ready to seat new guests?')) {
            deleteTable(tableId)
                .then(history.go())
                .catch(setError)
        }
    }

    const foundRes = reservations.find(res => Number(table.reservation_id) === Number(res.reservation_id))
    return (
        <div className='card bg-success w-50'>
            <div className='card-body fw-bold text-center text-white m-4' key={index}>
                <ErrorAlert error={error} />
                <div>
                    <h2>Table Name: {table.table_name}</h2><hr />
                    <p>Capacity: {table.capacity}</p>
                    <p data-table-id-status={`${table.table_id}`}>Status: {table.reservation_id ? 'Occupied by ' : 'Free'}</p>
                    {foundRes && (
                        <p>{foundRes.first_name} {foundRes.last_name}</p>
                    )}
                    {table.reservation_id && (
                        <button className="btn btn-dark mx-1 rounded-pill shadow-none" type='submit' data-table-id-finish={`${table.table_id}`} onClick={() => handleFinish(table.table_id)}>Finish</button>
                    )
                    }
                </div>
            </div>
        </div>
    )
}