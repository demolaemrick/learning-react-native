import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import VHeader from '@/components/Header/searchResult/Header';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import ScreenWidthMixin from '@/mixins/screen-width';
import DotLoader from '@/components/DotLoader.vue';
import PageLoad from '../Insights/PageLoad.vue';
import InsightCard from '@/components/InsightCard';
import insightMixin from '../../mixins/insightMixin';

export default {
	name: 'Bookmarks',
	components: {
		ToggleDropdown,
		DropdownCheckbox,
		DotLoader,
		PageLoad,
		VHeader,
		InsightCard
	},
	mixins: [ScreenWidthMixin, insightMixin],
	data() {
		return {
			searchType: 'contact_insights',
			loadMore: false,
			bookmarkLoading: true,
			userBookmarks: null,
			rowId: ''
		};
	},
	async created() {
		await this.showUserBookmarks();
	},
	watch: {
		'$route.query': {
			handler(value) {
				if (!value.id) {
					this.showUserBookmarks();
				}
			},
			deep: true
		}
	},
	async mounted() {
		this.rowId = this.$route.query.id;
	},
	computed: {
		...mapGetters({
			bookmarkValue: 'user/getBookmarkvalue'
		}),
		screenType: {
			get() {
				if (this.screenWidth > 796) {
					// this.searchType = '';
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
					const { type } = company_research[0];
					result[type] = { ...company_research };
				}

				if (contact_research && contact_research.length) {
					const { type } = contact_research[0];
					result[type] = { ...contact_research };
				}
			}
			return result;
		},
		contactResearch() {
			let result = {};
			if (this.userBookmarks) {
				const { contact_research } = this.userBookmarks;
				if (contact_research && contact_research.length) {
					result = { ...contact_research };
				}
			}
			return result;
		},
		companyResearch() {
			let result = {};
			if (this.userBookmarks) {
				const { company_research } = this.userBookmarks;
				if (company_research && company_research.length) {
					result = { ...company_research };
				}
			}
			return result;
		}
	},
	methods: {
		...mapMutations({
			saveSearchedResult: 'search_services/saveSearchedResult',
			saveSearchedItem: 'search_notes/saveSearchedItem'
		}),
		...mapActions({
			getUserBookmarks: 'user/getBookmarks',
			showAlert: 'showAlert',
			removeFromBookmarks: 'user/removeFromBookmarks'
		}),
		displayArticle(type, item) {
			const data = {
				type: type,
				item: item
			};
			this.saveSearchedItem(data);
			this.$router.push({ name: 'InsightItem', query: { id: item.rowId } });
		},
		async showUserBookmarks() {
			this.bookmarkLoading = true;
			try {
				const userBookmarks = await this.getUserBookmarks(this.$route.query.id);
				const { status, data, statusText } = userBookmarks;
				if (status === 200 && statusText === 'OK') {
					this.userBookmarks = data.response;
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.bookmarkLoading = false;
			}
		}
	}
};
