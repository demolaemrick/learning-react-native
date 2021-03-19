import { shallowMount } from '@vue/test-utils';
import ToggleDropdown from '@/components/ToggleDropdown';

describe('ToggleDropdown.vue', () => {
	const wrapper = shallowMount(ToggleDropdown, {
		propsData: {
			showDropdown: false
		}
	});
	it('Render without errors', () => {
		expect(wrapper.vm).toBeTruthy();
	});

	test('call onClose function', () => {
		wrapper.vm.onClose();
	});
	test('check showDropdown value', () => {
		expect(wrapper.props().showDropdown).toBeFalsy();
	});
});
