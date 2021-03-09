import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import search_services from './modules/search_services/index';
Vue.use(Vuex);

const vuexPersistence = new VuexPersistence({
	storage: window.localStorage
});

const initialAlertState = {
	status: '',
	title: '',
	message: '',
	showAlert: false
};

export default new Vuex.Store({
	state: {
		status: '',
		errorLog: {},
		alert: initialAlertState
	},
	getters: {
		getStatus: (state) => state.status,
		getErrorLog: (state) => state.errorLog,
		getAlert: (state) => state.alert
	},
	mutations: {
		reqInit: (state) => {
			state.status = 'loading';
		},
		reqSuccess: (state) => {
			state.status = 'success';
		},
		reqError: (state) => {
			state.status = 'error';
		},
		resetReq: (state) => {
			state.status = '';
			state.errorLog = {};
		},
		logError: (state, data) => {
			state.status = 'error';
			state.errorLog = data;
		},

		updateAlert: (state, data) => {
			if (!data.showAlert) {
				state.alert = initialAlertState;
				return;
			}

			state.alert = { ...initialAlertState, ...data };
		},
		resetAlert: (state) => {
			state.alert = initialAlertState;
		}
	},
	actions: {
		showAlert: ({ commit }, data) => {
			commit('updateAlert', data);

			setTimeout(() => {
				commit('resetAlert');
			}, 7000);
		}
	},
	modules: {
		search_services
	},
	plugins: [vuexPersistence.plugin]
});
