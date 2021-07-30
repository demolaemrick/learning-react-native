import { shallowMount } from '@vue/test-utils';
import InsightCard from '@/components/InsightCard';

describe('InsightCard.vue', () => {
	const wrapper = shallowMount(InsightCard, {
		propsData: {
			name: 'some value'
		}
	});
	it('Render without errors', () => {
		expect(wrapper.vm).toBeTruthy();
	});
});
