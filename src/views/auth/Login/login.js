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
			research_history: 'search_services/research_history',
			showAlert: 'showAlert'
		}),
		async getHistory() {
			try {
				const response = await this.research_history({ page: 1, limit: 1 });
				if (response.data.data.history.length > 0) {
					this.$router.push({ name: 'ContactResearch' });
				} else {
					this.$router.push({ name: 'Search' });
				}
				return true;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		async submit() {
			this.loading = true;
			try {
				const response = await this.login(this.form);
				const { status, data, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					await this.saveUserSession(data.data);
					if (data.data.role === 'admin' || data.data.role === 'superadmin') {
						this.$router.push({ name: 'Admin' });
					} else {
						await this.getHistory();
					}
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
