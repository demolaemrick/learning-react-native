import CheckInbox from '../../../src/views/auth/ForgotPassword';
// import Logo from '../../../src/components/Logo.vue'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

const localVue = createLocalVue();

localVue.use(Vuex);

let statusRes = {
	status: 200,
	statusText: 'OK'
};

describe('CheckInbox', () => {
  let store;
  const router = new VueRouter({ routes: [{ path: '/check-inbox', name: 'CheckInbox'}] });

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
						forgotPassword: jest.fn().mockResolvedValue(statusRes)
					},
					getters: {},
					mutations: {},
					namespaced: true
				}
			}
		});

    store.dispatch = jest.fn();
	});

  it('tests that the page mounts', () => {
		const wrapper = shallowMount(CheckInbox, {
			store,
			localVue
		});
		expect(wrapper.vm).toBeTruthy();
	});

  // it('tests that logo component is present', () => {
	// 	const wrapper = shallowMount(CheckInbox, {
	// 		store,
	// 		localVue
	// 	});
    
  //   const logo = wrapper.findComponent(Logo);
	// 	expect(logo).toHaveLength(1);
	// });
})