import { mapMutations, mapGetters, mapActions } from 'vuex';
import CTag from '@/components/Tag';
import PageLoader from '@/components/PageLoader';
import routeMixin from '@/mixins/routeMixin';
import insightMixin from '@/mixins/insightMixin';
import VHeaderitem from '@/components/Header/singleSearch/Header';
import Loader from '@/components/Loader';
import Notepad from '@/components/Notepad';

export default {
	mixins: [insightMixin, routeMixin],
	name: 'InsightItem',
	components: {
		CTag,
		VHeaderitem,
		PageLoader,
		Loader,
		Notepad
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
			rowId: '',
			isFromAdmin: false,
			sending: false
		};
	},
	watch: {
		hideSearch(value) {
			value ? (this.rows = 10) : (this.rows = 1);
		}
	},
	created() {
		this.isFromAdmin = this.$route.name === 'AdminInsightItem' ? true : false;
		this.initUserNote(this.$route.query.id);
	},
	async mounted() {
		this.searchType = this.getSearchedItem.type;
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
		// company_insights_categories: {
		// 	get() {
		// 		let newObj = {};
		// 		let result = JSON.parse(JSON.stringify(this.getSearchedResult[this.searchType]));
		// 		const data = result.news;
		// 		const tab = this.companyTab;
		// 		const element = Object.keys(data).includes(tab) ? data[tab] : '';
		// 		newObj[tab] = element;
		// 		const sorted = this.checkCompanySort(newObj[tab]);
		// 		console.log(sorted);
		// 		const disLiked = this.sortByDislike(sorted);
		// 		const byImportance = this.sortByImportant(sorted);
		// 		const bookMarked = this.sortByBookmarked(sorted);
		// 		const ordinary = this.getOrdinaryArticles(sorted);
		// 		return [...bookMarked, ...byImportance, ...ordinary, ...disLiked];
		// 	},
		// 	set(value) {
		// 		return value;
		// 	}
		// },
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
			this.activeTetxArea = true;
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
