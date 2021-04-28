import axios from 'axios';
import NProgress from 'nprogress';
const instance = axios.create({
	baseURL: `${process.env.VUE_APP_VOLLEY_API_URL}`,
	timeout: 120000,
	headers: {},
	crossdomain: true
	// headers: {
	// 	"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwN2VhMWJmOTY1YmJlNjQxNGMwMGIxMyIsImVtYWlsIjoiYWJhc3NAZW55YXRhLmNvbSIsImlhdCI6MTYxOTAwMTczNSwiZXhwIjoxNjE5MDA4OTM1fQ.HidmWQTJoAnzdxHpc_K41hPIz0Tvwi22QdHIqcF-kr8"
	// }
});

instance.interceptors.request.use((config) => {
	NProgress.start();
	return config;
});

instance.interceptors.response.use(
	(response) => {
		NProgress.done();
		return response;
	},
	(error) => {
		NProgress.done();
		if (error.code === 'ECONNABORTED') {
			// TODO: Add toast message

			return error;
		}
		// eslint-disable-next-line no-underscore-dangle
		if (error.response.status === 401 && err.config && !err.config.__isRetryRequest) {
			// TODO: do logout and route to login page
			// router.push('/auth/login');
		}
		if (error.response.status === 500) {
			error.response.data.message = 'Something went wrong, Please try again!';
		}
		return Promise.reject(error);
	}
);

export default instance;
