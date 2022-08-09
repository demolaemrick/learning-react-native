import { ValidationObserver } from 'vee-validate';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TextInput from '@/components/Input/TextInput';
import CButton from '@/components/Button';
import VModal from '@/components/Modal';
import PasswordInput from '@/components/Input/PasswordInput';
import Loader from '@/components/Loader';
import Logo from '@/components/Logo';
export default {
	name: 'NewEnrichment',
	data() {
		return {
			form: {
				email: null,
				password: null
			},
			loading: false,
			formPosition: 0,
			animation: 'animate-in',
			formGroup: [
				{
					title: 'Personal Details',
					fields: [
						{ label: 'Data Source', value: '' },
						{ label: 'Client Name', value: '' },
						{ label: 'Outreach record owner', value: '' },
						{ label: 'Volley BDR owner', value: '' }
					]
				},
				{
					title: 'Details',
					fields: [
						{ label: 'Sales Nav Cookie', value: '', placeholder: 'Linkedin Sales Nav Cookie' },
						{ label: 'Saved Search URL', value: '', placeholder: 'Linkedin Sales Nav Saved Search URL' }
					]
				}
			],
			showModal: false
		};
	},
	methods: {
		...mapMutations({
			saveUserSession: 'auth/loginSuccess',
			setLastSearchResult: 'auth/setLastSearchResult'
		}),
		...mapActions({
			login: 'auth/login',
			research_history: 'search_services/resear,ch_history',
			showAlert: 'showAlert'
		}),
		nextStep() {
			this.animation = 'animate-out';
			setTimeout(() => {
				this.animation = 'animate-in';
				this.formPosition += 1;
			}, 600);
		},
		submit() {
			if (!this.isLastFormPosition) {
				this.nextStep();
				return;
			}
			this.showModal = true;
		},
		prevStep() {
			this.animation = 'animate-out';
			setTimeout(() => {
				this.animation = 'animate-in';
				this.formPosition -= 1;
			}, 600);
		},
		closeModal() {
			this.showModal = false;
		}
	},
	computed: {
		...mapGetters({
			lastSearch: 'auth/getLastSearchResult'
		}),
		isLastFormPosition() {
			return this.formPosition === this.formGroup.length - 1;
		}
	},
	components: {
		ValidationObserver,
		TextInput,
		CButton,
		VModal,
		PasswordInput,
		Loader,
		Logo
	}
};
