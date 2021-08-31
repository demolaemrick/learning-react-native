import { shallowMount } from '@vue/test-utils';
import PieChart from '../../../src/components/PieChart';

describe('PieChart.vue', () => {
	const wrapper = shallowMount(PieChart, {
		propsData: {
			labels: [],
			chartData: [],
			options: {
				responsive: true,
				maintainAspectRatio: false
			}
		}
	});

	test('Render without errors', () => {
		expect(wrapper.vm).toBeTruthy();
	});
});
