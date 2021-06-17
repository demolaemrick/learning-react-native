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
			console.log('err', error);
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
			console.log('err', error);
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
	createUser: async (context, payload) => {
		const url = 'admin/user/new';
		console.log(payload);
		try {
			const response = await api.post(url, payload);
			// const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	search: async (context, searchdata) => {
		const url = `admin/search/users?q=${searchdata}`;
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
