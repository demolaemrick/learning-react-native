import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import VHeader from '@/components/Header/searchResult/Header';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import ScreenWidthMixin from '@/mixins/screen-width';
import PageLoad from './PageLoad.vue';
import TextInput from '@/components/Input';
import InsightCard from '@/components/InsightCard';
import RadioBtn from '@/components/RadioButton';
import Modal from '@/components/Modal';
import VButton from '@/components/Button';
import PieChart from '@/components/PieChart';
import { Tweet } from 'vue-tweet-embed';
import LoadIcon from '@/components/LoadIcon';
import Loader from '@/components/Loader';
import { debounce } from 'lodash';

export default {
	name: 'Insights',
	components: {
		ToggleDropdown,
		DCheckbox,
		DropdownCheckbox,
		PageLoad,
		VHeader,
		TextInput,
		InsightCard,
		RadioBtn,
		Modal,
		VButton,
		PieChart,
		Tweet,
		LoadIcon,
		Loader
	},
	mixins: [ScreenWidthMixin],
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
			editNote: false,
			rowId: '',
			userNote: '',
			notepadTXT: '',
			markDone: false,
			tabs: [],
			contactFilter: null,
			companyFilter: null,
			companyTabs: ['all', 'products', 'funding', 'people'],
			contactInsightsTab: [
				{ title: 'Snapshot', ref: 'snapshot' },
				{ title: 'News & article', ref: 'news-section' },
				{ title: 'Quotes', ref: 'quotes' },
				{ title: 'Topics', ref: 'topics' },
				{ title: 'Other insights', ref: 'others' }
			],
			selectedInsightTab: 'Snapshot',
			companyTab: 'all',
			selectedTab: 'All',
			contactSearchQuery: '',
			companySearchQuery: '',
			dislikeModal: false,
			toggleClass: true,
			disliked: false,
			bookmarked: false,
			refreshLoading: false,
			dislikeOption: null,
			dislikeLoading: false,
			otherComment: null,
			selectedInsight: '',
			dislikeOptions: [
				{
					value: 'Not relevant to my search',
					title: 'Not relevant to my search'
				},
				{
					value: 'The information is not correct',
					title: 'The information is not correct'
				},
				{
					value: 'Other',
					title: 'Other'
				}
			],
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
		...mapGetters({
			getSearchedResult: 'search_services/getSearchedResult'
		}),
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
		contact_other_insights: {
			get() {
				const data = this.getSearchedResult.contact_insights.other_insights;
				let newArray = [];
				for (const item in data) {
					newArray = [...newArray, ...data[item]];
				}
				const uniqueArray = [...new Map(newArray.map((item) => [item['url'], item])).values()];
				this.sortInsights(uniqueArray);
				return uniqueArray;
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
		...mapMutations({
			saveSearchedItem: 'search_services/saveSearchedItem',
			saveSearchedResult: 'search_services/saveSearchedResult'
		}),
		...mapActions({
			researchedResult: 'search_services/researchedResult',
			showAlert: 'showAlert',
			getUserBookmarks: 'user/getBookmarks',
			getUserNote: 'user/getNote',
			updateUserNote: 'user/updateNote',
			addToBookmarks: 'user/addToBookmarks',
			removeFromBookmarks: 'user/removeFromBookmarks',
			researchDone: 'search_services/researchDone',
			refresh: 'search_services/refresh',
			subscribeResearch: 'search_services/subscribeResearch',
			dislike: 'search_services/dislike'
		}),
		sortInsights(data) {
			data.sort(function (a, b) {
				return a.is_disliked - b.is_disliked;
			});
		},
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
		async initUserBookmarks() {
			try {
				const userBookmarks = await this.getUserBookmarks(this.rowId);
				const { status, data, statusText } = userBookmarks;
				if (status === 200 && statusText === 'OK') {
					this.userBookmarks = data.response;
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.loading = false;
			}
		},
		async initUserNote(rowID) {
			try {
				const userNote = await this.getUserNote(rowID);
				const { status, data, statusText } = userNote;
				if (status === 200 && statusText === 'OK') {
					if (data.data) {
						this.userNote = data.data;
						this.notepadTXT = data.data.note;
					}
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.noteLoading = false;
			}
		},
		async handleTextareaBlur() {
			this.editNote = !this.editNote;
			try {
				await this.updateUserNote({
					rowId: this.rowId,
					note: this.notepadTXT
				});
				this.userNote = this.notepadTXT;
				this.showAlert({
					status: 'success',
					message: 'Note updated successfully',
					showAlert: true
				});
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: 'error updating note',
					showAlert: true
				});
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
		toggleModalClass(modal, insight) {
			this.selectedInsight = insight;
			if (!this[modal]) {
				this[modal] = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this[modal] = !this[modal];
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		updateDislikeResult(){
			const searchResultClone = { ...this.getSearchedResult };
					let result = {};
					const obj = searchResultClone[this.selectedInsight.type][this.selectedInsight.section];
					for (const key in obj) {
						Object.values(obj[key]).find((item, index) => {
							if (item.url === this.selectedInsight.url) {
								result = {
									key,
									index,
									data: { ...item }
								};
								searchResultClone[this.selectedInsight.type][this.selectedInsight.section][result.key][result.index] = {
									...searchResultClone[this.selectedInsight.type][this.selectedInsight.section][result.key][result.index],
									is_disliked: true
								};
								return;
							}
						});
					}
					//update to vuex store
					this.saveSearchedResult(searchResultClone);
		},
		async dislikeResearch() {
			this.dislikeLoading = true;
			let comment = this.dislikeOption !== 'Other' ? this.dislikeOption : this.otherComment;
			this.updateDislikeResult()
			try {
				const response = await this.dislike({
					url: this.selectedInsight.url,
					comment: comment,
					rowId: this.getSearchedResult.rowId
				});
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: 'Article disliked successfully.',
						showAlert: true
					});
					this.toggleModalClass('dislikeModal', '');
					
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.dislikeLoading = false;
			}
		},

		
		async btnAddToBookMarks(article) {
			const research_type = article.type === 'contact_insights' ? 'contact_research' : 'company_research';
			// call endpoint to add bookmarked article to users bookmark
			try {
				const response = await this.addToBookmarks({
					rowId: this.rowId,
					url: article.url,
					type: research_type,
					description: article.description,
					relevance_score: article.meta.relevanceScore,
					title: article.title
				});
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: 'Added to bookmarks',
						showAlert: true
					});
				}
			} catch (error) {
				console.log(error);
			}

			/**
			 * Find bookmarked article and set key to update
			 * in temporary object
			 */
			const searchResultClone = { ...this.getSearchedResult };
			let result = {};
			const obj = searchResultClone[article.type][article.section];
			for (const key in obj) {
				Object.values(obj[key]).find((item, index) => {
					if (item.url === article.url) {
						result = {
							key,
							index,
							data: { ...item }
						};
						return;
					}
				});
			}

			// update cloned search result object to toggle bookmarked status

			searchResultClone[article.type][article.section][result.key][result.index] = {
				...searchResultClone[article.type][article.section][result.key][result.index],
				is_bookmarked: true
			};

			// update to vuex store
			await this.saveSearchedResult(searchResultClone);

			// refetch users bookmark
			await this.initUserBookmarks();
		},
		async btnRemoveFromBookMarks(article) {
			const searchResultClone = { ...this.getSearchedResult };
			let result = {};
			const obj = searchResultClone[article.type][article.section];

			for (const key in obj) {
				Object.values(obj[key]).find((item, index) => {
					if (item.url === article.url) {
						result = {
							key,
							index,
							data: { ...item }
						};
						return;
					}
				});
			}
			searchResultClone[article.type][article.section][result.key][result.index] = {
				...searchResultClone[article.type][article.section][result.key][result.index],
				is_bookmarked: false
			};
			await this.saveSearchedResult(searchResultClone);
			try {
				const response = await this.removeFromBookmarks({
					url: article.url
				});
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: 'Article removed from bookmarks',
						showAlert: true
					});
				}
			} catch (error) {
				console.log(error);
			}
			await this.initUserBookmarks();
		},
		async btnUpdateBookMarks(article, prop) {
			if (prop === 'add') {
				this.btnAddToBookMarks(article);
			} else {
				this.btnRemoveFromBookMarks(article);
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
