import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations, mapGetters } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import CTag from '@/components/Tag';
import DropdownCheckbox from '@/components/DropdownCheckbox';

export default {
	name: 'SearchResult',
	components: {
		VNav,
		ToggleDropdown,
		DCheckbox,
		CTag,
		DropdownCheckbox
	},
	data() {
		return {
			hideSearch: false,
			rows: 1,
			searchType: '',
			filterValue: []
		};
	},
	watch: {
		hideSearch(value) {
			value ? (this.rows = 30) : (this.rows = 1);
		}
	},
	created() {
		this.searchType = this.getSearchedItem.type;
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad',
			getSearchedItem: 'search_services/getSearchedItem',
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
		research: {
			get() {
				let newObj = {};
				const data = this.getSearchedResult[this.searchType];
				if (this.filterValue.length === 0) {
					for (const key in data) {
						if (Object.hasOwnProperty.call(data, key) && data[key].length !== 0) {
							const element = data[key];

							newObj[key] = element;
						}
					}
				} else {
					this.filterValue.map((value) => {
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
		expandNotepad() {
			this.hideSearch = true;
		},
		logFilter() {
			console.log(this.filterValue);
		},
		displaySearchItem(type, item) {
			const data = {
				type: type,
				item: item
			};
			this.saveSearchedItem(data);
		}
	}
};
