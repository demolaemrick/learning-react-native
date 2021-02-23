import { shallowMount } from '@vue/test-utils';
import CButton from '@/components/Button';

describe('CButton.vue', () => {
	it('renders props.label when passed', () => {
		const label = 'new message';
		const wrapper = shallowMount(CButton, {
			propsData: { label }
		});
		expect(wrapper.text()).toMatch(label);
	});
});
