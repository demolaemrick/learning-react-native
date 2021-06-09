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
	}
};
