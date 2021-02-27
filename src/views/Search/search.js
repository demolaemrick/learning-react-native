import VCheckbox from '@/components/Checkbox';
import VSelect from '@/components/Select';
import VButton from '@/components/Button';
import VTextInput from '@/components/Input';
import { ValidationObserver } from 'vee-validate';
import { mapMutations } from 'vuex';
import companyList from '@/data/companies.json';
export default {
	name: 'Search',
	components: {
		VCheckbox,
		VSelect,
		VTextInput,
		VButton,
		ValidationObserver
	},
	data() {
		return {
			company: '',
			showMoreSearch: false,
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
				product_launch: [],
				others: []
			},
			payload: {
				full_name: '',
				company: '',
				role: '',
				contact_search: {
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
				company_search: {
					job_postings: [],
					mergers_and_acquisitions: [],
					ipo: [],
					product_launch: [],
					others: []
				}
			}
		};
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_services/saveSearchPayload'
		}),
		onChildUpdate(newValue) {
			this.payload.company = newValue;
		},
		onOptionToggle(optionTitle, searchType, event) {
			const isChecked = event.target.checked;
			if (searchType === 'contact') {
				const isValidOption = Object.keys(this.payload.contact_search).includes(optionTitle);
				let obj = {};
				if (isValidOption) {
					if (isChecked) {
						obj[optionTitle] = this.keywords[optionTitle];
						this.payload.contact_search = { ...this.payload.contact_search, ...obj };
						return;
					}
					this.payload.contact_search = this.deletePropertyFromObject(optionTitle, this.payload.contact_search);
				}
			} else {
				const isValidOption = Object.keys(this.payload.company_search).includes(optionTitle);
				let obj = {};
				if (isValidOption) {
					if (isChecked) {
						obj[optionTitle] = this.companyKeywords[optionTitle];
						this.payload.company_search = { ...this.payload.company_search, ...obj };
						return;
					}
					this.payload.company_search = this.deletePropertyFromObject(optionTitle, this.payload.company_search);
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
						this.payload.contact_search[optionTitle] = [];
						this.applyAllChecked = false;
						return;
					}
					this.keywords[optionTitle] = event.target.value.split(',');
					this.payload.contact_search[optionTitle] = this.keywords[optionTitle];
				}
			} else {
				const isValidOption = Object.keys(this.companyKeywords).includes(optionTitle);
				if (isValidOption) {
					if (optionTitle === 'job_postings' && event.target.value !== '') {
						this.disableCompanyAll = false;
					}
					if (optionTitle === 'job_postings' && event.target.value === '') {
						this.disableCompanyAll = true;
						this.payload.company_search[optionTitle] = [];
						this.AllCompanyChecked = false;
						return;
					}
					this.companyKeywords[optionTitle] = event.target.value.split(',');
					this.payload.company_search[optionTitle] = this.companyKeywords[optionTitle];
				}
			}
		},
		applyAllOptionsToggle() {
			this.applyAllChecked = !this.applyAllChecked;
		},
		allCompanyOptionsToggle() {
			this.AllCompanyChecked = !this.AllCompanyChecked;
		},
		submitSearch() {
			console.log('Here is the payload to be send', this.payload);
			this.saveSearchPayload(this.payload);
			this.$router.push({ name: 'SearchResult' });
		},
		deletePropertyFromObject(property, object) {
			return Object.keys(object).reduce((obj, key) => {
				if (key !== property) {
					obj[key] = object[key];
				}
				return obj;
			}, {});
		}
	},
	watch: {
		'keywords.events': function (newVal) {
			if (typeof newVal === 'string' && newVal === '') {
				this.applyAllChecked = false;
				this.payload.contact_search['events'] = [];
			}
		},
		applyAllChecked: function (newVal) {
			if (newVal) {
				Object.keys(this.payload.contact_search).forEach((single) => {
					this.payload.contact_search[single] = this.payload.contact_search.events;
					this.keywords[single] = this.payload.contact_search.events;
				});
				return;
			}
			Object.keys(this.payload.contact_search).forEach((single) => {
				if (single === 'events') {
					this.payload.contact_search[single] = this.payload.contact_search.events;
					this.keywords[single] = this.payload.contact_search.events;
					return;
				}
				this.payload.contact_search[single] = [];
				this.keywords[single] = [];
			});
		},
		'companyKeywords.job_postings': function (newVal) {
			if (typeof newVal === 'string' && newVal === '') {
				this.AllCompanyChecked = false;
				this.payload.company_search['job_postings'] = [];
			}
		},
		AllCompanyChecked: function (newVal) {
			if (newVal) {
				Object.keys(this.payload.company_search).forEach((single) => {
					this.payload.company_search[single] = this.payload.company_search.job_postings;
					this.companyKeywords[single] = this.payload.company_search.job_postings;
				});
				return;
			}
			Object.keys(this.payload.company_search).forEach((single) => {
				if (single === 'job_postings') {
					this.payload.company_search[single] = this.payload.company_search.events;
					this.companyKeywords[single] = this.payload.company_search.job_postings;
					return;
				}
				this.payload.company_search[single] = [];
				this.companyKeywords[single] = [];
			});
		}
	},
	computed: {
		companies() {
			return Object.keys(companyList.companies);
		}
	}
};
