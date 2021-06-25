import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ContactResearch from '@/views/ContactResearch/ContactResearch.vue';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
const Paginate = require('vuejs-paginate');
jest.useFakeTimers();
jest.mock('vuejs-paginate');

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
localVue.component('paginate', Paginate);

jest.mock('axios', () => ({
	get: Promise.resolve(true)
}));

let research = {
	status: 200,
	statusText: 'OK',
	data: {
		data: {
			count: 1,
			currentPage: 1,
			nextPage: null,
			prevPage: null,
			history: [
				{
					company: 'Amazon',
					createdAt: '2021-04-23T10:52:55.799Z',
					email: 'bezos@amazon.com',
					full_name: 'Jeff Bezos',
					linkedin: 'https://www.linkedin.com/in/jeffbezos',
					research_score: 0.6455,
					role: 'CEO',
					rowId: '3d9d0ec5-2e1b-4ab0-b7fb-0995940a08f2',
					status: { statusCode: 'READY', message: 'Ready' },
					updatedAt: '2021-06-18T11:23:46.719Z',
					_id: '6082a70795b40450d58df056'
				}
			]
		}
	}
};
let subscribeResult = {
	status: 200,
	data: {
		done: {
			research_score: 0.5455,
			rowId: '1',
			status: { statusCode: 'READY', message: 'Ready' },
			_id: '60d45e1e43b0bda463dff22f'
		}
	}
};
describe('ContactResearch.vue', () => {
	let store;
	let actions;
	const router = new VueRouter({
		routes: [
			{ path: '/contact-research', name: 'ContactResearch' },
			{ path: '/search-result', name: 'SearchResult', query: { rowId: '1' } }
		]
	});
	beforeEach(() => {
		(actions = {
			research_history: jest.fn().mockResolvedValue(research),
			subscribeResearch: jest.fn().mockResolvedValue(subscribeResult),
			export_history: jest.fn(),
			bulk_research: jest.fn(),
			deleteSingleResearch: jest.fn()
		}),
		(store = new Vuex.Store({
			actions: {
				showAlert: jest.fn()
			},
			modules: {
				search_services: {
					namespaced: true,
					mutations: {
						saveSearchedResult: jest.fn(),
						saveSearchPayload: jest.fn()
					},
					actions
				}
			}
		}));
	});
	it('should be a vue instance', () => {
		const wrapper = shallowMount(ContactResearch, {
			store,
			localVue,
			router
		});

		expect(wrapper.vm).toBeTruthy();
	});

	it('should have to call get history on created', async () => {
		const wrapper = shallowMount(ContactResearch, {
			store,
			localVue,
			router,
			data() {
				return {
					limit: 10,
					page: 1,
					total: 0,
					count: 0,
					currentPage: 0,
					nextPage: null,
					pageLoading: true
				};
			}
		});

		expect(wrapper.vm.pageLoading).toBeTruthy();
		expect(wrapper.vm.getHistory());
	});

	it('should call getHistory if status is 500', async () => {
		const getHistory = jest.fn().mockResolvedValue({ ...subscribeResult, status: 500 });
		const wrapper = shallowMount(ContactResearch, {
			store,
			localVue,
			router,
			data() {
				return {
					limit: 10,
					page: 1,
					total: 0,
					count: 0,
					currentPage: 0,
					nextPage: null,
					pageLoading: true,
					history: research.data.data.history
				};
			},
			methods: {
				getHistory
			}
		});

		expect(wrapper.vm.subscribe());
		await flushPromises();
		if (subscribeResult.status === 500) {
			expect(getHistory).toHaveBeenCalled();
		}
	});
	it('should call subscribe method', async () => {
		const wrapper = shallowMount(ContactResearch, {
			store,
			localVue,
			router,
			data() {
				return {
					limit: 10,
					page: 1,
					total: 0,
					count: 0,
					currentPage: 0,
					nextPage: null,
					pageLoading: true,
					history: research.data.data.history
				};
			}
		});

		expect(wrapper.vm.subscribe());
		await flushPromises();
		if (subscribeResult.status === 200) {
			if (wrapper.vm.history[0].rowId === subscribeResult.data.done.rowId) {
				expect(wrapper.vm.history[0].status).toBe(subscribeResult.data.done.status);
			}
		}
	});
	it('should call checkPendngStatus', async () => {
		const wrapper = shallowMount(ContactResearch, {
			store,
			localVue,
			router
		});
		expect(wrapper.vm.checkPendngStatus());
	});

	it('Should call clickResearch when table row is clicked', async () => {
		const wrapper = shallowMount(ContactResearch, {
			store,
			localVue,
			router
		});
		wrapper.vm.clickResearch(subscribeResult.data.done);
	});

	it('should open modal', async () => {
		const wrapper = shallowMount(ContactResearch, {
			store,
			localVue,
			router
		});
		wrapper.vm.toggleModal();
	});

	it('should close modal', async () => {
		const wrapper = shallowMount(ContactResearch, {
			store,
			localVue,
			router
		});
		wrapper.vm.showModal = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleModal();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.showModal).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('should open delete modal', async () => {
		const rowId = 1;
		const full_name = 'Jeff Bezos';
		const wrapper = shallowMount(ContactResearch, {
			store,
			localVue,
			router
		});
		wrapper.vm.openDeleteModal(rowId, full_name);
		expect(wrapper.vm.contactToDelete).toStrictEqual({ rowId, full_name });
		wrapper.vm.$nextTick();
		expect(wrapper.vm.showModal).toBe(true);
	});
});
