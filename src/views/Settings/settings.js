import VCheckbox from '@/components/Checkbox';
import VSelect from '@/components/Select';
import VButton from '@/components/Button';
import VModal from '@/components/Modal';
import VTextInput from '@/components/Input';
import { ValidationObserver } from 'vee-validate';
import { mapMutations, mapActions } from 'vuex';
import companyList from '@/data/companies.json';
import Loader from '@/components/Loader';
export default {
	name: 'SearchSettings',
	components: {
		VCheckbox,
		VSelect,
		VTextInput,
		VButton,
		VModal,
		ValidationObserver,
		Loader
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
			initialKeywords: {},
			initialCompanyKeywords: {},
			toggleClass: true,
			showModal: false
		};
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_services/saveSearchPayload',
			saveSearchedResult: 'search_services/saveSearchedResult'
		}),
		...mapActions({
			research: 'search_services/research',
			userSettings: 'user/settings',
			showAlert: 'showAlert',
			getSettings: 'user/getSettings'
		}),
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
					if (event.target.value === '') {
						this.keywords[optionTitle] = [];
					}
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
					if (event.target.value === '') {
						this.companyKeywords[optionTitle] = [];
					}
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
		async submitForm() {
			this.loading = true;
			try {
				const response = await this.userSettings(this.payload);
				if (response.status === 200 && response.statusText === 'OK') {
					this.closeMoreSearchSettings();
					this.showAlert({
						status: 'success',
						message: response.data.message,
						showAlert: true
					});

					return true;
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
		closeConfigModal() {
			this.showConfigModal = !this.showConfigModal;
		},
		toggleBodyClass(addRemoveClass, className) {
			const el = document.body;

			if (addRemoveClass === 'addClass') {
				el.classList.add(className);
			} else {
				el.classList.remove(className);
			}
		},
		toggleModal() {
			if (!this.showModal) {
				this.showModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.showModal = !this.showModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		checkSettingChanges() {
			if (
				JSON.stringify(this.initialKeywords) === JSON.stringify(this.keywords) &&
				JSON.stringify(this.initialCompanyKeywords) === JSON.stringify(this.companyKeywords)
			) {
				this.closeMoreSearchSettings();
			} else {
				this.toggleModal();
			}
			this.closeMoreSearchSettings();
		},
		closeMoreSearchSettings() {
			this.$emit('routerEvent', 'closeMoreSearchSettings');
		},
		async getUserSettings() {
			this.loading = false;
			try {
				const { status, statusText, data } = await this.getSettings();
				if (status === 200 && statusText === 'OK') {
					const {
						data: { contact_research, company_research }
					} = data;
					if (contact_research) {
						this.payload.contact_research = contact_research;
						let { events } = contact_research;
						// this.keywords = { events, ...contact_research };
						this.keywords = { ...this.keywords, ...contact_research };
						this.initialKeywords = { events, ...contact_research };
					}
					if (company_research) {
						this.initialCompanyKeywords = { ...company_research };
						this.payload.company_research = company_research;
						this.companyKeywords = { ...this.companyKeywords, ...company_research };
					}
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
		}
	},
	watch: {
		'keywords.events': function(newVal) {
			if (typeof newVal === 'string' && newVal === '') {
				this.applyAllChecked = false;
				this.payload.contact_research['events'] = [];
			}
		},
		applyAllChecked: function(newVal) {
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
		'companyKeywords.job_postings': function(newVal) {
			if (typeof newVal === 'string' && newVal === '') {
				this.AllCompanyChecked = false;
				this.payload.company_research['job_postings'] = [];
			}
		},
		AllCompanyChecked: function(newVal) {
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
		}
	},
	computed: {
		companies() {
			return Object.keys(companyList.companies);
		}
	},
	async created() {
		this.showMoreSearchSettings = false;
		await this.getUserSettings();
	},
	mounted() {
		this.toggleBodyClass('addClass', 'no__scroll');
	},
	destroyed() {
		this.toggleBodyClass('removeClass', 'no__scroll');
	}
};
