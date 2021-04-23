import { ValidationObserver } from 'vee-validate';
import { mapActions } from 'vuex';
import TextInput from '@/components/Input/TextInput';
import CButton from '@/components/Button';
import Loader from '@/components/Loader';
import Logo from '@/components/Logo';
export default {
	name: 'Login',
	data() {
		return {
			form: {
				email: null,
				password: null,
				isNotify: false
			},
			loading: false
		};
	},
	created() {},
	computed: {},
	methods: {
		...mapActions({
			forgotPassword: 'auth/forgotPassword',
			showAlert: 'showAlert'
		}),
		async submit() {
			this.loading = true;
			try {
				const response = await this.forgotPassword({ email: this.email });
				if (response.data.status === 'success') {
					this.showAlert({
						status: 'success',
						message: response.data.message,
						showAlert: true
					});
					return true;
				}
				this.showAlert({
					status: 'error',
					message: 'Something went wrong',
					showAlert: true
				});
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			} finally {
				this.loading = false;
			}
		}
	},
	components: {
		ValidationObserver,
		TextInput,
		CButton,
		Loader,
		Logo
	}
};
