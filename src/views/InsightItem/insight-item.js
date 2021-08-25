import { mapMutations, mapGetters, mapActions } from 'vuex';
import CTag from '@/components/Tag';
import LoadingState from '@/components/LoadingState';
import insightMixin from '@/mixins/insightMixin';

export default {
	mixins: [insightMixin],
	name: 'InsightItem',
	components: {
		CTag,
		LoadingState
	},
	data() {
		return {
			hideSearch: false,
			rows: 1,
			searchType: '',
			filterValue: [],
			itemContent: '',
			loading: false,
			can_render: false,
			researchedPayload: {
				type: Object
			},
			tabs: ['All', 'Data', 'E-signature', 'Non-profit'],
			dislikeOption: 'Not relevant to this search'
		};
	},
	watch: {
		hideSearch(value) {
			value ? (this.rows = 30) : (this.rows = 1);
		}
	},
	async mounted() {
		this.getFilterKeys();
		this.searchType = this.getSearchedItem.type;
		await await this.initUserBookmarks();
		await this.initUserNote(this.getSearchedResult.rowId);
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad',
			getSearchedItem: 'search_services/getSearchedItem'
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
				console.log(data);
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
		},
		contact_insights_categories: {
			get() {
				let newObj = {};
				let result = JSON.parse(JSON.stringify(this.getSearchedResult[this.searchType]));
				const data = result.news;
				const tab = this.selectedTab;
				this.tabs = Object.keys(data);

				if (tab === 'All') {
					let newArray = [];
					for (const item in data) {
						newArray = [...newArray, ...data[item]];
					}
					const uniqueArray = [...new Map(newArray.map((item) => [item['url'], item])).values()];
					this.sortByDislike(uniqueArray);
					this.sortByBookmarked(uniqueArray);
					// this.sortInsights(uniqueArray);
					return uniqueArray;
				} else {
					const element = Object.keys(data).includes(tab) ? data[tab] : '';
					newObj[tab] = element;
					this.sortByBookmarked(newObj[tab]);
					this.sortByDislike(newObj[tab]);
					return newObj[tab];
				}
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
				this.sortByBookmarked(newObj[tab]);
				this.sortByDislike(newObj[tab]);
				return newObj[tab];
			}
		},
		contact_other_insights: {
			get() {
				const data = this.getSearchedResult.contact_insights.other_insights;
				let newArray = [];
				for (const item in data) {
					newArray = [...newArray, ...data[item]];
				}
				const uniqueArray = [...new Map(newArray.map((item) => [item['url'], item])).values()];
				this.sortByDislike(uniqueArray);
				this.sortByBookmarked(uniqueArray);
				return uniqueArray;
			}
		}
	},
	methods: {
		...mapMutations({
			saveNotepad: 'search_services/saveNotepad',
			saveSearchPayload: 'search_services/saveSearchPayload'
		}),
		...mapActions({
			content: 'search_services/content',
			fetchResearch: 'search_services/research'
		}),
		sortByRelevance() {
			for (const key in this.research) {
				const element = this.research[key];
				return element.sort((a, b) => (a.meta.relevanceScore < b.meta.relevanceScore ? 1 : -1));
			}
		},
		sortByRecent() {
			for (const key in this.research) {
				const element = this.research[key];
				return element.sort((a, b) => {
					return (
						new Date(b.meta.published != null) - new Date(a.meta.published != null) ||
						new Date(b.meta.published) - new Date(a.meta.published)
					);
				});
			}
		},
		getYYYYMMDD(dob) {
			const d = new Date(dob);
			return new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0];
		},
		fetchContent() {
			this.loading = true;
			this.content(this.getContentPayload)
				.then(async (response) => {
					if (response.data.status === 'success') {
						this.can_render = response.data.data.can_render;
						return true;
					}
					this.showAlert({
						status: 'error',
						message: 'Something went wrong',
						showAlert: true
					});
				})
				.catch((error) => {
					this.showAlert({
						status: 'error',
						message: error.response.data.message,
						showAlert: true
					});
				})
				.finally(() => {
					this.loading = false;
				});
		},
		expandNotepad() {
			this.hideSearch = true;
		},
		async displaySearchItem(type, item) {
			const data = {
				type: type,
				item: item
			};
			await this.saveSearchedItem(data);
		},
		getFilterKeys() {
			this.filterValue = [];
			for (const key in this.getSearchedResult[this.searchType]) {
				this.filterValue.push(key);
			}
		}
	}
};
