import { shallowMount, createLocalVue } from '@vue/test-utils';
import ApiPortal from '../../../src/views/ApiPortal/ApiPortal.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

let apiRes = {
	data: {
		keys: [
			[
				{
					createdAt: '2021-08-20T10:44:36.036Z',
					key: 'live_cc9c369eab79950aa9ba8c725e8670b494a72537',
					keyId: 'ec0d8549-fc2a-41ac-9ffd-ce833fa6fc82',
					mode: 'live',
					status: 'inactive',
					userId: '60c356614dfcdeb368dfff46',
					_id: '611f8794ae947fc3cf322efa'
				},
				{
					createdAt: '2021-08-20T10:44:36.038Z',
					key: 'test_41a57bf7c873ba2d688ca63bff0e8ae2dec67d19',
					keyId: 'ec0d8549-fc2a-41ac-9ffd-ce833fa6fc82',
					mode: 'test',
					status: 'inactive',
					userId: '60c356614dfcdeb368dfff46',
					_id: '611f8794ae947fc3cf322efb'
				}
			]
		],
		message: 'Api Keys retrieved successfully',
		status: 200
	},
	status: 200,
	statusText: 'OK'
};
let emptyApiRes = {
	data: {
		keys: [],
		message: 'Api Keys retrieved successfully',
		status: 200
	},
	status: 200,
	statusText: 'OK'
};

let errRes = {
	status: 500,
	statusText: 'Failed',
	data: {
		keys: []
	}
};

describe('ApiPortal', () => {
	let store;

	beforeEach(() => {
		store = new Vuex.Store({
			actions: {
				showAlert: jest.fn()
			},
			modules: {
				user: {
					actions: {
						fetchApiKeys: jest.fn().mockResolvedValue(emptyApiRes),
						generateApiKey: jest.fn().mockResolvedValue(emptyApiRes),
						regenerateApiKey: jest.fn().mockResolvedValue(apiRes)
					},
					getters: {},
					mutations: {},
					namespaced: true
				}
			}
		});
	});

	it('tests that the page mounts', () => {
		const wrapper = shallowMount(ApiPortal, {
			store,
			localVue
		});
		expect(wrapper.vm).toBeTruthy();
	});

	it('tests that the error alert is triggered', async () => {
		store.dispatch = jest.fn().mockRejectedValue(errRes);
		const wrapper = shallowMount(ApiPortal, {
			store,
			localVue
		});
		expect(wrapper.vm).toBeTruthy();
	});

	it('tests that api keys are generated', async () => {
		// store.dispatch = jest.fn().mockResolvedValue(emptyApiRes);
		// const getKey = jest.fn();
		const wrapper = shallowMount(ApiPortal, {
			store,
			localVue,
			methods: {
				//   getKey
			},
			data() {
				return {
					pageLoading: false,
					keys: []
				};
			}
		});
		// const getKey = jest.spyOn(wrapper.vm.$options.methods, 'getKey');

		expect(wrapper.vm.$data.keys).toEqual([]);
		const btn = wrapper.findComponent({ ref: 'generateBtn' });
		expect(btn.exists()).toBe(true);
		// const btn = wrapper.find({ ref: generateBtn });
		// const btn = wrapper.find('.btn-test');
		// console.log('btnnnnnn ----> ', btn);
		await btn.trigger('click');
		expect(btn.trigger('click')).toBeTruthy();
		await wrapper.vm.$nextTick();
		// expect(getKey).toHaveBeenCalled();

		// expect(store.dispatch).toHaveBeenCalledWith('user/generateApiKey');
		// const vm = wrapper.vm;
		// const getKey = jest.spyOn(vm, 'getKey');
		// let btn2 = wrapper.findComponent(VButton);
		// console.log('btnnnnnn2 ----> ', btn2);

		// await wrapper.vm.$nextTick();
	});
});
