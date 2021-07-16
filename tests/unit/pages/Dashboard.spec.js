import { shallowMount, createLocalVue } from '@vue/test-utils';
import Dashboard from '../../../src/views/Dashboard/index.vue';
import VueRouter from 'vue-router';
const localVue = createLocalVue();

localVue.use(VueRouter);
describe('Dashboard', () => {
	//const router = new VueRouter({ routes: [{ path: '/login', name: 'Login' }] });
	const wrapper = shallowMount(Dashboard, {
		localVue
		//router
	});
	it('Render without errors', () => {
		expect(wrapper.vm).toBeTruthy();
	});
});
