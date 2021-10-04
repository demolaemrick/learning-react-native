import { mapMutations, mapGetters, mapActions } from 'vuex';
import CTag from '@/components/Tag';
import PageLoader from '@/components/PageLoader';
import insightMixin from '@/mixins/insightMixin';
import routeMixin from '@/mixins/routeMixin';
import VHeaderitem from '@/components/Header/singleSearch/Header';

export default {
	mixins: [insightMixin, routeMixin],
	name: 'InsightItem',
	components: {
		CTag,
		VHeaderitem,
		PageLoader
	},
	data() {
		return {
			hideSearch: false,
			rows: 1,
			searchType: 'contact_insights',
			filterValue: [],
			itemContent: '',
			loading: false,
			can_render: false,
			researchedPayload: {
				type: Object
			},
			tabs: ['All', 'Data', 'E-signature', 'Non-profit'],
			dislikeOption: 'Not relevant to this search',
			contactSortMethod: '',
			companySortMethod: '',
			rowId: ''
		};
	},
	watch: {
		hideSearch(value) {
			value ? (this.rows = 30) : (this.rows = 1);
		}
	},
	async mounted() {
		// this.rowId = this.getSearchedResult.rowId;
		this.searchType = this.getSearchedItem.type;
		// await this.initUserBookmarks();
		// await this.initUserNote(this.getSearchedResult.rowId);
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_notes/getNotepad',
			getSearchedItem: 'search_notes/getSearchedItem'
		}),
		notepad: {
			get() {
				return this.getNotepad;
			},
			set(value) {
				this.saveNotepad(value);
			}
		},
		company_insights_categories: {
			get() {
				let newObj = {};
				let result = JSON.parse(JSON.stringify(this.getSearchedResult[this.searchType]));
				const data = result.news;
				const tab = this.companyTab;
				const element = Object.keys(data).includes(tab) ? data[tab] : '';
				newObj[tab] = element;
				this.sortByDislike(newObj[tab]);
				this.sortByBookmarked(newObj[tab]);
				return this.checkCompanySort(newObj[tab]);
			},
			set(value) {
				return value;
			}
		},
		quotedArticle() {
			if (this.getSearchedItem.item.meta) {
				return this.getSearchedItem.item;
			}
			// when a quote is clicked, the article is found using the url
			return [...this.contact_insights_categories, ...this.contact_other_insights].find(
				(article) => article.url === this.getSearchedItem.item.article_url
			);
		}
	},
	methods: {
		...mapMutations({
			saveNotepad: 'search_notes/saveNotepad',
			saveSearchPayload: 'search_notes/saveSearchPayload'
		}),
		...mapActions({
			content: 'search_services/content',
			fetchResearch: 'search_services/research'
		}),
		expandNotepad() {
			this.hideSearch = true;
		},
		displaySearchItem(type, item) {
			const data = {
				type: type,
				item: item
			};
			this.saveSearchedItem(data);
			this.$refs.openArticle.scrollTop = 0;
		}
	}
};
