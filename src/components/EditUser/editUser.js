import Loader from '@/components/Loader';
import CButton from '@/components/Button';
import Modal from '@/components/Modal';
import { ValidationObserver } from 'vee-validate';
import TextInput from '@/components/Input';

export default {
	name: 'User',
	data() {
		return {
			form: {
				firstName: '',
				email: null,
				password: null
			},
			loading: false,
			editModal: false
		};
	},
	components: {
		ValidationObserver,
		Loader,
		CButton,
		TextInput,
		Modal
	},
	methods: {
		closeEditModal() {
			this.$emit('close');
		}
	}
};
