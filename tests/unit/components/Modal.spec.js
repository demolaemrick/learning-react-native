import { shallowMount, createLocalVue } from '@vue/test-utils';
import Modal from '@/components/Modal';
const localVue = createLocalVue();
describe('Modal.vue', () => {
	let wrapper;
	beforeEach(() => {
		wrapper = shallowMount(Modal, {
			localVue,
			propsData: {
				toggleClass: true,
				useSlot: true,
				maxWidth: '496px',
				position: 'right',
				active: false
			}
		});
	});

	it('Render without errors', () => {
		expect(wrapper.vm).toBeTruthy();
	});

	it('shows return style', () => {
		expect(wrapper.vm.style).toStrictEqual({ maxWidth: '496px' });
	});
	it('should return max width', () => {
		expect(wrapper.vm.style).toStrictEqual({ maxWidth: wrapper.props().maxWidth });
	});
	test('call closeModal function', () => {
		wrapper.vm.closeModal();
	});
	test('Should handle closeModal  when click', async () => {
		await wrapper.find('div.modal-overlay').trigger('click');
		expect(wrapper.emitted('close')).toBeTruthy();
	});
	test('call submit function', () => {
		wrapper.vm.submit();
	});
});
