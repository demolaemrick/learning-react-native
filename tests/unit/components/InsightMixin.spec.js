import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import insightMixin from '../../../src/components/MockComponent.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('insightMixin', () => {
	// let store;

	beforeEach(() => {
		store = new Vuex.Store({
			actions: {
				showAlert: jest.fn()
			},
			modules: {
				search_services: {
					actions: {
						dislike: jest.fn().mockResolvedValue()
					},
					getters: {
						getSearchedResult: () => researchResponse.data.data
					},
					mutations: {
						saveSearchedItem: jest.fn(),
						saveSearchedResult: jest.fn()
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
					mutations: {},
					namespaced: true
				}
			}
		});
	});
	it('Render without errors', () => {
		const wrapper = shallowMount(insightMixin);
		expect(wrapper.vm).toBeTruthy();
	});
});
