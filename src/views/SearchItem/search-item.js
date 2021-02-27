import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations, mapGetters } from 'vuex';
export default {
	name: 'SearchResult',
	components: {
		VNav,
		ToggleDropdown
	},
	data() {
		return {
			hideSearch: false,
			rows: 1
		};
	},
	watch: {
		hideSearch(value) {
			value ? (this.rows = 30) : (this.rows = 1);
		}
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad'
		}),
		notepad: {
			get() {
				return this.getNotepad;
			},
			set(value) {
				this.saveNotepad(value);
			}
		}
	},
	methods: {
		...mapMutations({
			saveNotepad: 'search_services/saveNotepad'
		}),
		expandNotepad() {
			this.hideSearch = true;
		}
	}
};
