import api from '../../../services/api/index';

export default {
	/**
	 * Handles data enrichment
	 * @param {Object} data - new data enrichment payload
	 */
	addNewDataEnrichment: async ({ commit }, data) => {
		const url = 'research/data/enrichment';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	getFieldsData: async ({ commit }) => {
		const url = 'research/data/enrichment';
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
