import Admin from '../../../src/views/Dashboard/Admin';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
// import flushPromises from 'flush-promises';
// import VButton from '@/components/Button';
import CButton from '@/components/Button';

jest.useFakeTimers();

import Vuex from 'vuex';

const Paginate = require('vuejs-paginate');
jest.mock('vuejs-paginate');

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.component('paginate', Paginate);

let admins = {
	status: 200,
	data: {
		data: {
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
			],
			count: 1,
			currentPage: 1,
			prevPage: null,
			nextPage: null
		}
	},
	statusText: 'OK'
};

let statusRes = {
	status: 200,
	statusText: 'OK'
};

let item = {
	email: 'buhari@enyata.com',
	first_name: 'Buharii',
	is_settings: true,
	last_name: 'Gerald',
	monthly_research: 120,
	organisation: 'MIT',
	profession: 'Engineer',
	role: 'admin',
	status: 'active',
	updatedAt: '2021-06-25T12:17:31.455Z',
	_id: '60992e95baa22116bb37d258'
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
						adminInvite: jest.fn().mockResolvedValue(statusRes),
						allAdmins: jest.fn().mockResolvedValue(admins),
						deactivateAdmin: jest.fn().mockResolvedValue(statusRes),
						activateAdmin: jest.fn().mockResolvedValue(statusRes),
						suspendAdmin: jest.fn().mockResolvedValue(statusRes),
						updateAdmin: jest.fn().mockResolvedValue(statusRes),
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

	it('tests that the inviteAdmin method exists', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.inviteAdmin());
		expect(wrapper.vm.$data.emailList).not.toBeNull();
	});

	it('tests that send invite modal is called on button click', async () => {
		const inviteAdmin = jest.fn();
		// let e = new Event('target');
		// e = {
		// 	target: {
		// 		validity: {
		// 			valid: true
		// 		}
		// 	}
		// };
		const wrapper = mount(Admin, {
			store,
			data() {
				return {
					loading: false,
					sendInvites: true,
					emailInput: 'lani@gmail.com',
					emailList: ['text@gmail.com']
				};
			},
			methods: {
				inviteAdmin
			}
		});
		expect(wrapper.vm.toggleClass).toBe(true);

		expect(wrapper.vm.$data.emailInput).not.toEqual('');
		await wrapper.trigger('keydown', {
			key: 'enter'
		});
		const btn = wrapper.find({ ref: 'inviteAdmin' });
		btn.trigger('click');

		expect(wrapper.vm.inviteAdmin());
		expect(wrapper.vm.$data.emailList).toHaveLength(1);
	});

	it('tests that the edit modal is toggled', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleEditModal());
	});

	it('tests that edit modal is toggled', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.showEditModal = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleEditModal();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.showEditModal).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('tests to get all admins', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.getAdmins());
	});
	it('tests for the deactivate modal method', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.openDeactivateModal(item));
	});

	it('tests that the activate modal is toggled', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.openActivateModal(item));
	});

	it('tests that the suspend modal is toggled', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.openSuspendModal(item));
	});

	it('tests that the edit modal is toggled', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.openEditModal(item));
	});

	it('tests that the deactivate method is called', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.deactivate());
	});

	it('tests that deactivate modal is toggled', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.deactivateModal = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleDeactivateModal();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.deactivateModal).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('tests that the activate method is called', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.activate());
	});

	it('tests that activate modal is toggled', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.activateModal = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleActivateModal();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.activateModal).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('tests that the suspend method is called', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.suspend());
	});

	it('tests that suspend modal is toggled', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.suspendModal = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleSuspendModal();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.suspendModal).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('tests that send invite modal is called on button click', async () => {
		const wrapper = mount(Admin, {
			store,
			data() {
				return {
					loading: false
					// sendInvites: false
				};
			}
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper
			.findAllComponents(CButton)
			.at(0)
			.trigger('click');

		// expect(toggleSendInvites).toHaveBeenCalled();
		expect(wrapper.vm.toggleSendInvites());
		// 	await wrapper.vm.$nextTick();
		expect(wrapper.vm.sendInvites).toBe(true);
		// 	// expect(wrapper`.vm.send)
	});

	it('tests that invite modal is toggled', () => {
		const wrapper = shallowMount(Admin, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.sendInvites = true;
		// expect(wrapper.vm.sendInvites).toBe(true);
		wrapper.vm.$nextTick();
		wrapper.vm.toggleSendInvites();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.sendInvites).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	// it('tests that the activate button is called', async () => {
	// 	const activate = jest.fn();
	// 	const toggleActivateModal = jest.fn();
	// 	const wrapper = mount(Admin, {
	// 		store,
	// 		data() {
	// 			return {
	// 				activateModal: true
	// 			};
	// 		},
	// 		methods: {
	// 			activate,
	// 			toggleActivateModal,
	// 		}
	// 	});
	// 	wrapper.findAllComponents(CButton).trigger('click');
	// 	expect(wrapper.vm.openActivateModal)
	// 	expect(activate).toHaveBeenCalled();
	// 	await flushPromises();
	// 	if (status === 200 && statusText === 'OK') {
	// 		expect(toggleActivateModal).toHaveBeenCalled();
	// 	}
	// });

	// it('tests that the search method is called', () => {
	// 	const wrapper = shallowMount(Admin, {
	// 		store,
	// 		localVue
	// 	});
	// 	expect(wrapper.vm.searchPage());
	// 	expect(wrapper.vm.$data.admins).not.toBeNull();
	// });

	it('tests that the deleteAdmin method works', () => {
		const wrapper = shallowMount(Admin, {
			store,
			data() {
				return {
					emailList: ['lani@enyata.com', 'test@enyata.com']
				};
			},
			localVue
		});
		expect(wrapper.vm.deleteEmail(1));
		expect(wrapper.vm.$data.emailList).toHaveLength(1);
	});

	it('tests that the editAdmin method is called', async () => {
		const wrapper = mount(Admin, {
			store,
			response: statusRes,
			data() {
				return {
					showEditModal: true,
					adminInfo: item
				};
			}
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		const btn = wrapper.find({ ref: 'editAdmin' });
		btn.trigger('click');
		await expect(wrapper.vm.editAdmin());
		expect(wrapper.vm.$data.loading).toBe(false);
	});

	// 	const wrapper = shallowMount(Admin, {
	// 	store,
	// 	methods: {
	// 		addEmail
	// 	}
	// });
	// 	expect(addEmail(e));
	// });

	it('tests that the add email method is called', () => {
		let e = new Event('target');
		e = {
			target: {
				validity: {
					valid: true
				}
			}
		};

		const wrapper = shallowMount(Admin, {
			store,
			data() {
				return {
					loading: false,
					sendInvites: true,
					emailInput: 'lani@gmail.com',
					emailList: ['text@gmail.com']
				};
			}
		});
		expect(wrapper.vm.addEmail(e));
	});

	it('tests that the page navigation works', () => {
		const wrapper = shallowMount(Admin, {
			store,
			data() {
				return {
					page: 1
				};
			}
		});
		expect(wrapper.vm.clickCallback(wrapper.vm.$data.page));
	});
});
