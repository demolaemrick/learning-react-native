import { ValidationObserver } from 'vee-validate';
import { mapActions, mapMutations } from 'vuex';
import TextInput from '@/components/Input/TextInput';
import CButton from '@/components/Button';
import PasswordInput from '@/components/Input/PasswordInput';
import Loader from '@/components/Loader';
import Logo from '@/components/Logo';
export default {
	name: 'Login',
	data() {
		return {
			form: {
				email: null,
				password: null
			},
			loading: false
		};
	},
	methods: {
		...mapMutations({
			saveUserSession: 'auth/loginSuccess'
		}),
		...mapActions({
			login: 'auth/login',
			showAlert: 'showAlert'
		}),
		async submit() {
			this.loading = true;
			try {
				const response = await this.login(this.form);
				console.log(response);
				const { status, data, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					this.saveUserSession(data.data);
					this.$router.push({ name: 'Search' });
				}
				return true;
			} catch (error) {
				const err = { error };
				this.showAlert({
					status: 'error',
					message: err.error.response.data.message,
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
		PasswordInput,
		Loader,
		Logo
	}
};
