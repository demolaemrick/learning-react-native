import { ValidationObserver } from 'vee-validate';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TextInput from '@/components/Input/TextInput';
import CButton from '@/components/Button';
import VModal from '@/components/Modal';
import VHeader from '@/components/Header/search/Header';
import PasswordInput from '@/components/Input/PasswordInput';
import Loader from '@/components/Loader';
import Logo from '@/components/Logo';
import { fieldsData } from '@/data/select-data';

export default {
	name: 'NewEnrichment',
	components: {
		ValidationObserver,
		TextInput,
		CButton,
		VModal,
		PasswordInput,
		Loader,
		Logo,
		VHeader
	},
	data() {
		return {
			form: {
				lickedInCookie: null,
				searchType: 'lead',
				source: '',
				sourceUrl: null,
				clientName: '',
				outreachOwner: '',
				bdrOwner: '',
				refresh: false
			},
			loading: false,
			formPosition: 0,
			animation: 'animate-in',
			showModal: false,
			availableOptions: null
		};
	},
	created() {
		this.getSelectFieldsOptions();
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
		getSelectFieldsOptions() {
			const response = fieldsData;
			this.availableOptions = response;
		},
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
			console.log(this.form);
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
			return this.formPosition === 1;
		}
	}
};
