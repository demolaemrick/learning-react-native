import api from '../../../services/api/index';

export default {
	/**
	 * Handles data enrichment
	 * @param {Object} data - new data enrichment payload
	 */
	addNewDataEnrichment: async ({ commit }, data) => {
		const url = 'data-research/single';
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
		const url = 'data-research/fields';
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
		let url = `data-research/history?${urlParams.toString()}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	getSingleResearch: async ({ commit }, rowId) => {
		let url = `data-research/single/${rowId}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	exportDataEnrichmentsHistory: async ({ commit }, data) => {
		const url = data ? 'data-research/export' : 'data-research/export-all';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	deleteEnrichmentData: async ({ commit }, data) => {
		const url = data.id ? `data-research/single/${data.id}` : 'data-research/bulk-delete';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.delete(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
