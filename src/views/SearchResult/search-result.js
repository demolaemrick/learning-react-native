import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import VHeader from '@/components/Header/searchResult/Header';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import ScreenWidthMixin from '@/mixins/screen-width';
import { response } from '@/data/response.json';
import PageLoad from './PageLoad.vue';
export default {
	name: 'SearchResult',
	components: {
		VNav,
		ToggleDropdown,
		DCheckbox,
		DropdownCheckbox,
		PageLoad,
		VHeader
	},
	mixins: [ScreenWidthMixin],
	data() {
		return {
			companyFilter: [],
			contactFilter: [],
			searchType: 'contact_research',
			response: response,
			researchedPayload: {
				type: Object
			},
			loadMore: false,
			searchedResult: {},
			loading: false,
			userBookmarks: null,
			bookmarkLoading: true,
			editNote: false,
			rowId: null,
			userNote: null,
			notepadTXT: null,
			markDone: false
		};
	},
	async created() {
		if (this.$route.query.rowId) {
			await this.getResult();
			await this.getFilterKeys();
		} else if (this.getSearchedResult && Object.keys(this.getSearchedResult).length > 0) {
			this.searchedResult = this.getSearchedResult;
			await this.getFilterKeys();
			this.researchedPayload = Object.assign({}, this.getPayload);
		} else {
			this.$router.push({ name: 'Search' });
		}
		this.getRowID();
		await this.initUserBookmarks();
		await this.initUserNote(this.rowId);
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad',
			getSearchedResult: 'search_services/getSearchedResult',
			getPayload: 'search_services/getPayload'
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

		notepad: {
			get() {
				return this.getNotepad;
			},
			set(value) {
				this.saveNotepad(value);
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
				let newObj = {};
				const data = this.searchedResult.contact_research;

				this.contactFilter.map((value) => {
					const element = Object.keys(data).includes(value) ? data[value] : null;
					newObj[value] = element;
				});
				return newObj;
			}
		},
		company_research: {
			get() {
				let newObj = {};
				const data = this.searchedResult.company_research;
				this.companyFilter.map((value) => {
					const element = Object.keys(data).includes(value) ? data[value] : null;
					newObj[value] = element;
				});
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
			saveNotepad: 'search_services/saveNotepad',
			saveSearchedItem: 'search_services/saveSearchedItem',
			saveSearchedResult: 'search_services/saveSearchedResult',
			saveSearchPayload: 'search_services/saveSearchPayload'
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
			researchDone: 'search_services/researchDone'
		}),
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
		btnBookmarkClick() {
			this.$router.push('/bookmarks');
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
			} 
			// finally {
			// 	this.loading = false;
			// }
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
		getFilterKeys() {
			this.contactFilter = [];
			this.companyFilter = [];
			for (const key in this.searchedResult.contact_research) {
				this.contactFilter.push(key);
			}
			for (const key in this.searchedResult.company_research) {
				this.companyFilter.push(key);
			}
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
			await this.initUserBookmarks()
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
			await this.initUserBookmarks()
			this.showAlert({
				status: 'success',
				message: 'Removed from bookmarks',
				showAlert: true
			});
		}
	}
};
