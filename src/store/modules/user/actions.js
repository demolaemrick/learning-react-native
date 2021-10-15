import api from '../../../services/api/index';
export default {
	/**
	 * @param {Object} data - user payload
	 */

	settings: async ({ commit }, data) => {
		const url = 'user/options/settings';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	getSettings: async ({ commit }) => {
		const url = 'user/options/settings';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	getBookmarks: async ({ commit }, id) => {
		let url;
		id ? (url = `research/bookmark/${id}`) : (url = 'research/bookmark');
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	addToBookmarks: async ({ commit }, payload) => {
		const url = 'research/bookmark';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, payload);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	removeFromBookmarks: async ({ commit }, payload) => {
		const url = 'research/bookmark';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.delete(url, payload);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	getNote: async ({ commit }, payload) => {
		const url = `note/${payload}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	updateNote: async ({ commit }, payload) => {
		const url = 'note';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, payload);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	fetchApiKeys: async () => {
		const url = 'user/api-keys';
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	generateApiKey: async () => {
		const url = 'user/api-key/generate';
		try {
			const response = await api.post(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	regenerateApiKey: async (context, id) => {
		const url = 'user/api-key/generate';
		try {
			const response = await api.post(url, id);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	generateHooks: async (context, payload) => {
		const url = 'ai/generate-mail-hook';
		try {
			const response = await api.post(url, payload);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	fetchHooks: async (context, { rowId, url: articleUrl }) => {
		const url = `ai/retrieve-mail-hook/${rowId}`;
		try {
			const response = await api.get(url, { params: { url: articleUrl } });

			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	deleteEmailHook: async (context, id) => {
		const url = `ai/delete-mail-hook/${id}`;
		try {
			const response = await api.delete(url);

			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	editEmailHook: async (context, { id, hook, subject }) => {
		const url = `ai/edit-mail-hook/${id}`;
		try {
			const response = await api.put(url, { hook, subject });

			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	createEmailHook: async (context, payload) => {
		const url = '/ai/add-mail-hook';
		try {
			const response = await api.post(url, payload);

			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	fetchArticlesWithEmailHook: async (context, rowId) => {
		const url = `/ai/mail-articles/${rowId}`;
		try {
			const response = await api.get(url);

			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
