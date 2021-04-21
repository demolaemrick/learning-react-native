import VCheckbox from '@/components/Checkbox';
import VSelect from '@/components/Select';
import VButton from '@/components/Button';
import VTextInput from '@/components/Input';
import VModal from '@/components/Modal';
import VTabs from '@/components/Tabs';
import VTab from '@/components/Tabs/Tab';
import VToggleDropdown from '@/components/ToggleDropdown';
import { ValidationObserver } from 'vee-validate';
import { mapMutations, mapActions } from 'vuex';
import companyList from '@/data/companies.json';
import Loader from '@/components/Loader';
import FileUpload from 'vue-upload-component';
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
		FileUpload
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
			saveSearchedResult: 'search_services/saveSearchedResult'
		}),
		...mapActions({
			research: 'search_services/research',
			showAlert: 'showAlert'
		}),
		csvJSON(csv) {
			var lines = csv.split('\n');

			var result = [];

			// NOTE: If your columns contain commas in their values, you'll need
			// to deal with those before doing the next step
			// (you might convert them to &&& or something, then covert them back later)
			// jsfiddle showing the issue https://jsfiddle.net/
			var headers = lines[0].split(',');

			for (var i = 1; i < lines.length; i++) {
				var obj = {};
				var currentline = lines[i].split(',');

				for (var j = 0; j < headers.length; j++) {
					obj[headers[j]] = currentline[j];
				}

				result.push(obj);
			}

			//return result; //JavaScript object
			console.log(JSON.parse(JSON.stringify(result)));
			return JSON.stringify(result); //JSON
		},

		inputFile(newFile, oldFile) {
			const readFile = (event) => {
				const csvFilePath = event.target.result;
				this.csvJSON(csvFilePath);
			};
			var file = newFile.file;
			var reader = new FileReader();
			reader.addEventListener('load', readFile);
			reader.readAsText(file);

			// Automatically activate upload
			if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
				if (this.uploadAuto && !this.$refs.upload.active) {
					this.$refs.upload.active = true;
				}
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
				if (response.data.status === 'success') {
					await this.saveSearchedResult(response.data.data);
					await this.saveSearchPayload(this.payload);
					this.$router.push({ name: 'SearchResult' });
					return true;
				}
				this.showAlert({
					status: 'error',
					message: 'Something went wrong',
					showAlert: true
				});
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
			this.$router.push('/');
		},
		closeConfigModal() {
			this.showConfigModal = !this.showConfigModal;
		},
		btnApplyChanges() {
			this.closeMoreSearchSettings();
		},
		showSearchPreference() {},
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
			}
		}
	},
	computed: {
		companies() {
			return Object.keys(companyList.companies);
		}
	}
};
