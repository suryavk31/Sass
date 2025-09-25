import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

// Apply cookie jar support to axios
wrapper(axios);

// Create a new cookie jar instance
const cookieJar = new CookieJar();

const axiosInstance = axios.create({
    withCredentials: true,
    jar: cookieJar, // Attach the cookie jar to the axios instance
    baseURL: 'http://localhost:5000/api', // replace with your API base URL
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;
