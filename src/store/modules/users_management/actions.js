import api from '../../../services/api/index';
export default {
	/**
	 * @param {Object} data - service payload
	 */

	allUsers: async ({ commit }, { page, limit }) => {
		const url = `admin/users?page=${page}&limit=${limit}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	singleUser: async ({ commit }, userId) => {
		const url = `admin/user/${userId}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	deactivateUser: async ({ commit }, userId) => {
		const url = `admin/user/${userId}/deactivate`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.patch(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	activateUser: async (context, userId) => {
		const url = `admin/user/${userId}/activate`;
		try {
			const response = await api.patch(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	suspendUser: async (context, userId) => {
		const url = `admin/user/${userId}/suspend`;
		try {
			const response = await api.patch(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	research_history: async ({ commit }, { id, page, limit }) => {
		const url = `admin/user/${id}/history?page=${page}&limit=${limit}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	bulk_research: async ({ commit }, { id, contacts }) => {
		const url = `admin/user/${id}/bulk-research`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, contacts);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	updateUser: async ({ commit }, { id, user }) => {
		const url = `admin/user/${id}/edit-profile`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.put(url, user);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	settings: async ({ commit }, { userId, data }) => {
		const url = `admin/user/${userId}/settings`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.patch(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	search: async (context, queries) => {
		const urlParams = new URLSearchParams(queries);
		let url = `admin/search?role=user&${urlParams.toString()}`;
		// Object.keys(queries).forEach((key) => {
		// 	url += `${key}=${encodeURIComponent(queries[key])}&`;
		// });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	getSettings: async ({ commit }, userId) => {
		const url = `admin/user/${userId}/settings`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	createUser: async (context, payload) => {
		const url = 'admin/user/new';
		try {
			const response = await api.post(url, payload);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	fetchApiKeys: async (context, id) => {
		const url = `admin/user/${id}/api-keys`;
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	activateKey: async (context, { userId, id }) => {
		const url = `admin/user/${userId}/api-key/activate`;
		try {
			const response = await api.put(url, { id: id });
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	deactivateKey: async (context, { userId, id }) => {
		const url = `admin/user/${userId}/api-key/deactivate`;
		try {
			const response = await api.put(url, { id: id });
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	deleteKey: async (context, { userId, id }) => {
		const url = `admin/user/${userId}/api-key/delete`;
		try {
			const response = await api.delete(url, { id: id });
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	toggleArticle: async (context, { data, hide }) => {
		const url = hide ? 'admin/user/research/hide/article' : 'admin/user/research/unhide/article';
		try {
			const response = hide ? await api.put(url, data) : await api.delete(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	toggleImportance: async (context, { data, important }) => {
		const url = important ? 'admin/user/research/article/rank-relevant' : 'admin/user/research/article/derank-relevant';
		try {
			const response = important ? await api.put(url, data) : await api.delete(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	}
};