import { mount } from '@vue/test-utils';
import DCheckbox from '@/components/DefaultCheckbox';

describe('DCheckbox.vue', () => {
	const wrapper = mount(DCheckbox, {
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
