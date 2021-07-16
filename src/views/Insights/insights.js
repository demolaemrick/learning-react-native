import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import VHeader from '@/components/Header/searchResult/Header';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import ScreenWidthMixin from '@/mixins/screen-width';
import { response } from '@/data/response.json';
import PageLoad from './PageLoad.vue';
import TextInput from '@/components/Input';
import InsightCard from '@/components/InsightCard';
import RadioBtn from '@/components/RadioButton';
import Modal from '@/components/Modal';
import VButton from '@/components/Button';
import PieChart from '@/components/PieChart';

export default {
	name: 'SearchResult',
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
		PieChart
	},
	mixins: [ScreenWidthMixin],
	data() {
		return {
			tweet:
				'<blockquote class="twitter-tweet"><p lang="en" dir="ltr">This is the greatest opportunity for innovation in human history: <a href="https://t.co/rBFo2LjpsH">https://t.co/rBFo2LjpsH</a> <a href="https://t.co/bj6rY3FszB">pic.twitter.com/bj6rY3FszB</a></p>&mdash; Bill Gates (@BillGates) <a href="https://twitter.com/BillGates/status/1415752955152666627?ref_src=twsrc%5Etfw">July 15, 2021</a></blockquote>',
			companyFilter: [],
			contactFilter: [],
			searchType: 'contact_research',
			response: response,
			loadMore: false,
			searchedResult: {},
			loading: false,
			userBookmarks: null,
			bookmarkLoading: true,
			editNote: false,
			rowId: null,
			userNote: null,
			notepadTXT: null,
			markDone: false,
			tabs: ['All', 'Data', 'E-signature', 'Non-profit'],
			companyTabs: ['All', 'Products', 'Funding', 'People'],
			companyTab: 'Funding',
			selectedTab: 'All',
			contactSearchQuery: '',
			companySearchQuery: '',
			dislikeModal: false,
			toggleClass: true,
			disliked: false,
			dislikeOption: 'Not relevant to this search',
			dislikeOptions: [
				{
					value: 'Not relevant to this search',
					title: 'Not relevant to this search'
				},
				{
					value: 'Not what I am looking for',
					title: 'Not what I am looking for'
				},
				{
					value: 'Not enough details',
					title: 'Not enough details'
				},
				{
					value: 'Incorrect information',
					title: 'Incorrect information'
				},
				{
					value: 'Other',
					title: 'Other'
				}
			],
			mainTopics: ['Data', 'E-signature', 'Non-profit'],
			chartData: [300, 250, 100]
		};
	},
	async created() {
		if (this.$route.query.rowId) {
			await this.getResult();
		} else if (this.getSearchedResult && Object.keys(this.getSearchedResult).length > 0) {
			this.searchedResult = this.getSearchedResult;
		} else {
			this.$router.push({ name: 'Search' });
		}
		this.getRowID();
		await this.initUserBookmarks();
		await this.initUserNote(this.rowId);
		// this.fetchViralTweet();
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
		contact_research: {
			get() {
				return this.searchedResult.contact_research;
			}
		},
		company_research: {
			get() {
				return this.searchedResult.company_research;
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
			research: 'search_services/research',
			researchedResult: 'search_services/researchedResult',
			showAlert: 'showAlert',
			getUserBookmarks: 'user/getBookmarks',
			getUserNote: 'user/getNote',
			updateUserNote: 'user/updateNote',
			addToBookmarks: 'user/addToBookmarks',
			removeFromBookmarks: 'user/removeFromBookmarks',
			researchDone: 'search_services/researchDone',
			getViralTweet: 'search_services/getViralTweet'
		}),
		async fetchViralTweet() {
			const response = await this.getViralTweet('https://twitter.com/BillGates/status/1415752955152666627?s=20');
			console.log(response);
		},
		getRowID() {
			const { rowId } = this.getSearchedResult;
			this.rowId = rowId;
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
				this.searchedResult = response.data.data;
				await this.saveSearchedResult(response.data.data);
				return true;
			} catch (error) {
				console.log(error);
			} finally {
				this.loading = false;
			}
		},
		sortByRelevance(researchType) {
			if (researchType === 'contact_research') {
				for (const key in this.contact_research) {
					const element = this.contact_research[key];
					return element.sort((a, b) => (a.meta.relevanceScore < b.meta.relevanceScore ? 1 : -1));
				}
			}
			if (researchType === 'company_research') {
				for (const key in this.company_research) {
					const element = this.company_research[key];
					return element.sort((a, b) => (a.meta.relevanceScore < b.meta.relevanceScore ? 1 : -1));
				}
			}
		},
		sortByRecent(researchType) {
			if (researchType === 'contact_research') {
				for (const key in this.contact_research) {
					const element = this.contact_research[key];
					return element.sort((a, b) => {
						return (
							new Date(b.meta.published != null) - new Date(a.meta.published != null) ||
							new Date(b.meta.published) - new Date(a.meta.published)
						);
					});
				}
			}
			if (researchType === 'company_research') {
				for (const key in this.company_research) {
					const element = this.company_research[key];
					return element.sort((a, b) => {
						return (
							new Date(b.meta.published != null) - new Date(a.meta.published != null) ||
							new Date(b.meta.published) - new Date(a.meta.published)
						);
					});
				}
			}
		},
		displaySearchItem(type, item) {
			const data = {
				type: type,
				item: item
			};
			this.saveSearchedItem(data);
			this.$router.push({ name: 'SearchItem' });
		},
		validateURL(link) {
			if (link.indexOf('https://') === 0 || link.indexOf('http://') === 0) {
				return link;
			} else {
				return `https://${link}`;
			}
		},
		async btnAddToBookMarks(dataItem) {
			await this.addToBookmarks({
				rowId: this.rowId,
				url: dataItem.url,
				type: dataItem.type,
				description: dataItem.description,
				relevance_score: dataItem.meta.relevanceScore,
				title: dataItem.title
			});
			const searchResultClone = { ...this.getSearchedResult };
			searchResultClone[dataItem.type].others[dataItem.index].is_bookmarked = true;
			await this.saveSearchedResult(searchResultClone);
			await this.initUserBookmarks();
			this.showAlert({
				status: 'success',
				message: 'Added to bookmarks',
				showAlert: true
			});
		},
		async btnRemoveFromBookMarks(dataItem) {
			await this.removeFromBookmarks({
				url: dataItem.url
			});
			const searchResultClone = { ...this.getSearchedResult };
			searchResultClone[dataItem.type].others[dataItem.index].is_bookmarked = false;
			await this.saveSearchedResult(searchResultClone);
			await this.initUserBookmarks();
			this.showAlert({
				status: 'success',
				message: 'Removed from bookmarks',
				showAlert: true
			});
		},
		toggleModalClass(modal) {
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
		dislikeCard() {
			this.dislikeModal = false;
			this.disliked = true;
		}
	}
};
