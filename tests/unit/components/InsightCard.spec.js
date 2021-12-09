import InsightCard from '@/components/InsightCard';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueTippy from 'vue-tippy';
import Vuex from 'vuex';
const localVue = createLocalVue();

localVue.filter('moment', (val, val2) => val + val2);
localVue.use(Vuex);
localVue.use(VueTippy);
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
describe('InsightCard.vue', () => {
	let store;
	beforeEach(() => {
		store = new Vuex.Store({
			modules: {
				search_services: {
					namespaced: true,
					mutations: {
						saveSearchedResult: jest.fn()
					},
					getters: {
						getSearchedResult: () => ({
							research_score: 0.6954999999999999,
							socials: [
								{
									twitter: {}
								}
							],
							_id: '1',
							company: 'Volley',
							email: 'dayo@enyata.com',
							full_name: 'Ian Carnevale',
							linkedin: 'https://www.linkedin.com/in/oladayo',
							role: 'CEO',
							url: 'https://enyata.com',
							rowId: '1',
							batchId: '1',
							userId: '60992e95baa22116bb37d258',
							status: {
								statusCode: 'READY',
								message: 'Ready'
							},
							__v: 0,
							createdAt: '2021-04-22T20:17:50.272Z',
							updatedAt: '2021-06-21T14:21:40.293Z',
							company_research: {
								others: [
									{
										title: 'Volley: Home',
										url: 'https://volleythat.com/',
										description: 'Volley',
										tags: ['website'],
										dontRender: null,
										meta: {
											timestamp: '2021-06-21T14:21:35.384Z',
											published: null,
											resourceType: 'website',
											host: 'volleythat.com',
											html: {
												snippet: '<b>Volley</b>',
												title: '<b>Volley</b>: Home',
												url: 'https://<b>volley</b>that.com/'
											},
											content: {
												html: '<div></div>',
												tag: ['San Francisco'],
												date: null
											},
											relevanceScore: 0.6954999999999999
										},
										content: null,
										is_bookmarked: false
									}
								]
							},
							contact_research: {
								others: [
									{
										title: 'Volley: Home',
										url: 'https://volleythat.com/',
										description: 'Volley',
										tags: ['website'],
										dontRender: null,
										meta: {
											timestamp: '2021-06-21T14:21:35.384Z',
											published: null,
											resourceType: 'website',
											host: 'volleythat.com',
											html: {
												snippet: '<b>Volley</b>',
												title: '<b>Volley</b>: Home',
												url: 'https://<b>volley</b>that.com/'
											},
											content: {
												html: '<div></div>',
												tag: ['San Francisco'],
												date: null
											},
											relevanceScore: 0.6954999999999999
										},
										content: null,
										is_bookmarked: false
									}
								]
							}
						})
					}
				},
				auth: {
					namespaced: true,
					getters: {
						getLoggedUser: () => userdetails
					}
				}
			}
		});
	});
	it('Render without errors', () => {
		const wrapper = shallowMount(InsightCard, {
			store,
			propsData: {
				published: 'some value',
				article: {
					title: 'Title',
					content: 'Content',
					meta: {
						html: {
							snippet: `
					<div class="box column is-10 is-offset-1">
						<div class="info-text has-text-centered">
						<span class="is-size-base-mobile is-size-4">
							Please give us a few minutes to verify your account details and confirm the order with The Place - Ilupeju.
						</span>
						</div>
					</div>
			  			`
						}
					},
					url: 'https://food.jumia.com.ng/order/finishorder/n4ei/n4ei-hw4j'
				},
				isFromAdmin: false,
				isContact: true
			},
			localVue
		});
		expect(wrapper.vm).toBeTruthy();
	});

	// it('tests the default article prop is used', () => {
	// 	const wrapper = shallowMount(InsightCard, {
	// 		propsData: {
	// 			published: 'some value',
	// 			article: {
	// 				url: '',
	// 				meta: {
	// 					html: {
	// 						snippet: ''
	// 					}
	// 				}
	// 			}
	// 		},
	// 		localVue
	// 	});

	// 	console.log(wrapper.vm.article);
	// });
});
