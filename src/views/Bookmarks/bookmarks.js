import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import VHeader from '@/components/Header/searchResult/Header';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import ScreenWidthMixin from '@/mixins/screen-width';
import { response } from '@/data/response.json';
import DotLoader from '@/components/DotLoader.vue';
export default {
	name: 'Bookmarks',
	components: {
		VNav,
		ToggleDropdown,
		DCheckbox,
		DropdownCheckbox,
		DotLoader,
		VHeader
	},
	mixins: [ScreenWidthMixin],
	data() {
		return {
			loadMore: false,
			bookmarkLoading: true,
			userBookmarks: null
		};
	},
	async created() {
	await this.initUserBookmarks()
	},
	computed: {
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
		allBookMarks() {
			let result = {
				contact_research: '',
				company_research: ''
			};

			if (this.userBookmarks) {
				const { company_research, contact_research } = this.userBookmarks;
				if (company_research && company_research.length) {
					const { type, description } = company_research[0];
					result[type] = { ...company_research };
				}

				if (contact_research && contact_research.length) {
					const { type, description } = contact_research[0];
					result[type] = { ...contact_research };
				}
			}
			return result;
		},
		contactResearch() {
			let result = {}
			if (this.userBookmarks) {
				const { contact_research } = this.userBookmarks;
				if (contact_research && contact_research.length) {
					result = {...contact_research}
				}
			}
			return result
		},
		companyResearch() {
			let result = {}
			if (this.userBookmarks) {
				const { company_research } = this.userBookmarks;
				if (company_research && company_research.length) {
					result = {...company_research}
				}
			}
			return result
		}
	},
	methods: {
		...mapActions({
			getUserBookmarks: 'user/getBookmarks',
			showAlert: 'showAlert'
		}),

		async initUserBookmarks() {
			try {
				const userBookmarks = await this.getUserBookmarks();
				const { status, data, statusText } = userBookmarks;
				if (status === 200 && statusText === 'OK') {
					this.userBookmarks = data.response;
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.bookmarkLoading = false;
			}
		},
	}
};
