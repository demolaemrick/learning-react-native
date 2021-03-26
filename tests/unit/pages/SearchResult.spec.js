import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import SearchResult from '@/views/SearchResult/SearchResult.vue';
import router from '@/router';
const localVue = createLocalVue();
localVue.use(Vuex);

// const request = {
// 	company: '',
// 	company_research: {
// 		ipo: [],
// 		job_postings: [],
// 		mergers_and_acquisitions: [],
// 		product_launch: []
// 	},
// 	contact_research: {
// 		awards: [],
// 		blogs: [],
// 		events: [],
// 		features: [],
// 		linkedin_activity: [],
// 		podcasts: [],
// 		promotion: [],
// 		twitter_activity: [],
// 		videos: []
// 	},
// 	full_name: '',
// 	role: ''
// };
const response = {
	message: 'Search Completed Successfully',
	status: 'success',
	data: {
		id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
		full_name: 'Ayomide Onigbinde',
		company: 'Enyata',
		role: 'Software Engineer',
		contact_research: {
			events: [
				{
					url: 'https://techytechytech.com/hackathon/compiler-developmemt-hackaton-oayomide',
					description: 'some description here',
					content: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Ut eu tristique lacus. Sed lobortis'],
					tags: [],
					meta: {}
				}
			],
			articles: [
				{
					url: 'https://devto.com/oayomide/go-wasm-tutorial',
					description: 'some description here',
					content: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Ut eu tristique lacus. Sed lobortis'],
					tags: ['webassembly', 'jvm', 'go'],
					meta: {
						relevance_score: 5,
						timestamp: '2020-02-18 5:15:43TZ'
					}
				}
			],
			podcasts: [],
			features: [],
			awards: [],
			linkedin_activity: [],
			twitter_activity: [
				{
					url: 'https://twitter.com/oayomide/34394834394839',
					meta: {
						timestamp: '2020-02-18 5:15:43TZ'
					}
				}
			]
		},
		company_research: {
			job_postings: [
				{
					url: 'https://jobbrman.co/enyata/mid-senior-engineer-fullstack',
					meta: {}
				}
			],
			mergers_and_acquisitions: [],
			ipo: [],
			product_launch: [],
			others: [
				{
					url: 'https://bendadablogg.com/news/enyata-community-50-macbooks',
					tags: ['buildup', 'community', 'enyata', 'macbooks', 'tech'],
					meta: {
						timestamp: '2020-02-18 5:15:43TZ'
					}
				}
			]
		}
	}
};
describe('SearchResult.vue', () => {
	const $store = {
		dispatch: jest.fn(() => Promise.resolve({ data: {} })),
		getters: {
			'search_services/getSearchedResult': (state) => state.searchedResult,
			'search_services/getNotepad': (state) => state.getNotepad,
			'search_services/getPayload': (state) => state.searchPayload,
			getSearchedItem: (state) => state.getSearchedItem
		},
		state: {
			searchedResult: {},
			notepad: '',
			searchPayload: {},
			searchedItem: {
				type: 'company_research',
				item: response.data.company_research
			}
		},
		mutations: {
			'search_services/saveSearchedItem': (state, data) => {
				state.searchedItem = data;
			},
			'search_services/saveNotepad': (state, data) => {
				state.notepad = data;
			}
		}
	};
	const wrapper = mount(SearchResult, {
		attachTo: document.body,
		localVue,
		mocks: {
			$store
		},
		router
	});

	test('Render without errors', () => {
		expect(wrapper.isVueInstance).toBeTruthy();
	});

	it('call back function', async () => {
		const wrapper = mount(SearchResult, {
			attachTo: document.body,
			localVue,
			mocks: {
				$store
			},
			router
		});
		// const data = {
		//     type: 'company_research',
		//     item: response.data.company_research
		// }
		// const displaySearchItem = jest.fn()
		// wrapper.setMethods({ displaySearchItem });
		//const divArray = wrapper.find('#searched__item-0')
		await wrapper.find('#searched__item-0').trigger('click');
		//expect(displaySearchItem).toHaveBeenCalled();
		//expect($store.dispatch).toHaveBeenCalled();
		// expect($store.state.searchedItem).toEqual(data);
		//wrapper.vm.displaySearchItem('company_research', response.data.company_research);
	});

	// test('call onChildUpdate function', () => {
	// 	wrapper.vm.onChildUpdate(request.company);
	// });
	// it('dispatches an action when a submitSearch is clicked', async () => {

	// 	const $store = {
	// 		dispatch: jest.fn(() => Promise.resolve({ data: {} })),
	// 		getters: {
	// 			'search_services/getPayload': (state) => state.searchPayload
	// 		},
	// 		state: {
	// 			searchPayload: request
	// 		},
	// 		mutations: {
	// 			'search_services/saveSearchPayload': (state, data) => {
	// 				state.searchPayload = data;
	// 			}
	// 		}
	// 	};

	// 	const wrapper = mount(Nav, {
	// 		mocks: {
	// 			$store
	// 		}
	// 	});
	// 	await wrapper.find('button').trigger('click');
	// 	expect($store.dispatch).toHaveBeenCalled();
	// });
});
