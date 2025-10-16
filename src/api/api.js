import axios from 'axios';

const API_BASE = "https://apis.allsoft.co/api/documentManagement"

export const api = axios.create({
    baseURL: API_BASE,
})

export const generateOTP = (mobileNumber) => {
    api.post('/generateOTP', { mobileNumber })
}

export const verifyOTP = (mobileNumber, otp) => {
    api.post('/validateOTP', { mobileNumber, otp })
}