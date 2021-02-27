import api from '../../../services/api/index';
import axios from '../../../services/axios-instance';

export default {
	/**
	 * @param {Object} data - service payload
	 */

	verifyServices: async ({ commit, getters }, data) => {
		axios.defaults.headers.common['x-api-key'] = getters.getApiKey;
		const url = '/verify';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	recentTransaction: async ({ commit }) => {
		const url = 'overview/count/recent';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
