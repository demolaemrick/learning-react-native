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
	created() {
		// const token = this.$route.query.token;
		// if (token) {
		// 	this.verifyUser(token);
		// }
	},
	computed: {
		// ...mapGetters({
		// 	status: 'getStatus'
		// })
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
				this.saveUserSession(response.data.data);
				this.$router.push({ name: 'Search' });
				return true;
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
		// verifyUser(token) {
		// 	this.verify(token)
		// 		.then((response) => {
		// 			if (response.data.status === 'success') {
		// 				this.showAlert({
		// 					status: 'success',
		// 					message: 'User Verification Successfull, Please Login.',
		// 					showAlert: true
		// 				});
		// 				this.$router.push('/login');
		// 				return true;
		// 			}
		// 			this.showAlert({
		// 				status: 'error',
		// 				message: 'Something went wrong',
		// 				showAlert: true
		// 			});
		// 		})
		// 		.catch((error) => {
		// 			this.showAlert({
		// 				status: 'error',
		// 				message: error.response.data.message,
		// 				showAlert: true
		// 			});
		// 		});
		// }
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
