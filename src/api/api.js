import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.API_BASE,
})

export const generateOTP = (mobileNumber) => {
    api.post('/generateOTP', { mobileNumber })
}

export const verifyOTP = (mobileNumber, otp) => {
    api.post('/validateOTP', { mobileNumber, otp })
}