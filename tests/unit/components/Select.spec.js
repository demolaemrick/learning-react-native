import { shallowMount } from '@vue/test-utils';
import VSelect from '@/components/Select';

describe('VSelect.vue', () => {
	const wrapper = shallowMount(VSelect, {
		propsData: {
			name: 'some value',
			placeholder: 'some value'
		}
	});
	it('Render without errors', () => {
		expect(wrapper.vm).toBeTruthy();
	});
	it('trigger handleOutsideFocus method', () => {
		wrapper.vm.handleOutsideFocus();
	});

	it('trigger filterOptions method', () => {
		wrapper.vm.filterOptions();
	});
	it('trigger clearFilter method', () => {
		wrapper.vm.clearFilter();
	});
	test('check props value', () => {
		expect(wrapper.props().name).toBe('some value');
		expect(wrapper.props().placeholder).toBe('some value');
	});
});
