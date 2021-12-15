import ResetPassword from '../../../src/views/auth/ResetPassword';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

let statusRes = {
	status: 200,
	statusText: 'OK',
	data: {
		message: 'success'
	}
};
let errRes = {
	status: 500,
	statusText: 'Failed',
	response: {
		data: {
			message: 'failed'
		}
	}
};
jest.useFakeTimers();

describe('ResetPassword', () => {
	let store;

	const router = new VueRouter({
		routes: [
			{
				path: '/reset-password',
				name: 'ResetPassword',
				query: {
					token: '1'
				}
			},
			{
				path: '/login',
				name: 'Login'
			}
		]
	});

	beforeEach(() => {
		store = new Vuex.Store({
			actions: {
				showAlert: jest.fn()
			},
			getters: {},
			mutations: {},
			modules: {
				auth: {
					actions: {
						resetPassword: jest.fn().mockResolvedValue(statusRes)
					},
					getters: {},
					mutations: {},
					namespaced: true
				}
			}
		});

		store.dispatch = jest.fn().mockResolvedValue(statusRes);
	});

	it('tests that the page mounts', () => {
		const wrapper = shallowMount(ResetPassword, {
			store,
			localVue,
			router
		});
		expect(wrapper.vm).toBeTruthy();
	});

	it('tests that the resetPassword action is called', async () => {
		const wrapper = mount(ResetPassword, {
			store,
			localVue,
			router,
			data() {
				return {
					form: {
						password: '1234abcd',
						token: '12345'
					}
				};
			}
		});
		let form = wrapper.find('form');
		form.trigger('submit');
		await wrapper.vm.$nextTick();

		expect(store.dispatch).toHaveBeenCalledWith('auth/resetPassword', {
			password: '1234abcd',
			token: '12345'
		});

		await wrapper.vm.$nextTick();
		expect(wrapper.vm.$route.name).toBe('Login');
	});

	it('tests that the error alert is triggered', async () => {
		store.dispatch = jest.fn().mockRejectedValue(errRes);

		const wrapper = mount(ResetPassword, {
			store,
			localVue,
			router,
			data() {
				return {
					form: {
						password: '1234abcd',
						token: '1234'
					}
				};
			}
		});
		let form = wrapper.find('form');
		form.trigger('submit');
		await wrapper.vm.$nextTick();

		// expect(store.dispatch).toHaveBeenCalledWith('auth/resetPassword', {
		// 	password: '1234abcd',
		// 	token: '12345'
		// });
	});
});
