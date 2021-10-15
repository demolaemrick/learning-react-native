import api from '../../../services/api/index';
export default {
	/**
	 * @param {Object} data - invite payload
	 */

	adminInvite: async ({ commit }, data) => {
		const url = 'admin/invite';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	processAdminInvite: async ({ commit }, data) => {
		const url = 'admin/invite/process';
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	allAdmins: async ({ commit }, { page, limit }) => {
		const url = `admin?page=${page}&limit=${limit}`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	updateAdmin: async ({ commit }, { id, admin }) => {
		const url = `admin/${id}/edit-profile`;
		commit('resetReq', null, { root: true });
		commit('reqInit', null, { root: true });
		try {
			const response = await api.put(url, admin);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	deactivateAdmin: async (context, adminId) => {
		const url = `admin/${adminId}/deactivate`;
		try {
			const response = await api.patch(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	activateAdmin: async (context, adminId) => {
		const url = `admin/${adminId}/activate`;
		try {
			const response = await api.patch(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	suspendAdmin: async (context, adminId) => {
		const url = `admin/${adminId}/suspend`;
		try {
			const response = await api.patch(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	adminSearch: async (context, queries) => {
		let url = 'admin/search?role=admin&';
		Object.keys(queries).forEach((key) => {
			url += `${key}=${encodeURIComponent(queries[key])}&`;
		});
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	adminPermissions: async (context, { type }) => {
		const url = `admin/permissions?type=${type}`;
		try {
			const response = await api.get(url);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	saveAdminPermissions: async (context, data) => {
		const url = 'admin/grant-permission';
		try {
			const response = await api.post(url, data);
			return Promise.resolve(response);
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
