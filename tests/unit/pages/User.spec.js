import User from '../../../src/views/Dashboard/User';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
const Paginate = require('vuejs-paginate');

jest.mock('vuejs-paginate');

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.component('paginate', Paginate);

describe('User', () => {
	let store;

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
			mocks: {
				$route: {
					query: {
						id: 4
					}
				}
			},
			store,
			localVue
		});
		expect(wrapper.vm).toBeTruthy();
	});
});
