import { ValidationObserver } from 'vee-validate';
import { mapActions } from 'vuex';
import TextInput from '@/components/Input/TextInput';
import CButton from '@/components/Button';
import VModal from '@/components/Modal';
import VHeader from '@/components/Header/dataEnrichment/Header';
import PasswordInput from '@/components/Input/PasswordInput';
import Loader from '@/components/Loader';
import Logo from '@/components/Logo';

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
				client: '',
				outreachOwner: '',
				bdrOwner: '',
				refresh: false
			},
			loading: false,
			pageIsLoading: true,
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
			this.pageIsLoading = true;
			try {
				const { status, data } = await this.getFieldsData();
				if (status == 200) {
					this.availableOptions = data;
				}
			} catch (error) {
				const err = { error };
				this.showAlert({
					status: 'error',
					message: err.error.response.data.message,
					showAlert: true
				});
			} finally {
				this.pageIsLoading = false;
			}
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

			const { client, ...rest } = this.form;
			const payload = {
				...rest,
				bdrOwner: rest.bdrOwner.email,
				clientName: client.name,
				outreachOwner: rest.outreachOwner.email
			};
			try {
				const { status, data } = await this.addNewDataEnrichment(payload);

				if (status === 200 && data.status === 'success' && !data.data.status === 'ready') {
					this.showModal = true;
					return;
				}
				this.showAlert({
					status: 'error',
					message: 'This Linkedin Sales Nav Saved Search URL has already been used',
					showAlert: true
				});
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
			return this.form.source === '' || this.form.client === '' || this.form.outreachOwner === '' || this.form.bdrOwner === '';
		},
		availableDataSource() {
			return this.availableOptions?.dataSource;
		},
		availableClients() {
			return this.availableOptions?.clients;
		},
		availableBdrOwners() {
			return this.availableOptions?.bdrOwners;
		}
	}
};
