import { shallowMount } from '@vue/test-utils';
import CCheckbox from '@/components/Checkbox';

describe('CCheckbox.vue', () => {
	const wrapper = shallowMount(CCheckbox, {
		propsData: {
			name: 'some value'
		}
	});
	it('Render without errors', () => {
		expect(wrapper.vm).toBeTruthy();
	});

	it('Should handle checkbox checked', () => {
		wrapper.find('input').trigger('input');
	});
});
