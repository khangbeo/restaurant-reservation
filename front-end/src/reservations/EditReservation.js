import React, { useState, useEffect } from "react";
import { readReservation, updateReservation } from "../utils/api";
import { useParams, useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";
const dayjs = require('dayjs')

export default function EditReservation() {
    const initialFormState = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: '',
    }
    const { reservationId } = useParams()
    const history = useHistory()
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({ ...initialFormState })
    useEffect(() => {
        const abortController = new AbortController()
        async function getData() {
            try {
                if (reservationId) {
                    const response = await readReservation(reservationId, abortController.signal)
                    setFormData(response)
                } else {
                    setFormData({ ...initialFormState })
                }
            } catch (error) {
                setError(error)
            }
        }
        getData()
        return () => abortController.abort();
        // eslint-disable-next-line
    }, [reservationId]);

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
    }

    const handleNumber = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: Number(target.value)
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const controller = new AbortController()
        try {
            const response = await updateReservation(formData, controller.signal)
            history.push(`/dashboard?date=${dayjs(formData.reservation_date).format('YYYY-MM-DD')}`)
            return response
        } catch (error) {
            setError(error)
        }
        return () => controller.abort()
    }

    return (
        <div className="m-4">
            <h2>Edit Reservation</h2>
            <ErrorAlert error={error} />
            <ReservationForm
                handleSubmit={handleSubmit}
                handleNumber={handleNumber}
                handleChange={handleChange}
                formData={formData}
                history={history}
            />
        </div>
    )
}