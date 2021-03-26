import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import { mapMutations, mapGetters } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import ScreenWidthMixin from '@/mixins/screen-width';
import { response } from '@/data/response.json';
export default {
	name: 'SearchResult',
	components: {
		VNav,
		ToggleDropdown,
		DCheckbox,
		DropdownCheckbox
	},
	mixins: [ScreenWidthMixin],
	data() {
		return {
			companyFilter: [],
			contactFilter: [],
			searchType: 'contact_research',
			response: response
		};
	},
	created() {
		this.getFilterKeys();
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad',
			getSearchedResult: 'search_services/getSearchedResult'
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
			saveSearchedItem: 'search_services/saveSearchedItem'
		}),
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
