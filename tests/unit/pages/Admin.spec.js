import Admin from '../../../src/views/Dashboard/Admin';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
const Paginate = require('vuejs-paginate');

jest.mock('vuejs-paginate');

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.component('paginate', Paginate);

let response = {
	status: 200,
	data: {
		response: {
			data: []
		}
	},
	statusText: 'OK'
};

describe('Admin', () => {
	let store;

	beforeEach(() => {
		store = new Vuex.Store({
			actions: {
				showAlert: jest.fn()
			},
			getters: {},
			mutations: {},
			modules: {
				admin_management: {
					actions: {
						adminInvite: jest.fn(),
						allAdmins: jest.fn().mockResolvedValue(response),
						deactivateAdmin: jest.fn(),
						activateAdmin: jest.fn(),
						suspendAdmin: jest.fn()
					},
					getters: {},
					mutations: {},
					namespaced: true
				}
			}
		});
	});

	it('tests that the admin page mounts', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm).toBeTruthy();
	});
});
