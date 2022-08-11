import { ValidationObserver } from 'vee-validate';
import { mapActions } from 'vuex';
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
		...mapActions({
			addNewDataEnrichment: 'data_enrichment/addNewDataEnrichment',
			getFieldsData: 'data_enrichment/getFieldsData',
			showAlert: 'showAlert'
		}),
		async getSelectFieldsOptions() {
			// this.loading = true;
			// try {
			// 	const response = await this.getFieldsData();
			// 	console.log(response);

			// 	if (status) {
			// 		this.availableOptions = data.data;
			// 	}
			// } catch (error) {
			// 	const err = { error };
			// 	this.showAlert({
			// 		status: 'error',
			// 		message: err.error.response.data.message,
			// 		showAlert: true
			// 	});
			// } finally {
			// 	this.loading = false;
			// }
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
		async submit() {
			if (!this.isLastFormPosition) {
				this.nextStep();
				return;
			}
			this.loading = true;
			try {
				const { status } = await this.addNewDataEnrichment(this.form);
				if (status === 200) {
					this.showModal = true;
				}
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
		isLastFormPosition() {
			return this.formPosition === 1;
		},
		invalidateNextButton() {
			return this.form.source === '' || this.form.clientName === '' || this.form.outreachOwner === '' || this.form.bdrOwner === '';
		}
	}
};
