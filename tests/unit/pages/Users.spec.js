import Users from '../../../src/views/Dashboard/Users';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
const Paginate = require('vuejs-paginate');

jest.mock('vuejs-paginate');

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.component('paginate', Paginate);

let users = {
	status: 200,
	data: {
		response: {
			data: []
		}
	},
	statusText: 'OK'
};

describe('Users', () => {
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
						allUsers: jest.fn().mockResolvedValue(users),
						deactivateUser: jest.fn(),
						activateUser: jest.fn(),
						suspendUser: jest.fn(),
						singleUser: jest.fn(),
						updateUser: jest.fn(),
						createUser: jest.fn()
					},
					getters: {},
					mutations: {},
					namespaced: true
				}
			}
		});
	});

	it('tests that the user page mounts', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm).toBeTruthy();
	});
});
