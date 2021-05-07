//import VNav from '../Nav.vue';
import VHeader from '@/components/Header/searchResult/Header';
import ToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import CTag from '@/components/Tag';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import LoadingState from '@/components/LoadingState';
import DotLoader from '@/components/DotLoader.vue';

export default {
	name: 'SearchResult',
	components: {
		// VNav,
		VHeader,
		ToggleDropdown,
		DCheckbox,
		CTag,
		DropdownCheckbox,
		LoadingState,
		DotLoader
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
			loadMore: false,
			researchedPayload: {
				type: Object
			},
			editNote: false,
			userNote: null,
			notepadTXT: null
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
		await this.initUserNote(this.getSearchedResult.rowId);
		//await this.fetchContent();
		//this.researchedPayload = Object.assign({}, this.getPayload);
		//this.getNextResearch();
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad',
			getSearchedItem: 'search_services/getSearchedItem',
			getSearchedResult: 'search_services/getSearchedResult'
			//getPayload: 'search_services/getPayload'
		}),
		// getContentPayload: {
		// 	get() {
		// 		const payload = {};
		// 		payload.company = this.getPayload.company;
		// 		payload.full_name = this.getPayload.full_name;
		// 		payload.role = this.getPayload.role;
		// 		payload.link = this.getSearchedItem.item.url;
		// 		return payload;
		// 	}
		// },
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
			showAlert: 'showAlert'
		}),
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
		getNextResearch() {
			const listElm = document.querySelector('#infinite-list');
			listElm.onscroll = async () => {
				if (this.researchedPayload.pagination !== 2) {
					if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
						this.loadMore = true;
						this.researchedPayload.pagination = 2;
						try {
							const response = await this.fetchResearch(this.researchedPayload);
							if (response.data.status === 'success') {
								let data = response.data.data;
								const contact_research = [
									...this.getSearchedResult.contact_research.others,
									...response.data.data.contact_research.others
								];
								const company_research = [
									...this.getSearchedResult.company_research.others,
									...response.data.data.company_research.others
								];
								data.contact_research['others'] = contact_research;
								data.company_research['others'] = company_research;
								await this.saveSearchedResult(data);
								await this.saveSearchPayload(this.researchedPayload);
								return true;
							}
							this.showAlert({
								status: 'error',
								message: 'Something went wrong',
								showAlert: true
							});
						} catch (error) {
							this.showAlert({
								status: 'error',
								message: error.response.data.message,
								showAlert: true
							});
						} finally {
							this.loadMore = false;
						}
					}
				}
			};
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
						// this.itemContent = '';
						// this.itemContent = response.data.data.image_string;
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
			//await this.fetchContent();
		},
		getFilterKeys() {
			this.filterValue = [];
			for (const key in this.getSearchedResult[this.searchType]) {
				this.filterValue.push(key);
			}
		}
	}
};
