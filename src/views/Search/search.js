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
import csvMixins from '@/mixins/csvMixins';
import ConfigData from '../ConfigImportData/ConfigImportData.vue';
import Datalist from '@/components/Datalist';

export default {
	name: 'Search',
	mixins: [csvMixins],
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
		Logo,
		ConfigData,
		Datalist
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
				company_Url: '',
				company_research: [],
				contact_research: []
			},
			showConfigModal: false,
			accept: 'csv',
			extensions: 'csv',
			files: [],
			activeTab: 'manual_search',
			nameSuggestions: []
		};
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_notes/saveSearchPayload',
			saveSearchedResult: 'search_services/saveSearchedResult',
			logout: 'auth/logout'
		}),
		...mapActions({
			research: 'search_services/research',
			researchSuggestions: 'search_services/researchSuggestions',
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

		async uploadBulkResearch() {
			this.loading = true;
			try {
				await this.bulk_research(this.csvImport);
				this.openConfigPage = false;
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
		setSuggestion(suggestion) {
			this.payload.full_name = suggestion.name;
			this.payload.role = suggestion.role;
			this.payload.company = suggestion.company;
		},
		async submitSearch() {
			this.loading = true;
			try {
				await this.research(this.payload);
				this.saveSearchPayload(this.payload);
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
		},
		async getSuggestion(event, queryType) {
			const searchQuery = event.target.value;
			// when data list suggestion is selected, weirdly
			// the keyup event is still triggered, but with
			// keyCode as undefined. So we'll check keyCode to
			// validate if it's an actuall keyup event.
			const notAnActualKeyPress = event.keyCode === undefined;
			if (searchQuery.length < 2 || notAnActualKeyPress) {
				return;
			}

			try {
				const response = await this.researchSuggestions({
					type: queryType,
					query: searchQuery
				});

				let suggestions = response.data.data;
				suggestions = suggestions.map((item) => {
					const label = `${item.name} (${item.role}, ${item.company})`;
					return { ...item, suggestionLabel: label };
				});
				this.nameSuggestions = suggestions;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
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
	}
};
