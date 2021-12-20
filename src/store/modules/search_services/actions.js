import api from '../../../services/api/index';
export default {
	/**
	 * @param {Object} data - service payload
	 */

	research: async ({ commit }, data) => {
		const url = 'research/single';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	researchSuggestions: async ({ commit }, query) => {
		console.log('query', query);
		let url = `research/suggestions?name=${query}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
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
	},
	bulk_research: async ({ commit }, data) => {
		const url = 'research/bulk-research';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	research_history: async ({ commit }, query) => {
		const urlParams = new URLSearchParams(query);
		let url = `research/history?${urlParams.toString()}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	researchedResult: async ({ commit }, { id, isFromAdmin }) => {
		const url = !isFromAdmin ? `research/single/${id}` : `admin/user/research/single/${id}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	subscribeResearch: async ({ commit }) => {
		const url = 'research/subscribe';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	export_history: async ({ commit }, data) => {
		const url = data ? 'research/export' : 'research/export-all';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	researchDone: async ({ commit }, data) => {
		const url = `research/done/${data}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.put(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	deleteSingleResearch: async ({ commit }, data) => {
		const url = data.id ? `research/single/${data.id}` : 'research/bulk-delete';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.delete(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	refresh: async ({ commit }, { id, userId }) => {
		const url = `research/refresh/${id}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		// console.table({ id, userId });
		try {
			const response = await api.post(url, { userId });
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	dislike: async ({ commit }, data) => {
		const url = `research/dislike/${data.rowId}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, { url: data.url, comment: data.comment });
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	addQuoteBookmark: async (context, payload) => {
		const url = 'research/bookmark-quote';
		try {
			const response = await api.post(url, payload);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	removeQuoteBookmark: async (context, payload) => {
		const url = 'research/bookmark-quote';
		try {
			const response = await api.delete(url, payload);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	dislikeQuote: async (context, payload) => {
		const url = 'research/quote/dislike';
		try {
			const response = await api.post(url, payload);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	removeQuoteDislike: async (context, payload) => {
		const url = 'research/quote/dislike';
		try {
			const response = await api.delete(url, payload);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	addArticleURL: async (context, payload) => {
		const url = 'admin/user/research/add/article';
		try {
			const response = await api.put(url, payload);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
