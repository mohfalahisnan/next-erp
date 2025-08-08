import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000, // 10 seconds
});

// Add request interceptor
api.interceptors.request.use(
	(config) => {
		// You can modify request config here (e.g., add auth tokens)
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default api;
