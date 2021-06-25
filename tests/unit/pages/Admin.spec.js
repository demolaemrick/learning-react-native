import Admin from '../../../src/views/Dashboard/Admin';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const Paginate = require('vuejs-paginate');
jest.mock('vuejs-paginate');

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.component('paginate', Paginate);

let admins = {
	status: 200,
	data: {
		response: {
			data: [
				{
					email: 'buhari@enyata.com',
					first_name: 'Buharii',
					is_settings: true,
					last_name: 'Gerald',
					monthly_research: 120,
					organisation: 'MIT',
					profession: 'Engineer',
					role: 'admin',
					status: 'active',
					updatedAt: '2021-06-24T09:18:29.667Z',
					_id: '60992e95baa22116bb37d258'
				}
			]
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
						allAdmins: jest.fn().mockResolvedValue(admins),
						deactivateAdmin: jest.fn(),
						activateAdmin: jest.fn(),
						suspendAdmin: jest.fn(),
						updateAdmin: jest.fn(),
						adminSearch: jest.fn(),
						showAlert: jest.fn()
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
