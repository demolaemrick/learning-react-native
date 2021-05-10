import VCheckbox from '@/components/Checkbox';
import VSelect from '@/components/Select';
import VButton from '@/components/Button';
import VTextInput from '@/components/Input';
import VModal from '@/components/Modal';
import VTabs from '@/components/Tabs';
import VTab from '@/components/Tabs/Tab';
import VToggleDropdown from '@/components/ToggleDropdown';
import { ValidationObserver } from 'vee-validate';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import companyList from '@/data/companies.json';
import Loader from '@/components/Loader';
import FileUpload from 'vue-upload-component';
import Logo from '@/components/Logo';
import VHeader from '@/components/Header/search/Header';
export default {
	name: 'Search',
	components: {
		VCheckbox,
		VSelect,
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
		VHeader
	},
	data() {
		return {
			loading: false,
			company: '',
			showMoreSearch: false,
			showMoreSearchSettings: false,
			disableApplyAll: true,
			applyAllChecked: false,
			disableCompanyAll: true,
			AllCompanyChecked: false,
			keywords: {
				events: [],
				blogs: [],
				features: [],
				awards: [],
				linkedin_activity: [],
				twitter_activity: [],
				promotion: [],
				videos: [],
				podcasts: []
			},
			companyKeywords: {
				job_postings: [],
				mergers_and_acquisitions: [],
				ipo: [],
				product_launch: []
			},
			payload: {
				full_name: '',
				company: '',
				role: '',
				contact_research: {
					events: [],
					blogs: [],
					podcasts: [],
					features: [],
					awards: [],
					promotion: [],
					videos: [],
					linkedin_activity: [],
					twitter_activity: []
				},
				company_research: {
					job_postings: [],
					mergers_and_acquisitions: [],
					ipo: [],
					product_launch: []
				}
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
			try {
				const { status, statusText, data } = await this.getSettings();
				if (status === 200 && statusText === 'OK') {
					const {
						data: { contact_research, company_research }
					} = data;
					if (contact_research) {
						this.payload.contact_research = contact_research;
						let {events} = contact_research
						this.keywords = {events,...contact_research};
					}
					if (company_research) {
						this.payload.company_research = company_research;
						this.companyKeywords = company_research;
					}
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: 'An error occurred',
					showAlert: true
				});
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
		onChildUpdate(newValue) {
			this.payload.company = newValue;
		},
		onOptionToggle(optionTitle, searchType, event) {
			const isChecked = event.target.checked;
			if (searchType === 'contact') {
				const isValidOption = Object.keys(this.payload.contact_research).includes(optionTitle);
				let obj = {};
				if (isValidOption) {
					if (isChecked) {
						obj[optionTitle] = this.keywords[optionTitle];
						this.payload.contact_research = { ...this.payload.contact_research, ...obj };
						return;
					}
					this.payload.contact_research = this.deletePropertyFromObject(optionTitle, this.payload.contact_research);
				}
			} else {
				const isValidOption = Object.keys(this.payload.company_research).includes(optionTitle);
				let obj = {};
				if (isValidOption) {
					if (isChecked) {
						obj[optionTitle] = this.companyKeywords[optionTitle];
						this.payload.company_research = { ...this.payload.company_research, ...obj };
						return;
					}
					this.payload.company_research = this.deletePropertyFromObject(optionTitle, this.payload.company_research);
				}
			}
		},
		onKeywordsChange(optionTitle, searchType, event) {
			if (searchType === 'contact') {
				const isValidOption = Object.keys(this.keywords).includes(optionTitle);
				if (isValidOption) {
					if (optionTitle === 'events' && event.target.value !== '') {
						this.disableApplyAll = false;
					}
					if (optionTitle === 'events' && event.target.value === '') {
						this.disableApplyAll = true;
						this.payload.contact_research[optionTitle] = [];
						this.applyAllChecked = false;
						return;
					}
					this.keywords[optionTitle] = event.target.value.split(',');
					this.payload.contact_research[optionTitle] = this.keywords[optionTitle];
				}
			} else {
				const isValidOption = Object.keys(this.companyKeywords).includes(optionTitle);
				if (isValidOption) {
					if (optionTitle === 'job_postings' && event.target.value !== '') {
						this.disableCompanyAll = false;
					}
					if (optionTitle === 'job_postings' && event.target.value === '') {
						this.disableCompanyAll = true;
						this.payload.company_research[optionTitle] = [];
						this.AllCompanyChecked = false;
						return;
					}
					this.companyKeywords[optionTitle] = event.target.value.split(',');
					this.payload.company_research[optionTitle] = this.companyKeywords[optionTitle];
				}
			}
		},
		applyAllOptionsToggle() {
			this.applyAllChecked = !this.applyAllChecked;
		},
		allCompanyOptionsToggle() {
			this.AllCompanyChecked = !this.AllCompanyChecked;
		},
		async submitSearch() {
			this.loading = true;
			try {
				const response = await this.research(this.payload);
				await this.saveSearchedResult(response.data.data);
				await this.saveSearchPayload(this.payload);
				this.$router.push({ name: 'SearchResult' });
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
		deletePropertyFromObject(property, object) {
			return Object.keys(object).reduce((obj, key) => {
				if (key !== property) {
					obj[key] = object[key];
				}
				return obj;
			}, {});
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
			// this.$router.push('/');
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
		'keywords.events': function (newVal) {
			if (typeof newVal === 'string' && newVal === '') {
				this.applyAllChecked = false;
				this.payload.contact_research['events'] = [];
			}
		},
		applyAllChecked: function (newVal) {
			if (newVal) {
				Object.keys(this.payload.contact_research).forEach((single) => {
					this.payload.contact_research[single] = this.payload.contact_research.events;
					this.keywords[single] = this.payload.contact_research.events;
				});
				return;
			}
			Object.keys(this.payload.contact_research).forEach((single) => {
				if (single === 'events') {
					this.payload.contact_research[single] = this.payload.contact_research.events;
					this.keywords[single] = this.payload.contact_research.events;
					return;
				}
				this.payload.contact_research[single] = [];
				this.keywords[single] = [];
			});
		},
		'companyKeywords.job_postings': function (newVal) {
			if (typeof newVal === 'string' && newVal === '') {
				this.AllCompanyChecked = false;
				this.payload.company_research['job_postings'] = [];
			}
		},
		AllCompanyChecked: function (newVal) {
			if (newVal) {
				Object.keys(this.payload.company_research).forEach((single) => {
					this.payload.company_research[single] = this.payload.company_research.job_postings;
					this.companyKeywords[single] = this.payload.company_research.job_postings;
				});
				return;
			}
			Object.keys(this.payload.company_research).forEach((single) => {
				if (single === 'job_postings') {
					this.payload.company_research[single] = this.payload.company_research.events;
					this.companyKeywords[single] = this.payload.company_research.job_postings;
					return;
				}
				this.payload.company_research[single] = [];
				this.companyKeywords[single] = [];
			});
		},
		$route: {
			immediate: true,
			handler: function (newVal) {
				this.showMoreSearchSettings = newVal.meta && newVal.meta.showMoreSearchSettings;
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
		}),
		companies() {
			return Object.keys(companyList.companies);
		}
	},
	created() {
		this.getUserSettings();
		// this.openConfigModal()
	}
};
