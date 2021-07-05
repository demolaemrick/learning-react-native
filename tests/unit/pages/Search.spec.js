import Vuex from 'vuex';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import { mount, shallowMount, RouterLinkStub, createLocalVue } from '@vue/test-utils';
import Search from '@/views/Search/Search.vue';
import CButton from '@/components/Button';
import ValidationObserver from 'vee-validate';
import VTabs from '@/components/Tabs';

jest.mock('axios', () => ({
	get: Promise.resolve('value'),
	post: jest.fn((_url, _body) => {
		return new Promise((resolve) => {
			url = _url;
			body = _body;
			resolve(true);
		});
	})
}));

const response = {
	data: {
		message: 'error'
	}
};
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.component('ValidationObserver', ValidationObserver);
localVue.use(Vuex);

jest.useFakeTimers();
// const request = {
// 	company: '',
// 	company_research: {
// 		ipo: [],
// 		job_postings: [],
// 		mergers_and_acquisitions: [],
// 		product_launch: []
// 	},
// 	contact_research: {
// 		awards: [],
// 		blogs: [],
// 		events: [],
// 		features: [],
// 		linkedin_activity: [],
// 		podcasts: [],
// 		promotion: [],
// 		twitter_activity: [],
// 		videos: []
// 	},
// 	full_name: '',
// 	role: ''
// };
// const event = {
// 	target: {
// 		checked: true
// 	}
// };
describe('search', () => {
	let store;
	const router = new VueRouter({ routes: [{ path: '/', name: 'Search' }] });
	beforeEach(() => {
		store = new Vuex.Store({
			modules: {
				auth: {
					namespaced: true,
					getters: {
						getLoggedUser: () => ({
							id: '1',
							email: 'abass@enyata.com',
							token: '123',
							is_settings: true,
							role: 'admin'
						})
					}
				},
				user: {
					namespaced: true,
					actions: {
						getSettings: jest.fn(() => Promise.reject({ response }))
					}
				}
			},
			actions: {
				showAlert: jest.fn()
			}
		});
	});
	it('should be a vue instance', () => {
		const wrapper = shallowMount(Search, {
			store,
			localVue,
			router
		});

		expect(wrapper.vm).toBeTruthy();
	});

	it('should show title text', () => {
		const wrapper = shallowMount(Search, {
			store,
			localVue,
			router,
			stubs: {
				RouterLink: RouterLinkStub
			}
		});
		expect(wrapper.find('p').text()).toBe('Aggregated sales research to power your personalized outreach.');
	});
	it('should mount company profile by default', async () => {
		const wrapper = shallowMount(Search, {
			store,
			localVue,
			router
		});
		await flushPromises();
		await wrapper.vm.$nextTick();

		expect(wrapper.findComponent(VTabs).exists()).toBe(true);
	});

	it('should show the button visible and disabled by default', async () => {
		const wrapper = mount(Search, {
			store,
			localVue,
			router,
			data() {
				return {
					loading: false,
					payload: {}
				};
			}
		});

		await flushPromises();
		jest.runAllTimers();
		await flushPromises();
		expect(wrapper.findComponent(CButton).attributes('disabled')).toBe('disabled');
	});
	// it('should shows error on empty name field', async () => {
	// 	const wrapper = mount(Search, {
	// 		store,
	// 		localVue,
	// 		router,
	// 		stubs: {
	// 			RouterLink: RouterLinkStub
	// 		},
	// 		data() {
	// 			return {
	// 				loading: false,
	// 				payload: {}
	// 			};
	// 		},
	// 		localVue
	// 	});

	// 	const textInput = wrapper.find('#name');
	// 	await textInput.setValue('')
	// 	await flushPromises();

	// 	expect(wrapper.find('#vee_name').text()).toBe('The name field is required');
	// });
	// it('should call the submit function with payload', async () => {
	// 	const wrapper = mount(Login, {
	// 		stubs: {
	// 			RouterLink: RouterLinkStub
	// 		},
	// 		data() {
	// 			return {
	// 				loading: false,
	// 				formData: {}
	// 			};
	// 		},
	// 		localVue,
	// 		store
	// 	});

	// 	wrapper.setData({
	// 		formData: {
	// 			email: 'esiaguleticia@gmail.com',
	// 			password: '1234567'
	// 		}
	// 	});
	// 	await wrapper.find('form').trigger('submit.prevent');
	// 	await flushPromises();
	// 	expect(actions.login).toHaveBeenCalledWith(expect.any(Object), {
	// 		email: 'esiaguleticia@gmail.com',
	// 		password: '1234567'
	// 	});
	// });

	//TODO: test that it routes to the dashboard on success
});
// describe('Search.vue', () => {
// 	let wrapper;
// 	let $store;
// 	let store;
// 	beforeEach(() => {
// 		store = new Vuex.Store({
// 			dispatch: jest.fn(() =>
// 				Promise.resolve({
// 					data: {}
// 				})
// 			),
// 			getters: {
// 				//'search_services/getPayload': (state) => state.searchPayload,
// 				'auth/getLoggedUser': (state) => state.userDetails
// 			},
// 			state: {
// 				searchPayload: request,
// 				isLoggedIn: false,
// 				loggedUser: {},
// 				userDetails: {
// 					is_settings: false
// 				}
// 			},
// 			actions: {
// 				'user/getSettings': jest.fn(() =>
// 					Promise.resolve({
// 						data: {
// 							company: 'Tesla',
// 							company_research: {},
// 							contact_research: {},
// 							full_name: 'Elon Musk',
// 							research_score: 0.6100000000000001,
// 							role: 'CEO',
// 							rowId: '7d775349-d346-4149-8f8f-009559d4c059',
// 							socials: [],
// 							status: {},
// 							userId: '607ea1bf965bbe6414c00b13'
// 						}
// 					})
// 				),
// 				showAlert: jest.fn()
// 			},
// 			mutations: {
// 				'search_services/saveSearchPayload': (state, data) => {
// 					state.searchPayload = data;
// 				},
// 				'auth/logout': (state) => {
// 					state.loggedUser = {};
// 					state.isLoggedIn = false;
// 				}
// 			}
// 		});
// 		const router = new VueRouter({ routes: [{ path: '/', name: 'Search', meta: {} }] });
// 		wrapper = mount(Search, {
// 			localVue,
// 			router,
// 			store,
// 			mocks: {
// 				$store
// 			}
// 		});
// 	});

// 	test('Render without errors', () => {
// 		expect(wrapper.isVueInstance).toBeTruthy();
// 	});
// 	test('call onChildUpdate function', () => {
// 		wrapper.vm.onChildUpdate();
// 	});
// 	test('call applyAllOptionsToggle function', () => {
// 		wrapper.vm.applyAllOptionsToggle();
// 	});

// 	test('call onKeywordsChange function', () => {
// 		wrapper.vm.onKeywordsChange();
// 	});
// 	test('call allCompanyOptionsToggle function', () => {
// 		wrapper.vm.allCompanyOptionsToggle();
// 	});
// 	test('call closeConfigModal function', () => {
// 		wrapper.vm.closeConfigModal();
// 	});
// 	test('call openConfigModal function', () => {
// 		wrapper.vm.openConfigModal();
// 	});
// 	test('call gotoSettings function', () => {
// 		wrapper.vm.gotoSettings();
// 	});
// 	test('call closeMoreSearchSettings function', () => {
// 		wrapper.vm.closeMoreSearchSettings();
// 	});
// 	test('call btnApplyChanges function', () => {
// 		wrapper.vm.btnApplyChanges();
// 	});
// 	test('call setActiveTab function', () => {
// 		wrapper.vm.setActiveTab();
// 	});
// 	test('call deletePropertyFromObject function', () => {
// 		wrapper.vm.deletePropertyFromObject('event', request.company_research);
// 	});
// 	test('call onOptionToggle function', () => {
// 		wrapper.vm.onOptionToggle('event', 'contact', event);
// 	});
// 	it('dispatches an action when a submitSearch is clicked', async () => {
// 		const $store = {
// 			dispatch: jest.fn(() => Promise.resolve({ data: {} })),
// 			getters: {
// 				'search_services/getPayload': (state) => state.searchPayload,
// 				'auth/getLoggedUser': (state) => state.userDetails
// 			},
// 			mutations: {
// 				'search_services/saveSearchPayload': (state, data) => {
// 					state.searchPayload = data;
// 				},
// 				'search_services/saveSearchedResult': (state, data) => {
// 					state.searchPayload = data;
// 				}
// 			},
// 			state: {
// 				searchPayload: {},
// 				searchedResult: {}
// 			}
// 		};
// 		const router = new VueRouter({ routes: [{ path: '/', name: 'Search', meta: {} }] });
// 		const wrapper = mount(Search, {
// 			mocks: {
// 				$store
// 			},
// 			localVue,
// 			router
// 		});
// 		wrapper.vm.submitSearch();
// 		await nextTick();
// 		expect($store.dispatch).toHaveBeenCalled();
// 	});
// 	test('dispatches an action when a getUserSettings is clicked', async () => {
// 		const $store = {
// 			dispatch: jest.fn(() => Promise.resolve({ data: {} })),
// 			getters: {
// 				'search_services/getPayload': (state) => state.searchPayload,
// 				'auth/getLoggedUser': (state) => state.userDetails
// 			},
// 			mutations: {
// 				'search_services/saveSearchPayload': (state, data) => {
// 					state.searchPayload = data;
// 				}
// 			},
// 			state: {
// 				isLoggedIn: false,
// 				loggedUser: {},
// 				userDetails: {
// 					is_settings: false
// 				}
// 			}
// 		};
// 		const router = new VueRouter({ routes: [{ path: '/', name: 'Search', meta: {} }] });
// 		const wrapper = mount(Search, {
// 			mocks: {
// 				$store
// 			},
// 			localVue,
// 			router
// 		});
// 		wrapper.vm.getUserSettings();
// 		await nextTick();
// 		expect($store.dispatch).toHaveBeenCalled();
// 	});
// 	test('logout user', () => {
// 		wrapper.vm.logoutUser();
// 		// await nextTick();
// 		// expect($store.dispatch).toHaveBeenCalled();
// 	});
// });
