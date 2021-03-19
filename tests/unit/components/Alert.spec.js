import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Alert from '@/components/Alert';
const localVue = createLocalVue();
localVue.use(Vuex);

const initialAlertState = {
	status: 'success',
	title: 'A test alert title',
	message: 'A test alert message',
	showAlert: false
};

describe('Alert.vue', () => {
	let wrapper;

	beforeEach(() => {
		const store = new Vuex.Store({
			getters: {
				getAlert: (state) => state.alert
			},
			state: {
				alert: initialAlertState
			}
		});
		wrapper = shallowMount(Alert, {
			store,
			localVue
		});
	});

	it('Render without errors', () => {
		expect(wrapper.vm).toBeTruthy();
	});
});
