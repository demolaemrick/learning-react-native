import { mount } from '@vue/test-utils';
import CheckBoxes from '@/components/CheckBoxes';

describe('CheckBoxes', () => {
	const wrapper = mount(CheckBoxes, {
		propsData: {
			inputName: 'permissions',
			datas: [
				{
					name: 'Fellow',
					value: 'fellow',
					id: 1
				},
				{
					name: 'Fellow Men',
					value: 'fellow-men',
					id: 2
				}
			]
		}
	});

	it('Render without errors', () => {
		expect(wrapper.vm).toBeTruthy();
	});

	it('should find all input', () => {
		wrapper.findAll('input');
	});

	it('Input should have a name', () => {
		const checkBoxInput = wrapper.find('input');
		expect(checkBoxInput.attributes('name').length).toBeGreaterThan(0);
	});

	it('Should handle checkbox checked', () => {
		wrapper.findAll('input').trigger('input');
	});

	const checkboxes = wrapper.findAll('input');
	test('test checkbox', async () => {
		await wrapper.setData({
			checkDatas: []
		});
		await checkboxes.at(0).trigger('click');
		await checkboxes.at(1).setChecked();
	});

	test('If checkbox is checked', () => {
		expect(checkboxes.at(1).element.checked).toBeTruthy();
	});
});
