import axios from 'axios';
const instance = axios.create({
	baseURL: `${process.env.VUE_APP_VOLLEY_API_URL}`,
	timeout: 300000,
	headers: {},
	crossdomain: true
});

//Set the global number of requests in main.js, the gap between requests
instance.defaults.retry = 4;
instance.defaults.retryDelay = 1000;

//In the API file
instance.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
	var config = err.config;
	// If config does not exist or the retry option is not set, reject
	if (!config || !config.retry) return Promise.reject(err);

	// Set the variable for keeping track of the retry count
	config.__retryCount = config.__retryCount || 0;

	// Check if we've maxed out the total number of retries
	if (config.__retryCount >= config.retry) {
		// Reject with the error
		return Promise.reject(err);
	}

	// Increase the retry count
	config.__retryCount += 1;

	// Create new promise to handle exponential backoff
	var backoff = new Promise(function (resolve) {
		setTimeout(function () {
			resolve();
		}, config.retryDelay || 1);
	});

	// Return the promise in which recalls axios to retry the request
	return backoff.then(function () {
		return axios(config);
	});
});

// instance.interceptors.request.use((config) => {
// 	NProgress.start();
// 	return config;
// });

// instance.interceptors.response.use(
// 	(response) => {
// 		NProgress.done();
// 		return response;
// 	},
// 	(error) => {
// 		NProgress.done();
// 		if (error.code === 'ECONNABORTED') {
// 			// TODO: Add toast message

// 			return error;
// 		}
// 		// eslint-disable-next-line no-underscore-dangle
// 		// if (error.response.status === 401 && err.config && !err.config.__isRetryRequest) {
// 		// 	// TODO: do logout and route to login page
// 		// 	// router.push('/auth/login');
// 		// 	return Promise.reject(error);
// 		// }
// 		// if (error.response.status === 500) {
// 		// 	error.response.data.message = 'Something went wrong, Please try again!';
// 		// }
// 		return Promise.reject(error);
// 	}
// );

export default instance;
