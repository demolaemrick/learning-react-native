import { mapActions, mapMutations, mapGetters } from 'vuex';
import ScreenWidthMixin from '@/mixins/screen-width';
import PageLoad from '@/components/PageLoader';
import TextInput from '@/components/Input';
import PieChart from '@/components/PieChart';
import { Tweet } from 'vue-tweet-embed';
import Loader from '@/components/Loader';
import LoadIcon from '@/components/LoadIcon';
import { debounce } from 'lodash';
import VHeader from '@/components/Header/searchResult/Header';
import VButton from '@/components/Button';
import RadioBoxes from '@/components/RadioBoxes';
import Notepad from '@/components/Notepad';

import insightMixin from '@/mixins/insightMixin';
import inputMixin from '@/mixins/input';
import routeMixin from '@/mixins/routeMixin';
import globalMixins from '@/mixins/globalMixins';
// console.log(globalMixins);
export default {
	name: 'Insights',
	components: {
		PageLoad,
		PieChart,
		Tweet,
		LoadIcon,
		VHeader,
		VButton,
		Loader,
		TextInput,
		RadioBoxes,
		Notepad
	},
	mixins: [ScreenWidthMixin, insightMixin, inputMixin, routeMixin, globalMixins],
	data() {
		return {
			tweetId: '1417604296422694913',
			searchType: 'contact_insights',
			contact_details: '',
			company_details: '',
			insightStatus: '',
			toggleClass: true,
			modalData: {},
			loadMore: false,
			addArticle: false,
			articleUrl: '',
			articleTitle: '',
			articleDecript: '',
			searchedResult: {},
			loading: true,
			sending: false,
			allBookmarks: '',
			bookmarkLoading: true,
			markDone: false,
			tabs: [],
			contactFilter: null,
			companyFilter: null,
			editNote: false,
			hide_aside: false,
			contactInsightsTab: [
				{ title: 'Snapshot', ref: 'snapshot' },
				{ title: 'News & articles', ref: 'news-section' },
				{ title: 'Quotes', ref: 'quotes' },
				{ title: 'Topics', ref: 'topics' },
				{ title: 'Other insights', ref: 'others' }
			],
			selectedInsightTab: 'Snapshot',
			refreshLoading: false,
			dislikeOption: '',
			otherComment: null,
			mainTopics: ['Data', 'E-signature', 'Non-profit'],
			contactSearchResult: [],
			companySearchResult: [],
			contactSortMethod: '',
			companySortMethod: '',
			quoteList: [],
			userImages: [],
			row_Id: '',
			articleType: '',
			articleTypes: [
				{
					name: 'Contact Insight',
					value: 'contact_research'
				},
				{
					name: 'Company Insight',
					value: 'company_research'
				}
			],
			params: null,
			isFromAdmin: false,
			sendingNote: false,
			bookmarkCount: 0
		};
	},

	computed: {
		...mapGetters({
			loggedInUser: 'auth/getLoggedUser'
		}),
		getLinkedinUrl: {
			get() {
				if (this.contact_details.socials.linkedin) {
					const url = this.contact_details.socials.linkedin;
					if (url && (url.startsWith('http') || url.startsWith('https'))) {
						return `${url}/detail/recent-activity`;
					}
					return url ? `https://${url}/detail/recent-activity` : null;
				}
			}
		},
		getCrunchbaseUrl() {
			const url = this.company_details.socials.crunchbase;
			if (url && (url.startsWith('http') || url.startsWith('https'))) {
				return url;
			}
			return url ? `https://${url}` : null;
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

		chartData() {
			const topTags = this.getSearchedResult.contact_insights.top_tags;
			return {
				values: topTags.map((item) => item.count),
				labels: topTags.map((item) => item.tag)
			};
		},
		userBookmarksCount() {
			let total = 0;
			if (this.allBookmarks) {
				const { company_research, contact_research } = this.allBookmarks;
				if (company_research && contact_research) {
					total += this.contact_insights_categories.filter((article) => {
						return article.is_bookmarked;
					}).length;

					total += this.contact_other_insights.filter((article) => {
						return article.is_bookmarked;
					}).length;

					total += this.company_insights_categories.filter((article) => {
						return article.is_bookmarked;
					}).length;
				}
			}
			return total;
		},
		contactImage() {
			if (!this.contact_details.images) {
				return;
			}
			const images = [...this.contact_details.images];
			this.userImages = this.userImages.length ? this.userImages : images;
			if (this.userImages && this.userImages.length) {
				return this.userImages[Math.floor(Math.random() * this.userImages.length)];
			}
		},
		showFirstBookmark() {
			let result = {
				contact_research: '',
				company_research: ''
			};
			if (this.allBookmarks) {
				const { company_research, contact_research } = this.allBookmarks;
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
		},
		showSnapshots() {
			const snapshot = this.company_insights.snapshot;
			return Object.keys(snapshot).some((key) => {
				const snapshotItem = snapshot[key];
				return Array.isArray(snapshotItem) ? Boolean(snapshotItem.length) : Boolean(snapshotItem);
			});
		},
		// 	showContactSnapshots() {
		// 		const snapshot = this.contact_insights.snapshot
		// 		return Object.keys(snapshot).some((key) => {
		// 				const snapshotItem = snapshot[key]
		// 				return Array.isArray(snapshotItem) ? Boolean(snapshotItem.length) : Boolean(snapshotItem)
		// 		});
		// },
		showNewsSection() {
			return Object.keys(this.company_insights.news).some((key) => {
				if (this.company_insights.news[key].length) {
					return true;
				}
			});
		}
	},
	created() {
		this.row_Id = this.$route.query.id;
		this.isFromAdmin = this.$route.name === 'AdminInsights' ? true : false;
	},
	methods: {
		...mapMutations({
			setBookmarkValue: 'user/setBookmarkValue'
		}),
		...mapActions({
			researchedResult: 'search_services/researchedResult',
			researchDone: 'search_services/researchDone',
			refresh: 'search_services/refresh',
			subscribeResearch: 'search_services/subscribeResearch',
			addArticleURL: 'search_services/addArticleURL',
			showAlert: 'showAlert'
		}),
		removeBrokenImage(event) {
			const brokenSrc = event.target.currentSrc;
			const brokenSrcIndex = this.userImages.indexOf(brokenSrc);

			if (brokenSrcIndex > -1) {
				this.userImages.splice(brokenSrcIndex, 1);
			}
			this.$forceUpdate();
		},
		goToBookmarks() {
			this.$router.push({ name: 'Bookmarks', query: { id: this.rowId } });
			this.setBookmarkValue('contactBookmarks');
		},
		switchToCompanyTab(tab) {
			this.companyTab = tab;
		},
		radiocheckUpdate(type, value) {
			this[type] = value;
		},
		async addArticleFunc() {
			let articleData = {
				rowId: this.row_Id,
				snippet: this.articleDecript,
				title: this.articleTitle,
				url: this.articleUrl,
				type: this.articleType
			};

			this.sending = true;

			try {
				const response = await this.addArticleURL(articleData);
				const { data, status } = response;
				if (status === 200) {
					this.articleTitle = '';
					this.articleUrl = '';
					this.articleDecript = '';
					this.articleType = '';

					this.showAlert({
						status: 'success',
						message: data.message,
						showAlert: true
					});
					this.getResult(false);
				}
				this.sending = false;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			} finally {
				this.sending = false;
			}
		},
		scrollToSection(section) {
			this.selectedInsightTab = section.title;
			var element = this.$refs[section.ref];
			if (!element) {
				return;
			}
			var top = element.offsetTop;
			window.scrollTo(0, top);
			if (section.activate) {
				section.activate();
			}
		},
		getRowID() {
			const { rowId } = this.getSearchedResult;
			this.rowId = rowId;
		},
		async RefreshResearch() {
			this.refreshLoading = true;
			try {
				const response = await this.refresh({ id: this.$route.query.id, userId: null });
				const { data, status } = response;
				if (status === 200) {
					if (data.data.status.statusCode === 'UPDATING') {
						this.showAlert({
							status: 'info',
							message: data.message,
							showAlert: true
						});
						this.subscribe();
					}
				}
			} catch (error) {
				// console.log(error.response, '************');
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
				this.refreshLoading = false;
			}
		},
		async subscribe() {
			try {
				const response = await this.subscribeResearch();
				if (response.status === 200) {
					const { contact_details, company_details, status } = response.data.done;
					if (status.statusCode === 'READY') {
						this.contact_details = contact_details;
						this.company_details = company_details;
						this.insightStatus = status;
						this.refreshLoading = false;
						const refactored = this.changeToLegacyResponse(response.data.done);
						await this.saveSearchedResult(refactored);
						this.showAlert({
							status: 'success',
							message: response.data.message,
							showAlert: true
						});
						this.refreshLoading = false;
					}
				}
				return true;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
				this.refreshLoading = false;
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
				// console.log(error);
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		addArticleModal(data) {
			this.modalData = data;
			this.addArticle = true;
		},
		displaySearchItem(type, item) {
			const data = {
				type,
				item
			};
			this.saveSearchedItem(data);
			this.$router.push({
				name: this.isFromAdmin ? 'AdminInsightItem' : 'InsightItem',
				query: {
					id: this.rowId
				}
			});
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
			this.$refs.quoteList.scrollTop += 600;
		}
	},
	watch: {
		contactSearchQuery: debounce(function (newVal) {
			if (newVal) {
				this.contactSearch(newVal);
			} else {
				this.contactSearchResult = [];
				this.contactFilter = null;
			}
		}, 600),
		companySearchQuery: debounce(function (newVal) {
			if (newVal) {
				this.companySearch(newVal);
			} else {
				this.companySearchResult = [];
				this.companyFilter = null;
			}
		}, 600)
	}
};
