import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import search_services from './modules/search_services/index';
import auth from './modules/auth/index';
import user from './modules/user/index';
import users_management from './modules/users_management/';
import admin_management from './modules/admin_management/';
Vue.use(Vuex);

const modules = {
	search_services,
	auth,
	user,
	users_management,
	admin_management
};

const vuexPersistence = new VuexPersistence({
	storage: window.localStorage,
	// we won't persist state from "search_services"
	// because research results can come as large as 5MB
	modules: Object.keys(modules).filter((module) => module !== 'search_services')
});

const initialAlertState = {
	status: '',
	title: '',
	message: '',
	showAlert: false
};

let alertTimeout;

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
			clearTimeout(alertTimeout);
			commit('updateAlert', data);
			alertTimeout = setTimeout(() => {
				commit('resetAlert');
			}, 3000);
		}
	},
	modules,
	plugins: [vuexPersistence.plugin],
	strict: process.env.NODE_ENV !== 'production'
});
