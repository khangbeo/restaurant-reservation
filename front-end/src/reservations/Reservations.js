import React, { useState } from "react"
import { useHistory } from "react-router"
import ErrorAlert from "../layout/ErrorAlert"
import { cancelReservation } from "../utils/api"
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

export default function Reservations({ reservations }) {
    const [error, setError] = useState(null)
    const history = useHistory()

    async function handleCancel(reservationId) {
        if (window.confirm('Do you want to cancel this reservation? This cannot be undone.')) {
            try {
                await cancelReservation(reservationId)
                history.go()
            } catch (error) {
                setError(error)
            }
        }
    }
    return (
        <div className="container">
            <ErrorAlert error={error} />
            {reservations.map(reservation => (
                <div key={reservation.reservation_id}>
                    {(reservation.status !== 'finished' && reservation.status !== 'cancelled') && (
                        <>
                            <h2>Name: {reservation.first_name} {reservation.last_name}</h2><hr />
                            <p>Mobile Number: {reservation.mobile_number}</p>
                            <p>Reservation Date: {dayjs(reservation.reservation_date).format('MM/DD/YYYY')}</p>
                            <p>Reservation Time: {dayjs(reservation.reservation_date + reservation.reservation_time).format('hh:mm A')}</p>
                            <p>People: {reservation.people}</p>
                            <p data-reservation-id-status={`${reservation.reservation_id}`}>Status: {reservation.status}</p>
                            <div>
                                <a href={`/reservations/${reservation.reservation_id}/edit`}>
                                    Edit
                                </a>
                                {reservation.status === 'booked' && (
                                    <a href={`/reservations/${reservation.reservation_id}/seat`}>
                                        Seat
                                    </a>
                                )}
                                <button onClick={() => handleCancel(reservation.reservation_id)} data-reservation-id-cancel={reservation.reservation_id}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}