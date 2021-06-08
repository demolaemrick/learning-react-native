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
	}
};
