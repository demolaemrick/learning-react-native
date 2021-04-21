import api from '../../../services/api/index';
export default {
	/**
	 * @param {Object} data - service payload
	 */

	research: async ({ commit }, data) => {
		// const url = 'research';
		const url = 'research/single-research';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			console.log('err', error);
			return Promise.reject(error);
		}
	},
	content: async ({ commit }, data) => {
		const url = 'content';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
