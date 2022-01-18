import React, { useState } from "react";
import { createReservations } from "../utils/api";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

export default function NewReservation() {
    const initialFormState = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: '',
    }

    const history = useHistory()
    const [formData, setFormData] = useState({ ...initialFormState })
    const [error, setError] = useState(null)

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
            const response = await createReservations(formData, controller.signal)
            history.push(`/dashboard?date=${formData.reservation_date}`)
            return response
        } catch (error) {
            setError(error)
        }
        return () => controller.abort()
    }

    return (
        <div className="m-4">
            <h2>New Reservation</h2>
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
