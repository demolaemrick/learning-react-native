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
		const url = 'research/enrichment/data';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	enrichmentHistory: async ({ commit }, query) => {
		const urlParams = new URLSearchParams(query);
		let url = `enrichment/history?${urlParams.toString()}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	enrichedData: async ({ commit }, query) => {
		const urlParams = new URLSearchParams(query);
		console.log('paramsid===', urlParams);
		let url = `enrichment/history/data?${urlParams.id}`;
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
