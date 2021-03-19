import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import Nav from '@/views/Nav.vue';
import router from '@/router';
const localVue = createLocalVue();
localVue.use(Vuex);

const request = {
	company: '',
	company_research: {
		ipo: [],
		job_postings: [],
		mergers_and_acquisitions: [],
		product_launch: []
	},
	contact_research: {
		awards: [],
		blogs: [],
		events: [],
		features: [],
		linkedin_activity: [],
		podcasts: [],
		promotion: [],
		twitter_activity: [],
		videos: []
	},
	full_name: '',
	role: ''
};
describe('Nav.vue', () => {
	let wrapper;
	beforeEach(() => {
		const store = new Vuex.Store({
			getters: {
				'search_services/getPayload': (state) => state.searchPayload
			},
			state: {
				searchPayload: request
			},
			mutations: {
				'search_services/saveSearchPayload': (state, data) => {
					state.searchPayload = data;
				}
			}
		});
		wrapper = mount(Nav, {
			propsData: {
				researchedPayload: request,
				showNav: false
			},
			attachTo: document.body,
			localVue,
			store,
			router
		});
	});

	test('Render without errors', () => {
		expect(wrapper.isVueInstance).toBeTruthy();
	});
	test('call toggleNav function', () => {
		console.log('dss', wrapper.find('#app'));
		wrapper.vm.toggleNav();
	});
	it('call back function', async () => {
		wrapper.vm.back();
	});

	test('call onChildUpdate function', () => {
		wrapper.vm.onChildUpdate(request.company);
	});
});
