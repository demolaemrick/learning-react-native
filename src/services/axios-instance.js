import axios from 'axios';
import NProgress from 'nprogress';
const instance = axios.create({
	baseURL: `${process.env.VUE_APP_AQ_API_URL}`,
	timeout: 36000,
	headers: {},
	crossdomain: true
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
