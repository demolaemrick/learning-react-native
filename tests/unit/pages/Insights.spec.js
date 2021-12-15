import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Insights from '../../../src/views/Insights/Insights.vue';

jest.mock('lodash', () => ({
	debounce: (fn) => fn
}));

const localVue = createLocalVue();
localVue.filter('moment', (val, val2) => val + val2);
localVue.use(Vuex);
localVue.use(VueRouter);

let researchResponse = {
	status: 200,
	statusText: 'OK',
	data: {
		data: {
			contact_details: {
				company: 'Volley',
				email: 'dayo@enyata.com',
				full_name: 'Ian Carnevale',
				last_refresh: '2021-07-30T15:19:51.743Z',
				role: 'CEO',
				socials: {
					angel: 'angel.co/ian-carnevale',
					linkedin: 'https://linkedin.com',
					twitter: 'https://twitter.com',
					website: 'angel.co/ian-carnevale',
					crunchbase: 'https://crunchbase.com'
				},
				url: 'https://volley.com'
			},
			company_insights: {
				jobs: [],
				news: {
					all: [],
					products: [],
					funding: [],
					people: []
				},
				snapshots: {
					interests: ['education'],
					jobs: null,
					mentions: 13
				}
			},
			contact_insights: {
				news: {
					Andela: [
						{
							title: 'Volley: Home',
							url: 'https://volleythat.com/',
							description: 'Volley',
							tags: ['website'],
							dontRender: null,
							is_bookmarked: false,
							is_disliked: false,
							meta: {
								timestamp: '2021-06-21T14:21:35.384Z',
								published: null,
								resourceType: 'article',
								host: 'volleythat.com',
								html: {
									snippet: '<b>Volley</b>',
									title: '<b>Volley</b>: Home',
									url: 'https://<b>volley</b>that.com/'
								},
								content: { html: '<div></div>', tag: ['San Francisco'], date: null },
								relevanceScore: 0.6954999999999999
							},
							content: {
								date: new Date()
							}
						}
					]
				},
				other_insights: [],
				quotes: [],
				snapshot: {
					current_employer: {
						start_date: '1'
					},
					interests: [],
					last_linkedin_activity: '1',
					mentions: 6,
					most_viral_tweet: '5'
				},
				top_tags: ['Andela'],
				topics: {
					Andela: 1,
					Jeremy: 1,
					Nigeria: 1
				}
			},
			rowId: '1',
			status: { statusCode: 'UPDATING', message: 'Updating' }
		}
	}
};

// deep cloning existing object to avoid rewriting the whole response

let subResponse = {
	data: {
		done: {
			contact_details: {
				company: 'Volley',
				email: 'dayo@enyata.com',
				full_name: 'Ian Carnevale',
				last_refresh: '2021-07-30T15:19:51.743Z',
				role: 'CEO',
				socials: [{ angel: 'angel.co/ian-carnevale' }],
				url: 'https://volley.com'
			},
			status: { statusCode: 'READY', message: 'Ready' }
		}
	},
	status: 200
};

let researchDoneRes = {
	status: 200,
	statusText: 'OK',
	data: {
		message: 'success'
	}
};
let bookmarkResponse = researchResponse;
let bookmarks = {
	status: 200,
	data: {
		response: {
			company_research: [
				{
					createdAt: '2021-05-14T10:33:11.606Z',
					description: 'AMZN',
					relevance_score: 0.41000000000000003,
					rowId: '3d9d0ec5-2e1b-4ab0-b7fb-0995940a08f2',
					title: 'AMZN Stock Price',
					type: 'company_research',
					updatedAt: '2021-05-14T10:33:11.606Z',
					url: 'https://www.marketwatch.com/investing/stock/amzn',
					userId: '607ea1bf965bbe6414c00b13',
					__v: 0,
					_id: '609e51e7487a4982cfcb045a'
				}
			],
			contact_research: [
				{
					createdAt: '2021-05-14T10:33:11.606Z',
					description: 'AMZN',
					relevance_score: 0.41000000000000003,
					rowId: '3d9d0ec5-2e1b-4ab0-b7fb-0995940a08f2',
					title: 'AMZN Stock Price',
					type: 'company_research',
					updatedAt: '2021-05-14T10:33:11.606Z',
					url: 'https://www.marketwatch.com/investing/stock/amzn',
					userId: '607ea1bf965bbe6414c00b13',
					__v: 0,
					_id: '609e51e7487a4982cfcb045a'
				}
			]
		}
	},
	statusText: 'OK'
};
let notebookResponse = {
	statusText: 'OK',
	status: 200,
	data: {
		data: {
			note: 'Hello',
			rowId: '1'
		}
	}
};
let err = {
	response: {
		data: {
			message: 'error'
		}
	}
};

const userdetails = {
	id: '607ea1bf965bbe6414c00b13',
	first_name: 'Abass',
	last_name: 'Adamo',
	email: 'abass@enyata.com',
	token: '1',
	status: 'active',
	is_settings: true,
	role: 'superadmin',
	can_generate_email: true
};

describe('Insights', () => {
	let store;
	let wrapper;
	const router = new VueRouter({
		routes: [
			{ path: '/insights', name: 'Insights', query: { id: '1' } },
			{
				path: '/dashboard/insights',
				name: 'AdminInsights',
				query: {
					id: '1'
				}
			},
			{ path: '/', name: 'Search' }
		]
	});
	// const insightItemRoute = new VueRouter({
	// 	routes: [
	// 		{ path: '/insight-item', name: 'InsightItem' },
	// 		{ path: '/', name: 'Search' }
	// 	]
	// });
	beforeEach(() => {
		store = new Vuex.Store({
			actions: {
				showAlert: jest.fn()
			},
			modules: {
				search_services: {
					actions: {
						researchedResult: jest.fn().mockResolvedValue(researchResponse),
						researchDone: jest.fn().mockResolvedValue(researchDoneRes),
						refresh: jest.fn().mockResolvedValue(researchResponse),
						subscribeResearch: jest.fn().mockResolvedValue(subResponse),
						dislike: jest.fn().mockResolvedValue(),
						addArticleURL: jest.fn()
					},
					getters: {
						getSearchedResult: () => researchResponse.data.data
					},
					mutations: {
						saveSearchedResult: jest.fn()
					},
					namespaced: true
				},
				search_notes: {
					mutations: {
						saveSearchedItem: jest.fn()
					},
					namespaced: true
				},
				user: {
					actions: {
						getBookmarks: jest.fn().mockResolvedValue(bookmarks),
						getNote: jest.fn().mockResolvedValue(notebookResponse),
						updateNote: jest.fn().mockResolvedValue(),
						addToBookmarks: jest.fn().mockResolvedValue(bookmarkResponse),
						removeFromBookmarks: jest.fn().mockResolvedValue(bookmarkResponse)
					},
					getters: {},
					mutations: {
						setBookmarkValue: () => ''
					},
					namespaced: true
				},
				auth: {
					namespaced: true,
					getters: {
						getLoggedUser: () => userdetails
					}
				}
			}
		});

		wrapper = shallowMount(Insights, {
			localVue,
			store,
			router,
			data() {
				return {
					searchType: 'contact_insights',
					contact_details: researchResponse.data.data.contact_details,
					company_details: '',
					isFromAdmin: false
				};
			}
		});
	});

	it('Render without errors', async () => {
		expect(wrapper.vm).toBeTruthy();
	});

	it('Render with a different tab', () => {
		const tab = researchResponse.data.data.contact_insights.news;
		wrapper.setData({
			selectedTab: Object.keys(tab)[0]
		});
		expect(wrapper.vm).toBeTruthy();
	});

	it('routes to search page', async () => {
		wrapper.vm.$nextTick();
		expect(wrapper.vm.$route.name).toBe('Search');
	});

	it('should throw an error when markResearch is called', async () => {
		store.dispatch = jest.fn().mockRejectedValue(err);
		expect(wrapper.vm.markResearch()).toBeTruthy();
	});

	it('tests that contactSearch is called', async () => {
		wrapper.setData({
			contactSearchQuery: ''
		});
		const vm = wrapper.vm;
		const contactSearch = jest.spyOn(vm, 'contactSearch');

		await wrapper.setData({ contactSearchQuery: 'lani' });
		expect(wrapper.vm.$data.contactSearchQuery).toEqual('lani');

		expect(contactSearch).toHaveBeenCalled();

		await wrapper.setData({ contactSearchQuery: '' });
		expect(contactSearch).toHaveBeenCalled();
	});

	it('tests that companySearch is called', async () => {
		wrapper.setData({
			companySearchQuery: ''
		});
		const vm = wrapper.vm;
		const companySearch = jest.spyOn(vm, 'companySearch');

		await wrapper.setData({ companySearchQuery: 'funding' });
		expect(wrapper.vm.$data.companySearchQuery).toEqual('funding');

		expect(companySearch).toHaveBeenCalled();

		await wrapper.setData({ companySearchQuery: '' });
		expect(companySearch).toHaveBeenCalled();
	});

	it('tests for RefreshResearch method is called', () => {
		expect(wrapper.vm.RefreshResearch()).toBeTruthy();
	});

	it('tests for subscribe method is called', () => {
		expect(wrapper.vm.subscribe()).toBeTruthy();
	});

	it('tests for error in subscribe', () => {
		store.dispatch = jest.fn().mockRejectedValue(err);
		expect(wrapper.vm.subscribe()).toBeTruthy();
	});

	it('should call handleTextareaBlur', async () => {
		wrapper.setData({
			editNote: true
		});
		await wrapper.vm.handleTextareaBlur();
	});

	it('should call markResearch', async () => {
		expect(wrapper.vm.markResearch()).toBeTruthy();
	});

	it('calls displaySearchItem method', async () => {
		await wrapper.vm.displaySearchItem();
		wrapper.vm.$nextTick();
		expect(wrapper.vm.$route.name).toBe('InsightItem');
	});

	it('calls validateURL method', async () => {
		expect(wrapper.vm.validateURL('https://js.com')).toBeTruthy();
	});

	it('adds https on link when validateURL is called', async () => {
		expect(wrapper.vm.validateURL('js.com')).toBeTruthy();
	});

	it('should call btnAddToBookMarks', async () => {
		const article = {
			content: null,
			description: 'The founders, Ian Carnevale',
			dontRender: null,
			index: 1,
			is_bookmarked: false,
			url: 'https://www.theladders.com/company/andela-jobs',
			meta: {
				relevanceScore: 0.2
			}
		};
		expect(wrapper.vm.btnAddToBookMarks(article)).toBeTruthy();
	});

	it('should call btnRemoveFromBookMarks', async () => {
		const article = {
			content: null,
			description: 'The founders, Ian Carnevale',
			dontRender: null,
			index: 1,
			is_bookmarked: false,
			url: 'https://www.theladders.com/company/andela-jobs',
			meta: {
				relevanceScore: 0.2
			}
		};
		expect(wrapper.vm.btnRemoveFromBookMarks(article)).toBeTruthy();
	});
});
