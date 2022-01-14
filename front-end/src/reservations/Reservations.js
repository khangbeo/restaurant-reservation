import React, { useState } from "react"
import { useHistory } from "react-router"
import ErrorAlert from "../layout/ErrorAlert"
import { cancelReservation } from "../utils/api"
import './Reservation.css'

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
        <div className="container d-flex justify-content-center flex-wrap">
            <ErrorAlert error={error} />
            {reservations.map(reservation => (
                <div className="card m-4 text-white" key={reservation.reservation_id}>
                    {(reservation.status !== 'finished' && reservation.status !== 'cancelled') && (
                        <div className="bg-success">
                            <div className="card-body fw-bold text-center">
                                <p>First Name: {reservation.first_name}</p>
                                <p>Last Name: {reservation.last_name}</p>
                                <p>Mobile Number: {reservation.mobile_number}</p>
                                <p>Reservation Date: {dayjs(reservation.reservation_date).format('MM/DD/YYYY')}</p>
                                <p>Reservation Time: {dayjs(reservation.reservation_date).format('hh:mm A')}</p>
                                <p>People: {reservation.people}</p>
                                <p data-reservation-id-status={`${reservation.reservation_id}`}>Status: {reservation.status}</p>
                                <div>
                                    <a
                                        className="btn btn-dark mx-1 rounded-pill shadow-none"
                                        href={`/reservations/${reservation.reservation_id}/edit`}>
                                        Edit
                                    </a>
                                    {reservation.status === 'booked' && (
                                        <a
                                            className="btn btn-dark mx-3 rounded-pill shadow-none"
                                            href={`/reservations/${reservation.reservation_id}/seat`}>
                                            Seat
                                        </a>
                                    )}
                                    <button
                                        className="btn btn-dark mx-1 rounded-pill shadow-none"
                                        onClick={() => handleCancel(reservation.reservation_id)} data-reservation-id-cancel={reservation.reservation_id}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
