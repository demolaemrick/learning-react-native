import { mapActions } from 'vuex';
import ScreenWidthMixin from '@/mixins/screen-width';
import PageLoad from './PageLoad.vue';
import PieChart from '@/components/PieChart';
import { Tweet } from 'vue-tweet-embed';
import LoadIcon from '@/components/LoadIcon';
import { debounce } from 'lodash';

import insightMixin from '@/mixins/insightMixin';

export default {
	name: 'Insights',
	components: {
		PageLoad,
		PieChart,
		Tweet,
		LoadIcon
	},
	mixins: [ScreenWidthMixin, insightMixin],
	data() {
		return {
			tweetId: '1417604296422694913',
			searchType: 'contact_research',
			contact_details: '',
			insightStatus: '',
			loadMore: false,
			searchedResult: {},
			loading: true,
			userBookmarks: '',
			bookmarkLoading: true,
			markDone: false,
			tabs: [],
			contactFilter: null,
			companyFilter: null,
			contactInsightsTab: [
				{ title: 'Snapshot', ref: 'snapshot' },
				{ title: 'News & article', ref: 'news-section' },
				{ title: 'Quotes', ref: 'quotes' },
				{ title: 'Topics', ref: 'topics' },
				{ title: 'Other insights', ref: 'others' }
			],
			selectedInsightTab: 'Snapshot',
			refreshLoading: false,
			dislikeOption: null,
			otherComment: null,
			mainTopics: ['Data', 'E-signature', 'Non-profit'],
			chartData: [300, 250, 100],
			contactSearchResult: [],
			companySearchResult: []
		};
	},
	async created() {
		this.loading = true;
		if (this.$route.query.rowId) {
			this.rowId = this.$route.query.rowId;
			await this.getResult();
			await this.initUserBookmarks();
			await this.initUserNote(this.rowId);
		} else {
			this.$router.push({ name: 'Search' });
		}
	},
	computed: {
		socials: {
			get() {
				if (this.searchedResult.socials) {
					return this.searchedResult.socials.filter((x) => {
						return !Object.values(x).every((i) => i === null);
					});
				}
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
		contact_insights: {
			get() {
				return this.getSearchedResult.contact_insights;
			}
		},
		company_insights: {
			get() {
				return this.getSearchedResult.company_insights;
			}
		},
		contact_insights_categories: {
			get() {
				let newObj = {};
				let result = JSON.parse(JSON.stringify(this.getSearchedResult.contact_insights));
				const data = result.news;
				const tab = this.selectedTab;
				this.tabs = Object.keys(data);

				if (tab === 'All') {
					let newArray = [];
					for (const item in data) {
						newArray = [...newArray, ...data[item]];
					}
					const uniqueArray = [...new Map(newArray.map((item) => [item['url'], item])).values()];
					this.sortInsights(uniqueArray);
					return uniqueArray;
				} else {
					const element = Object.keys(data).includes(tab) ? data[tab] : '';
					newObj[tab] = element;
					this.sortInsights(newObj[tab]);
					return newObj[tab];
				}
			}
		},
		company_insights_categories: {
			get() {
				let newObj = {};
				let result = JSON.parse(JSON.stringify(this.getSearchedResult.company_insights));
				const data = result.news;
				//const data = result.news;
				const tab = this.companyTab;
				const element = Object.keys(data).includes(tab) ? data[tab] : '';
				newObj[tab] = element;
				this.sortInsights(newObj[tab]);
				return newObj;
			}
		},
		userBookmarksCount() {
			let total = 0;
			if (this.userBookmarks) {
				const { company_research, contact_research } = this.userBookmarks;
				if (company_research && contact_research) {
					total = company_research.length + contact_research.length;
				}
			}
			return total;
		},
		showFirstBookmark() {
			let result = {
				contact_research: '',
				company_research: ''
			};
			if (this.userBookmarks) {
				const { company_research, contact_research } = this.userBookmarks;
				if (company_research && company_research.length) {
					const { type } = company_research[0];
					result[type] = company_research[0];
				}

				if (contact_research && contact_research.length) {
					const { type } = contact_research[0];
					result[type] = contact_research[0];
				}
			}

			return result;
		}
	},
	methods: {
		...mapActions({
			researchedResult: 'search_services/researchedResult',
			researchDone: 'search_services/researchDone',
			refresh: 'search_services/refresh',
			subscribeResearch: 'search_services/subscribeResearch'
		}),
		scrollToSection(section) {
			this.selectedInsightTab = section.title;
			var element = this.$refs[section.ref];
			var top = element.offsetTop;
			window.scrollTo(0, top);
		},
		getRowID() {
			const { rowId } = this.getSearchedResult;
			this.rowId = rowId;
		},
		async RefreshResearch() {
			this.refreshLoading = true;
			try {
				const response = await this.refresh(this.$route.query.rowId);
				const { data, status } = response;
				if (status === 200) {
					if (data.data.status.statusCode === 'UPDATING') {
						this.showAlert({
							status: 'info',
							message: 'Research update in progress',
							showAlert: true
						});
						this.subscribe();
					}
				}
			} catch (error) {
				console.log(error);
			}
		},
		async subscribe() {
			try {
				const response = await this.subscribeResearch();
				if (response.status === 200) {
					const { contact_details, status } = response.data.done;
					if (status.statusCode === 'READY') {
						this.contact_details = contact_details;
						this.insightStatus = status;
						this.refreshLoading = false;
						await this.saveSearchedResult(response.data.done);
						this.showAlert({
							status: 'success',
							message: 'Research updated successfully',
							showAlert: true
						});
					}
				}
				return true;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		async markResearch() {
			try {
				const response = await this.researchDone(this.rowId);
				const { status, data, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					this.showAlert({
						status: 'success',
						message: data.message,
						showAlert: true
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getResult() {
			this.loading = true;
			try {
				const response = await this.researchedResult(this.$route.query.rowId);
				const { contact_details, status } = response.data.data;
				this.contact_details = contact_details;
				this.insightStatus = status;
				this.saveSearchedResult(response.data.data);
				this.insightStatus.statusCode === 'UPDATING' ? this.subscribe() : null;
				return true;
			} catch (error) {
				console.log(error);
			} finally {
				this.loading = false;
			}
		},
		sortByRelevance(researchType) {
			Object.values(this[researchType].news).map((news) => {
				return news.sort((a, b) => (a.meta.relevanceScore < b.meta.relevanceScore ? 1 : -1));
			});
		},
		sortByRecent(researchType) {
			Object.values(this[researchType].news).map((news) => {
				return news.sort((a, b) => {
					return (
						new Date(b.meta.published != null) - new Date(a.meta.published != null) ||
						new Date(b.meta.published) - new Date(a.meta.published)
					);
				});
			});
		},
		displaySearchItem(type, item) {
			const data = {
				type: type,
				item: item
			};
			this.saveSearchedItem(data);
			this.$router.push({ name: 'InsightItem' });
		},
		validateURL(link) {
			if (link.indexOf('https://') === 0 || link.indexOf('http://') === 0) {
				return link;
			} else {
				return `https://${link}`;
			}
		},
		companySearch(payload) {
			const companySearchClone = { ...this.getSearchedResult };
			let matchedResults = [];

			for (const key in companySearchClone) {
				if (key === 'company_insights') {
					let search = companySearchClone[key].news;
					Object.values(search).forEach((array) => {
						let matched = array.filter(
							(obj) =>
								obj.title.toLowerCase().match(payload.toLowerCase()) ||
								obj.description.toLowerCase().match(payload.toLowerCase())
						);
						matchedResults = [...matchedResults, ...matched];
					});
				}
			}
			this.companyFilter = matchedResults.length ? 'search' : 'empty';
			this.companySearchResult = matchedResults;
		},
		contactSearch(payload) {
			const contactSearchClone = { ...this.getSearchedResult };
			let matchedResults = [];

			for (const key in contactSearchClone) {
				if (key === 'contact_insights') {
					let search = contactSearchClone[key].news;
					Object.values(search).forEach((array) => {
						let matched = array.filter(
							(obj) =>
								obj.title.toLowerCase().match(payload.toLowerCase()) ||
								obj.description.toLowerCase().match(payload.toLowerCase())
						);
						matchedResults = [...matchedResults, ...matched];
					});
				}
			}
			this.contactFilter = matchedResults.length ? 'search' : null;
			this.contactSearchResult = matchedResults;
		},
		clearContactSearch() {
			this.contactSearchResult = [];
			this.contactSearchQuery = '';
		},
		clearCompanySearch() {
			this.companySearchResult = [];
			this.companySearchQuery = '';
		}
	},
	watch: {
		contactSearchQuery: debounce(function(newVal) {
			if (newVal) {
				this.contactSearch(newVal);
			} else {
				this.contactSearchResult = [];
				this.contactFilter = null;
			}
		}, 600),
		companySearchQuery: debounce(function(newVal) {
			if (newVal) {
				this.companySearch(newVal);
			} else {
				this.companySearchResult = [];
				this.companyFilter = null;
			}
		}, 600),
		loading(value) {
			if(!value) {
				this.$nextTick(() => {
					const { tabWrapper, content } = this.$refs;
					console.log(tabWrapper);
					const [tabWrapperWidth, contentWidth] = [tabWrapper.clientWidth - 49, content.clientWidth];
					const contentWidthPercentage = contentWidth / tabWrapperWidth * 100;
					console.log(contentWidthPercentage);
				})
			}
		}
	}
};
