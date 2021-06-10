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
	}
};
