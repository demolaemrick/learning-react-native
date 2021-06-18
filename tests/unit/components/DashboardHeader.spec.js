import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import DashboardHeader from '@/components/DashboardHeader';
import VueRouter from 'vue-router';
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('DashboardHeader', () => {
	let mutations;
	let store;
	const router = new VueRouter({ routes: [{ path: '/login', name: 'Login' }] });
	beforeEach(() => {
		mutations = {
			logout: jest.fn()
		};
		store = new Vuex.Store({
			modules: {
				auth: {
					namespaced: true,
					mutations
				}
			}
		});
	});

	it('should be a vue instance', () => {
		const wrapper = shallowMount(DashboardHeader, {
			localVue,
			store,
			router
		});

		expect(wrapper.vm).toBeTruthy();
	});

	it('should route to login', async () => {
		const wrapper = shallowMount(DashboardHeader, {
			localVue,
			store,
			router
		});
		wrapper.vm.logoutUser();
		await wrapper.vm.$nextTick();
	});
});
