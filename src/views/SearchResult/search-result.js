import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import ScreenWidthMixin from '@/mixins/screen-width';
import { response } from '@/data/response.json';
import DotLoader from '@/components/DotLoader.vue';
export default {
	name: 'SearchResult',
	components: {
		VNav,
		ToggleDropdown,
		DCheckbox,
		DropdownCheckbox,
		DotLoader
	},
	mixins: [ScreenWidthMixin],
	data() {
		return {
			companyFilter: [],
			contactFilter: [],
			searchType: 'contact_research',
			response: response,
			researchedPayload: {
				type: Object
			},
			loadMore: false
		};
	},
	mounted() {
		this.getFilterKeys();
		this.researchedPayload = Object.assign({}, this.getPayload);
		this.getNextResearch();
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad',
			getSearchedResult: 'search_services/getSearchedResult',
			getPayload: 'search_services/getPayload'
		}),
		notepad: {
			get() {
				return this.getNotepad;
			},
			set(value) {
				this.saveNotepad(value);
			}
		},
		screenType: {
			get() {
				if (this.screenWidth > 796) {
					this.searchType = '';
					return 'large';
				} else {
					return 'small';
				}
			}
		},
		contact_research: {
			get() {
				let newObj = {};
				const data = this.getSearchedResult.contact_research;

				//const data = this.response.data.contact_research
				// if (this.contactFilter.length === 0) {
				// 	for (const key in data) {
				// 		if (Object.hasOwnProperty.call(data, key) && data[key].length !== 0) {
				// 			const element = data[key];

				// 			newObj[key] = element;
				// 		}
				// 	}
				// } else {

				this.contactFilter.map((value) => {
					const element = Object.keys(data).includes(value) ? data[value] : null;
					newObj[value] = element;
				});

				//}
				return newObj;
			}
		},
		company_research: {
			get() {
				let newObj = {};
				const data = this.getSearchedResult.company_research;
				//const data = this.response.data.company_research
				this.companyFilter.map((value) => {
					const element = Object.keys(data).includes(value) ? data[value] : null;
					newObj[value] = element;
				});

				return newObj;
			}
		}
	},
	methods: {
		...mapMutations({
			saveNotepad: 'search_services/saveNotepad',
			saveSearchedItem: 'search_services/saveSearchedItem',
			saveSearchedResult: 'search_services/saveSearchedResult',
			saveSearchPayload: 'search_services/saveSearchPayload'
		}),
		...mapActions({
			research: 'search_services/research',
			showAlert: 'showAlert'
		}),

		getNextResearch() {
			window.onscroll = async () => {
				if (this.researchedPayload.pagination !== 2) {
					let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
					if (bottomOfWindow) {
						this.loadMore = true;
						this.researchedPayload.pagination = 2;
						try {
							const response = await this.research(this.researchedPayload);
							if (response.data.status === 'success') {
								let data = response.data.data;
								const contact_research = [
									...this.getSearchedResult.contact_research.others,
									...response.data.data.contact_research.others
								];
								const company_research = [
									...this.getSearchedResult.company_research.others,
									...response.data.data.company_research.others
								];
								data.contact_research['others'] = contact_research;
								data.company_research['others'] = company_research;
								await this.saveSearchedResult(data);
								await this.saveSearchPayload(this.researchedPayload);
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
							this.loadMore = false;
						}
					}
				}
			};
		},
		sortByRelevance(researchType) {
			if (researchType === 'contact_research') {
				for (const key in this.contact_research) {
					const element = this.contact_research[key];
					return element.sort((a, b) => (a.meta.relevanceScore < b.meta.relevanceScore ? 1 : -1));
				}
			}
			if (researchType === 'company_research') {
				for (const key in this.company_research) {
					const element = this.company_research[key];
					return element.sort((a, b) => (a.meta.relevanceScore < b.meta.relevanceScore ? 1 : -1));
				}
			}
		},
		sortByRecent(researchType) {
			if (researchType === 'contact_research') {
				for (const key in this.contact_research) {
					const element = this.contact_research[key];
					return element.sort((a, b) => {
						return (
							new Date(b.meta.published != null) - new Date(a.meta.published != null) ||
							new Date(b.meta.published) - new Date(a.meta.published)
						);
					});
				}
			}
			if (researchType === 'company_research') {
				for (const key in this.company_research) {
					const element = this.company_research[key];
					return element.sort((a, b) => {
						return (
							new Date(b.meta.published != null) - new Date(a.meta.published != null) ||
							new Date(b.meta.published) - new Date(a.meta.published)
						);
					});
				}
			}
		},
		displaySearchItem(type, item) {
			const data = {
				type: type,
				item: item
			};
			this.saveSearchedItem(data);
			this.$router.push({ name: 'SearchItem' });
		},
		getFilterKeys() {
			this.contactFilter = [];
			this.companyFilter = [];
			for (const key in this.getSearchedResult.contact_research) {
				//for (const key in this.response.data.contact_research) {
				this.contactFilter.push(key);
			}
			for (const key in this.getSearchedResult.company_research) {
				//for (const key in this.response.data.company_research) {
				this.companyFilter.push(key);
			}
		}
	}
};
