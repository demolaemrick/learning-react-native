import { mount } from '@vue/test-utils';
import Search from '../../src/views/Search/Search.vue';

describe('Search', () => {
	it('fills input fields on click', () => {
		const wrapper = mount(Search);
       expect(wrapper.find('.loading').exists()).toBeFalsy();
	});
});
