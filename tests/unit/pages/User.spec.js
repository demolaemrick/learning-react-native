import User from '../../../src/views/Dashboard/User';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
const Paginate = require('vuejs-paginate');

jest.mock('vuejs-paginate');

const localVue = createLocalVue();

localVue.use(VueRouter);

localVue.use(Vuex);
localVue.component('paginate', Paginate);

describe('User', () => {
	let store;
	const router = new VueRouter({ routes: [{ path: 'user/:userId?', name: 'User', meta: 'user', query: { userId: '1' } }] });
	beforeEach(() => {
		store = new Vuex.Store({
			actions: {
				showAlert: jest.fn()
			},
			getters: {},
			mutations: {},
			modules: {
				users_management: {
					actions: {
						singleUser: jest.fn(),
						research_history: jest.fn(),
						bulk_research: jest.fn(),
						subscribeResearch: jest.fn(),
						getSettings: jest.fn(),
						settings: jest.fn(),
						deactivateUser: jest.fn(),
						activateUser: jest.fn(),
						updateUser: jest.fn()
					},
					getters: {},
					mutations: {},
					namespaced: true
				}
			}
		});
	});
	it('tests that the user page mounts', () => {
		const wrapper = mount(User, {
			// mocks: {
			// 	$route: {
			// 		query: {
			// 			userId: "1"
			// 		}
			// 	}
			// },
			router,
			store,
			localVue
		});
		expect(wrapper.vm).toBeTruthy();
	});

	it('tests that the deactivate method is called', () => {
		const wrapper = shallowMount(User, {
			router,
			store,
			localVue
		});
		expect(wrapper.vm.deactivate());
	});
});
