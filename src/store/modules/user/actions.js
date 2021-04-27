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
	getBookmarks: async ({ commit}) => {
		const url = 'research/bookmark';
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
	getNote: async ({ commit}, payload) => {
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
};
