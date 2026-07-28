import { Zernio } from '@zernio/node';
import dotenv from 'dotenv';
dotenv.config();

const zernio = new Zernio({
    apiKey: process.env.ZERNIO_API_KEY,
    baseURL: "https://zernio.com/api",
});

export default zernio;