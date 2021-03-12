import { shallowMount } from '@vue/test-utils';
import CCheckbox from '@/components/Checkbox';

describe('CCheckbox.vue', () => {
	it('renders isRequired', () => {
		const wrapper = shallowMount(CCheckbox,{propsData: {
			name: 'some value'
		  }});
		expect(wrapper.find('.isRequired').exists()).toBeFalsy();
	});
});
