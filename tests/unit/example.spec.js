import { shallowMount } from '@vue/test-utils';
import CCheckbox from '@/components/Checkbox';

describe('CCheckbox.vue', () => {
	it('renders isRequired', () => {
		const wrapper = shallowMount(CCheckbox);
		expect(wrapper.find('.isRequired').exists()).toBeFalsy();
	});
});
