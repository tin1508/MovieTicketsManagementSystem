import axios from 'axios';

const API_PAYMENT_URL = 'http://localhost:8080/api/v1/payments';

export const createPayment = (payment) => axios.post(API_PAYMENT_URL, payment);
export const listPayments = () => axios.get(API_PAYMENT_URL);