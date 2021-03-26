import Vuex from 'vuex';
import {  mount, createLocalVue } from '@vue/test-utils';
import Modal from '@/views/Modal.vue';
const localVue = createLocalVue();
localVue.use(Vuex);

const request = {
	company: '',
	company_research: {
		ipo: [],
		job_postings: [],
		mergers_and_acquisitions: [],
		product_launch: []
	},
	contact_research: {
		awards: [],
		blogs: [],
		events: [],
		features: [],
		linkedin_activity: [],
		podcasts: [],
		promotion: [],
		twitter_activity: [],
		videos: []
	},
	full_name: '',
	role: ''
};
const event = {
	target: {
		checked: true
	}
};
describe('Modal.vue', () => {
	const wrapper = mount(Modal, {
		propsData: {
			researchedPayload: request
		}
	});
	test('Render without errors', () => {
		expect(wrapper.isVueInstance).toBeTruthy();
	});
	test('call closeModal function', () => {
		wrapper.vm.closeModal();
	});
	test('call submitResearch function', () => {
		wrapper.vm.submitResearch();
	});
	test('call applyAllOptionsToggle function', () => {
		wrapper.vm.applyAllOptionsToggle();
	});

	test('call onKeywordsChange function', () => {
		wrapper.vm.onKeywordsChange();
	});
	test('call allCompanyOptionsToggle function', () => {
		wrapper.vm.allCompanyOptionsToggle();
	});
	test('call deletePropertyFromObject function', () => {
		wrapper.vm.deletePropertyFromObject('event', request.company_research);
	});
	test('call onOptionToggle function', async () => {
		wrapper.vm.onOptionToggle('event', 'contact', event);
	});
	it('dispatches an action when a submitSearch is clicked', async () => {
		await wrapper.find('button').trigger('click');
		expect(wrapper.emitted().submit).toBeTruthy();
	});
});
