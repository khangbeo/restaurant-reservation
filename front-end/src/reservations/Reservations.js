import React from "react"
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

export default function Reservations({ reservations }) {
    return (
        <div className="container">
            {reservations.map(reservation => (
                <>
                    {reservation.status !== 'finished' && (
                        <div>
                            <h2>Name: {reservation.first_name} {reservation.last_name}</h2><hr />
                            <p>Mobile Number: {reservation.mobile_number}</p>
                            <p>Reservation Date: {dayjs(reservation.reservation_date).format('MM/DD/YYYY')}</p>
                            <p>Reservation Time: {dayjs(reservation.reservation_date + reservation.reservation_time).format('hh:mm A')}</p>
                            <p>People: {reservation.people}</p>
                            <p data-reservation-id-status={`${reservation.reservation_id}`}>Status: {reservation.status}</p>
                            <div>
                                {reservation.status === 'booked' && (
                                    <a href={`/reservations/${reservation.reservation_id}/seat`}>
                                        Seat
                                    </a>
                                )}

                            </div>
                        </div>
                    )
                    }
                </>
            ))}
        </div>
    )
}