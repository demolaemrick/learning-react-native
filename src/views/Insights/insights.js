import { mapActions } from 'vuex';
import ScreenWidthMixin from '@/mixins/screen-width';
import PageLoad from './PageLoad.vue';
import PieChart from '@/components/PieChart';
import { Tweet } from 'vue-tweet-embed';
import LoadIcon from '@/components/LoadIcon';
import { debounce } from 'lodash';
import VHeader from '@/components/Header/searchResult/Header';
import VButton from '@/components/Button';

import insightMixin from '@/mixins/insightMixin';

export default {
	name: 'Insights',
	components: {
		PageLoad,
		PieChart,
		Tweet,
		LoadIcon,
		VHeader,
		VButton
	},
	mixins: [ScreenWidthMixin, insightMixin],
	data() {
		return {
			tweetId: '1417604296422694913',
			searchType: 'contact_insights',
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
				{ title: 'News & articles', ref: 'news-section' },
				{ title: 'Quotes', ref: 'quotes' },
				{ title: 'Topics', ref: 'topics' },
				{ title: 'Other insights', ref: 'others' }
			],
			selectedInsightTab: 'Snapshot',
			refreshLoading: false,
			dislikeOption: null,
			otherComment: null,
			mainTopics: ['Data', 'E-signature', 'Non-profit'],
			contactSearchResult: [],
			companySearchResult: [],
			contactSortMethod: '',
			companySortMethod: '',
			showAllQuotes: false,
			quoteList: []
		};
	},
	async created() {
		this.loading = true;
		if (this.$route.query.id) {
			this.rowId = this.$route.query.id;
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
		getLinkedinUrl: {
			get() {
				const url = this.contact_details.socials.find((element) => {
					return Object.keys(element).includes('linkedin');
				});
				return url ? `https://${url.linkedin}/detail/recent-activity` : null;
			}
		},
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
		contact_insights: {
			get() {
				return JSON.parse(JSON.stringify(this.getSearchedResult.contact_insights));
			}
		},
		company_insights: {
			get() {
				return JSON.parse(JSON.stringify(this.getSearchedResult.company_insights));
			}
		},
		allQuotes() {
			this.quoteList = this.getSearchedResult.contact_insights.quotes;
			return this.quoteList;
		},
		company_insights_categories: {
			get() {
				let newObj = {};
				let result = JSON.parse(JSON.stringify(this.getSearchedResult.company_insights));
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
		chartData() {
			const topTags = this.getSearchedResult.contact_insights.top_tags;
			return {
				values: topTags.map((item) => item.count),
				labels: topTags.map((item) => item.tag)
			};
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
		},
		getTabs() {
			const insightsArray = [];
			const insights = this.getSearchedResult.contact_insights;
			if (Object.values(insights.snapshot).length) {
				insightsArray.push({ title: 'Snapshot', ref: 'snapshot' });
			}
			if (Object.values(insights.news).length) {
				insightsArray.push({ title: 'News & articles', ref: 'news-section' });
			}
			if (insights.quotes.length) {
				insightsArray.push({ title: 'Quotes', ref: 'quotes' });
			}
			if (Object.values(insights.topics).length) {
				insightsArray.push({ title: 'Topics', ref: 'topics' });
			}
			if (Object.values(insights.other_insights).length) {
				insightsArray.push({ title: 'Other insights', ref: 'others' });
			}
			return insightsArray;
		}
	},
	methods: {
		...mapActions({
			researchedResult: 'search_services/researchedResult',
			researchDone: 'search_services/researchDone',
			refresh: 'search_services/refresh',
			subscribeResearch: 'search_services/subscribeResearch'
		}),
		switchToCompanyTab(tab) {
			this.companyTab = tab;
		},
		scrollToSection(section) {
			this.selectedInsightTab = section.title;
			var element = this.$refs[section.ref];
			var top = element.offsetTop;
			window.scrollTo(0, top);
			if (section.activate) {
				section.activate();
			}
		},

		/** API response structure for single research
		 * changed. Function below is to handle the changes by refactoring the incoming data to it's previous structure
		 * and prevent discrepancies.
		 */
		changeToLegacyResponse(newData) {
			const oldData = JSON.parse(JSON.stringify(newData));
			let oldNews = {};
			newData.contact_insights.news.forEach((article) => {
				article.content.tag = article.content.tags;
				const tags = [...article.tags];
				if (!tags.length) {
					// use article url to create a dummy
					// tag for articles that don't have tags
					tags.push(article.url);
				}
				tags.forEach((tag) => {
					if (oldNews[tag]) {
						oldNews[tag].push(article);
					} else {
						oldNews[tag] = [article];
					}
				});
			});
			oldData.contact_insights.news = oldNews;

			let oldOtherInsights = {};
			newData.contact_insights.other_insights.forEach((article) => {
				article.content.tag = article.content.tags;

				// other insights no longer includes tags so we group
				// by article url to adhere to the previous
				// code structure
				if (oldOtherInsights[article.url]) {
					oldOtherInsights[article.url].push(article);
				} else {
					oldOtherInsights[article.url] = [article];
				}
			});
			oldData.contact_insights.other_insights = oldOtherInsights;

			return oldData;
		},
		getRowID() {
			const { rowId } = this.getSearchedResult;
			this.rowId = rowId;
		},
		async RefreshResearch() {
			this.refreshLoading = true;
			try {
				const response = await this.refresh(this.$route.query.id);
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
						const refactored = this.changeToLegacyResponse(response.data.done);
						await this.saveSearchedResult(refactored);
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
				const response = await this.researchedResult(this.$route.query.id);
				const { contact_details, status } = response.data.data;
				this.contact_details = contact_details;
				this.insightStatus = status;
				const refactored = this.changeToLegacyResponse(response.data.data);
				await this.saveSearchedResult(refactored);
				this.insightStatus.statusCode === 'UPDATING' ? this.subscribe() : null;
				return true;
			} catch (error) {
				console.log(error);
			} finally {
				this.loading = false;
			}
		},
		displaySearchItem(type, item) {
			console.log('vfwhekfuwbulfijw', item);
			const data = {
				type,
				item
			};
			this.saveSearchedItem(data);
			this.$router.push({ name: 'InsightItem' });
		},

		generateIntroEmail(type, item) {
			console.log(type, item);
			const data = {
				type,
				item
			};
			this.saveSearchedItem(data);
			this.$router.push({ name: 'EmailHook' });
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
		},
		scrollSection() {
			console.log('dgddggsfhkjfljf');
			this.$refs.quoteList.scrollTop += 600;
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
		}, 600)
	}
};
