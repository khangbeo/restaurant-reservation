import React, { useState } from "react";
import { createReservations } from "../utils/api";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

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
            const response = await createReservations({ ...formData }, controller.signal)
            history.push(`/dashboard?date=${formData.reservation_date}`)
            return response
        } catch (error) {
            setError(error)
        }
    }

    return (
        <>
            <h2>New Reservation</h2>
            <ErrorAlert error={error} />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type='text'
                        className='form-control'
                        id='first_name'
                        name='first_name'
                        placeholder='First Name'
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type='text'
                        className='form-control'
                        id='last_name'
                        name='last_name'
                        placeholder='Last Name'
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mobile_number">Mobile Number</label>
                    <input
                        type='tel'
                        className='form-control'
                        id='mobile_number'
                        name='mobile_number'
                        placeholder='123-456-7890'
                        value={formData.mobile_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_date">Reservation Date</label>
                    <input
                        type='date'
                        className='form-control'
                        id='reservation_date'
                        name='reservation_date'
                        pattern='\d{4}-\d{2}-\d{2}'
                        value={formData.reservation_date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_time">Reservation Time</label>
                    <input
                        type='time'
                        className='form-control'
                        id='reservation_time'
                        name='reservation_time'
                        pattern='[0-9]{2}:[0-9]{2}'
                        value={formData.reservation_time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="people">Party Size</label>
                    <input
                        type='number'
                        className='form-control'
                        id='people'
                        name='people'
                        min={1}
                        placeholder="1"
                        value={formData.people}
                        onChange={handleNumber}
                        required
                    />
                </div>
                <button type='submit' className="btn btn-primary mb-4 mr-3">
                    Submit
                </button>
                <button onClick={history.goBack} className="btn btn-warning mb-4">
                    Cancel
                </button>
            </form>
        </>
    )
}