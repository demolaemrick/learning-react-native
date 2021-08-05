import VCheckbox from '@/components/Checkbox';
import VButton from '@/components/Button';
import VTextInput from '@/components/Input';
import VModal from '@/components/Modal';
import VTabs from '@/components/Tabs';
import VTab from '@/components/Tabs/Tab';
import VToggleDropdown from '@/components/ToggleDropdown';
import { ValidationObserver } from 'vee-validate';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import Loader from '@/components/Loader';
import FileUpload from 'vue-upload-component';
import Logo from '@/components/Logo';
export default {
	name: 'Search',
	components: {
		VCheckbox,
		VTextInput,
		VButton,
		VModal,
		VTab,
		VTabs,
		VToggleDropdown,
		ValidationObserver,
		Loader,
		FileUpload,
		Logo
	},
	data() {
		return {
			loading: false,
			showMoreSearch: false,
			showMoreSearchSettings: false,
			payload: {
				full_name: '',
				company: '',
				role: '',
				company_research: [],
				contact_research: []
			},
			csvImport: {
				contacts: null,
				is_csv: true
			},
			showConfigModal: false,
			accept: 'csv',
			extensions: 'csv',
			files: [],
			activeTab: 'manual_search'
		};
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_services/saveSearchPayload',
			saveSearchedResult: 'search_services/saveSearchedResult',
			logout: 'auth/logout'
		}),
		...mapActions({
			research: 'search_services/research',
			bulk_research: 'search_services/bulk_research',
			getSettings: 'user/getSettings',
			showAlert: 'showAlert'
		}),
		async getUserSettings() {
			this.loading = false;
			try {
				const { status, statusText, data } = await this.getSettings();
				if (status === 200 && statusText === 'OK') {
					this.payload.contact_research = data.data.contact_research;
					this.payload.company_research = data.data.company_research;
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: 'An error occurred',
					showAlert: true
				});
			} finally {
				this.loading = false;
			}
		},
		logoutUser() {
			this.logout();
			this.$router.push('/login');
		},
		csvJSON(csv) {
			var lines = csv.split('\n');

			var result = [];
			var headers = lines[0].split(',');

			for (var i = 1; i < lines.length; i++) {
				var obj = {};
				var currentline = lines[i].split(',');

				for (var j = 0; j < headers.length; j++) {
					obj[headers[j]] = currentline[j];
				}

				result.push(obj);
			}

			return JSON.parse(JSON.stringify(result));
		},

		inputFile(newFile) {
			if (newFile.size > 10485760) {
				this.showAlert({
					status: 'error',
					message: 'file size is is more that 10MB',
					showAlert: true
				});
				return true;
			}
			if (newFile.name.split('.').pop() !== 'csv') {
				this.showAlert({
					status: 'error',
					message: 'file type is not csv',
					showAlert: true
				});
				return true;
			}
			const readFile = async (event) => {
				const csvFilePath = event.target.result;
				this.csvImport.contacts = await this.csvJSON(csvFilePath);
				this.uploadBulkResearch();
			};
			var file = newFile.file;

			var reader = new FileReader();
			reader.readAsText(file);
			reader.addEventListener('load', readFile);
		},
		async uploadBulkResearch() {
			this.loading = true;
			try {
				await this.bulk_research(this.csvImport);
				this.$router.push({ name: 'ContactResearch' });
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
		},

		onKeywordsChange(searchType, event) {
			this.payload[searchType] = event.target.value.split(',');
		},
		async submitSearch() {
			this.loading = true;
			try {
				const response = await this.research(this.payload);
				console.log(response);
				//await this.saveSearchedResult(response.data.data);
				await this.saveSearchPayload(this.payload);
				this.$router.push({ name: 'ContactResearch' });
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
		},
		openConfigModal() {
			this.showConfigModal = !this.showConfigModal;
		},
		gotoSettings() {
			this.closeConfigModal();
			this.showMoreSearchSettings = !this.showMoreSearchSettings;
			this.$router.push('/settings');
		},
		closeMoreSearchSettings() {
			this.showMoreSearchSettings = !this.showMoreSearchSettings;
			const hasHistory = window.history.length > 2;
			if (hasHistory) {
				this.$router.go(-1);
			} else {
				this.$router.push('/');
			}
		},
		routerEventHandler(evtName) {
			this[evtName]();
		},
		closeConfigModal() {
			this.showConfigModal = !this.showConfigModal;
		},
		btnApplyChanges() {
			this.closeMoreSearchSettings();
		},
		setActiveTab(evt) {
			switch (evt) {
				case 'manual_search':
					this.activeTab = evt;
					break;
				case 'import_contacts':
					this.activeTab = evt;
					break;
			}
		}
	},
	watch: {
		$route: {
			immediate: true,
			handler: function (newVal) {
				this.showMoreSearchSettings = newVal.meta && newVal.meta.showMoreSearchSettings ? true : false;
				if (this.showMoreSearchSettings) {
					this.showConfigModal = false;
				} else if (this.userDetails && this.userDetails.is_settings) {
					this.showConfigModal = false;
				} else {
					this.showConfigModal = true;
				}
			}
		}
	},
	computed: {
		...mapGetters({
			userDetails: 'auth/getLoggedUser'
		})
	},
	created() {
		this.getUserSettings();
		// this.openConfigModal()
	}
};
