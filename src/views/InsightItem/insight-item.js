//import VNav from '../Nav.vue';
import VHeader from '@/components/Header/searchResult/Header';
import ToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import CTag from '@/components/Tag';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import LoadingState from '@/components/LoadingState';
import InsightCard from '@/components/InsightCard';
import Modal from '@/components/Modal';
import RadioBtn from '@/components/RadioButton';
import TextInput from '@/components/Input';
import VButton from '@/components/Button';
import Loader from '@/components/Loader';
export default {
	name: 'InsightItem',
	components: {
		VHeader,
		ToggleDropdown,
		DCheckbox,
		CTag,
		DropdownCheckbox,
		LoadingState,
		InsightCard,
		Modal,
		RadioBtn,
		VButton,
		TextInput,
		Loader
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
			editNote: false,
			userNote: null,
			notepadTXT: null,
			tabs: ['All', 'Data', 'E-signature', 'Non-profit'],
			companyTabs: ['all', 'products', 'funding', 'people'],
			companyTab: 'all',
			selectedTab: 'All',
			disliked: false,
			bookmarked: false,
			dislikeModal: false,
			contactSearchQuery: '',
			companySearchQuery: '',
			dislikeOption: 'Not relevant to this search',
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
			selectedInsight: '',
			dislikeLoading: false,
			toggleClass: true
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
			getSearchedItem: 'search_services/getSearchedItem',
			getSearchedResult: 'search_services/getSearchedResult'
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
				let result = JSON.parse(JSON.stringify(this.getSearchedResult[this.searchType]));
				const data = result.news;
				const tab = this.companyTab;
				const element = Object.keys(data).includes(tab) ? data[tab] : '';
				newObj[tab] = element;
				this.sortInsights(newObj[tab]);
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
				this.sortInsights(uniqueArray);
				return uniqueArray;
			}
		}
	},
	methods: {
		...mapMutations({
			saveNotepad: 'search_services/saveNotepad',
			saveSearchedItem: 'search_services/saveSearchedItem',
			saveSearchedResult: 'search_services/saveSearchedResult',
			saveSearchPayload: 'search_services/saveSearchPayload'
		}),
		...mapActions({
			content: 'search_services/content',
			fetchResearch: 'search_services/research',
			getUserNote: 'user/getNote',
			updateUserNote: 'user/updateNote',
			addToBookmarks: 'user/addToBookmarks',
			getUserBookmarks: 'user/getBookmarks',
			removeFromBookmarks: 'user/removeFromBookmarks',
			dislike: 'search_services/dislike',
			showAlert: 'showAlert'
		}),
		sortInsights(data) {
			data.sort(function (a, b) {
				return a.is_disliked - b.is_disliked;
			});
		},
		updateDislikeResult() {
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
			this.updateDislikeResult();
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
		async initUserBookmarks() {
			try {
				const userBookmarks = await this.getUserBookmarks(this.getSearchedResult.rowId);
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
		async btnAddToBookMarks(dataItem) {
			await this.addToBookmarks({
				rowId: this.getSearchedResult.rowId,
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
					rowId: this.getSearchedResult.rowId,
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
		}
	}
};
