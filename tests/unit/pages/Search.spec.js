import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { mount, createLocalVue } from '@vue/test-utils';
import Search from '@/views/Search/Search.vue';
import { nextTick } from 'vue';
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
const request = {
	company: '',
	company_research: {
		ipo: [],
		job_postings: [],
		mergers_and_acquisitions: [],
		product_launch: []
	},
	contact_research: {
		awards: [],
		blogs: [],
		events: [],
		features: [],
		linkedin_activity: [],
		podcasts: [],
		promotion: [],
		twitter_activity: [],
		videos: []
	},
	full_name: '',
	role: ''
};
const event = {
	target: {
		checked: true
	}
};
describe('Search.vue', () => {
	let wrapper;
	let $store;
	let store;
	beforeEach(() => {
		store = new Vuex.Store({
			dispatch: jest.fn(() =>
				Promise.resolve({
					data: {}
				})
			),
			getters: {
				//'search_services/getPayload': (state) => state.searchPayload,
				'auth/getLoggedUser': (state) => state.userDetails
			},
			state: {
				searchPayload: request,
				isLoggedIn: false,
				loggedUser: {},
				userDetails: {
					is_settings: false
				}
			},
			actions: {
				'user/getSettings': jest.fn(() =>
					Promise.resolve({
						data: {
							company: 'Tesla',
							company_research: {},
							contact_research: {},
							full_name: 'Elon Musk',
							research_score: 0.6100000000000001,
							role: 'CEO',
							rowId: '7d775349-d346-4149-8f8f-009559d4c059',
							socials: [],
							status: {},
							userId: '607ea1bf965bbe6414c00b13'
						}
					})
				),
				showAlert: jest.fn()
			},
			mutations: {
				'search_services/saveSearchPayload': (state, data) => {
					state.searchPayload = data;
				},
				'auth/logout': (state) => {
					state.loggedUser = {};
					state.isLoggedIn = false;
				}
			}
		});
		const router = new VueRouter({ routes: [{ path: '/', name: 'Search', meta: {} }] });
		wrapper = mount(Search, {
			localVue,
			router,
			store,
			mocks: {
				$store
			}
		});
	});

	test('Render without errors', () => {
		expect(wrapper.isVueInstance).toBeTruthy();
	});
	test('call onChildUpdate function', () => {
		wrapper.vm.onChildUpdate();
	});
	test('call applyAllOptionsToggle function', () => {
		wrapper.vm.applyAllOptionsToggle();
	});

	test('call onKeywordsChange function', () => {
		wrapper.vm.onKeywordsChange();
	});
	test('call allCompanyOptionsToggle function', () => {
		wrapper.vm.allCompanyOptionsToggle();
	});
	test('call closeConfigModal function', () => {
		wrapper.vm.closeConfigModal();
	});
	test('call openConfigModal function', () => {
		wrapper.vm.openConfigModal();
	});
	test('call gotoSettings function', () => {
		wrapper.vm.gotoSettings();
	});
	test('call closeMoreSearchSettings function', () => {
		wrapper.vm.closeMoreSearchSettings();
	});
	test('call btnApplyChanges function', () => {
		wrapper.vm.btnApplyChanges();
	});
	test('call setActiveTab function', () => {
		wrapper.vm.setActiveTab();
	});
	test('call deletePropertyFromObject function', () => {
		wrapper.vm.deletePropertyFromObject('event', request.company_research);
	});
	test('call onOptionToggle function', () => {
		wrapper.vm.onOptionToggle('event', 'contact', event);
	});
	it('dispatches an action when a submitSearch is clicked', async () => {
		const $store = {
			dispatch: jest.fn(() => Promise.resolve({ data: {} })),
			getters: {
				'search_services/getPayload': (state) => state.searchPayload,
				'auth/getLoggedUser': (state) => state.userDetails
			},
			mutations: {
				'search_services/saveSearchPayload': (state, data) => {
					state.searchPayload = data;
				},
				'search_services/saveSearchedResult': (state, data) => {
					state.searchPayload = data;
				}
			},
			state: {
				searchPayload: {},
				searchedResult: {}
			}
		};
		const router = new VueRouter({ routes: [{ path: '/', name: 'Search', meta: {} }] });
		const wrapper = mount(Search, {
			mocks: {
				$store
			},
			localVue,
			router
		});
		wrapper.vm.submitSearch();
		await nextTick();
		expect($store.dispatch).toHaveBeenCalled();
	});
	test('dispatches an action when a getUserSettings is clicked', async () => {
		const $store = {
			dispatch: jest.fn(() => Promise.resolve({ data: {} })),
			getters: {
				'search_services/getPayload': (state) => state.searchPayload,
				'auth/getLoggedUser': (state) => state.userDetails
			},
			mutations: {
				'search_services/saveSearchPayload': (state, data) => {
					state.searchPayload = data;
				}
			},
			state: {
				isLoggedIn: false,
				loggedUser: {},
				userDetails: {
					is_settings: false
				}
			}
		};
		const router = new VueRouter({ routes: [{ path: '/', name: 'Search', meta: {} }] });
		const wrapper = mount(Search, {
			mocks: {
				$store
			},
			localVue,
			router
		});
		wrapper.vm.getUserSettings();
		await nextTick();
		expect($store.dispatch).toHaveBeenCalled();
	});
	test('logout user', () => {
		wrapper.vm.logoutUser();
		// await nextTick();
		// expect($store.dispatch).toHaveBeenCalled();
	});
});
