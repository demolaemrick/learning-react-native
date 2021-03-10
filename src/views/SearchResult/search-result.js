import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import { mapMutations, mapGetters } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import ScreenWidthMixin from '@/mixins/screen-width';
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
			searchType: 'contact_research'
		};
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
		screenType:{
			get() {
				if (this.screenWidth > 796) {
					this.searchType = '';
					return 'large';
				}
				else{
					return 'small';
				}
			}
			
		},
		contact_research: {
			get() {
				let newObj = {};
				const data = this.getSearchedResult.contact_research;
				if (this.contactFilter.length === 0) {
					for (const key in data) {
						if (Object.hasOwnProperty.call(data, key) && data[key].length !== 0) {
							const element = data[key];

							newObj[key] = element;
						}
					}
				} else {
					this.contactFilter.map((value) => {
						const element = Object.keys(data).includes(value) ? data[value] : null;
						newObj[value] = element;
					});
				}
				return newObj;
			}
		},
		company_research: {
			get() {
				let newObj = {};
				const data = this.getSearchedResult.company_research;
				if (this.companyFilter.length === 0) {
					for (const key in data) {
						if (Object.hasOwnProperty.call(data, key) && data[key].length !== 0) {
							const element = data[key];
							newObj[key] = element;
						}
					}
				} else {
					this.companyFilter.map((value) => {
						const element = Object.keys(data).includes(value) ? data[value] : null;
						newObj[value] = element;
					});
				}
				return newObj;
			}
		}
	},
	methods: {
		...mapMutations({
			saveNotepad: 'search_services/saveNotepad',
			saveSearchedItem: 'search_services/saveSearchedItem'
		}),
		displaySearchItem(type, item) {
			const data = {
				type: type,
				item: item
			};
			this.saveSearchedItem(data);
			this.$router.push({ name: 'SearchItem' });
		}
	}
};
