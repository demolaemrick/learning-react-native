import { mapMutations, mapGetters, mapActions } from 'vuex';
import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import DCheckbox from '@/components/DefaultCheckbox';
import TextInput from '@/components/Input';
import InsightCard from '@/components/InsightCard';
import RadioBtn from '@/components/RadioButton';
import Modal from '@/components/Modal';
import VButton from '@/components/Button';
import Loader from '@/components/Loader';

export default {
	data() {
		return {
			editNote: false,
			userNote: '',
			notepadTXT: '',
			companyTabs: ['all', 'products', 'funding', 'people'],
			companyTab: 'all',
			selectedTab: 'All',
			contactSearchQuery: '',
			companySearchQuery: '',
			dislikeModal: false,
			hookModal: false,
			toggleClass: true,
			disliked: false,
			bookmarked: false,
			dislikeLoading: false,
			selectedInsight: '',
			showAllQuotes: false,
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
			]
		};
	},
	components: {
		ToggleDropdown,
		DCheckbox,
		DropdownCheckbox,
		TextInput,
		InsightCard,
		RadioBtn,
		Modal,
		VButton,
		Loader
	},
	computed: {
		...mapGetters({
			getSearchedResult: 'search_services/getSearchedResult',
			bookmarkValue: 'user/getBookmarkvalue'
		}),
		socials: {
			get() {
				const socialObj = {};
				const socials = this.contact_details.socials;
				for (const name in socials) {
					if (socials[name]) {
						socialObj[name] = socials[name];
					}
				}
				return socialObj;
			}
		},

		company_insights_categories: {
			get() {
				let newObj = {};
				let result = JSON.parse(JSON.stringify(this.getSearchedResult.company_insights));
				const data = result.news;
				const tab = this.companyTab;
				const element = Object.keys(data).includes(tab) ? data[tab] : '';
				newObj[tab] = element;
				const sortedList = this.checkCompanySort(newObj[tab]);
				let bookMarked = this.sortByBookmarked(sortedList);
				let byImportance = this.sortByImportant(sortedList);
				let justOrdinary = this.getOrdinaryArticles(sortedList);
				let byDisliked = this.sortByDislike(sortedList);
				return [...bookMarked, ...byImportance, ...justOrdinary, ...byDisliked];
			},
			set(value) {
				return value;
			}
		},
		contact_insights_categories: {
			get() {
				let newObj = {};
				this.searchType = this.searchType === 'contact_research' ? 'contact_insights' : this.searchType;
				let result = {};
				result = JSON.parse(JSON.stringify(this.getSearchedResult[this.searchType]));
				const data = result.news;
				const tab = this.selectedTab;
				this.tabs = result.top_tags.map((item) => item.tag);

				if (tab === 'All') {
					let newArray = [];
					for (const item in data) {
						newArray = [...newArray, ...data[item]];
					}
					const uniqueArray = [...new Map(newArray.map((item) => [item['url'], item])).values()];
					const sortedList = this.checkContactSort(uniqueArray);
					let bookMarked = this.sortByBookmarked(sortedList);
					let byImportance = this.sortByImportant(sortedList);
					let justOrdinary = this.getOrdinaryArticles(sortedList);
					let byDisliked = this.sortByDislike(sortedList);

					return [...bookMarked, ...byImportance, ...justOrdinary, ...byDisliked];
				} else {
					const element = Object.keys(data).includes(tab) ? data[tab] : '';
					newObj[tab] = element;
					const sortedList = this.checkContactSort(newObj[tab]);
					let bookMarked = this.sortByBookmarked(sortedList);
					let byImportance = this.sortByImportant(sortedList);
					let justOrdinary = this.getOrdinaryArticles(sortedList);
					let byDisliked = this.sortByDislike(sortedList);
					return [...bookMarked, ...byImportance, ...justOrdinary, ...byDisliked];
				}
			},
			set(value) {
				return value;
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
				let bookMarked = this.sortByBookmarked(uniqueArray);
				let byImportance = this.sortByImportant(uniqueArray);
				let justOrdinary = this.getOrdinaryArticles(uniqueArray);
				let byDisliked = this.sortByDislike(uniqueArray);
				return [...bookMarked, ...byImportance, ...justOrdinary, ...byDisliked];
			}
		},
		contactQuotes() {
			if (this.showAllQuotes) {
				const quoteArray = [...this.getSearchedResult.contact_insights.quotes];
				let bookMarked = this.sortByBookmarked(quoteArray);
				let justOrdinary = this.getOrdinaryArticles(quoteArray);
				let byDisliked = this.sortByDislike(quoteArray);
				return [...bookMarked, ...justOrdinary, ...byDisliked];
			} else {
				const quoteArray = [...this.getSearchedResult.contact_insights.quotes.slice(0, 3)];
				let bookMarked = this.sortByBookmarked(quoteArray);
				let justOrdinary = this.getOrdinaryArticles(quoteArray);
				let byDisliked = this.sortByDislike(quoteArray);
				return [...bookMarked, ...justOrdinary, ...byDisliked];
			}
		},
		allQuotes() {
			this.quoteList = this.getSearchedResult.contact_insights.quotes;
			return this.quoteList;
		}
	},
	methods: {
		...mapMutations({
			saveSearchedItem: 'search_notes/saveSearchedItem',
			saveSearchedResult: 'search_services/saveSearchedResult'
		}),
		...mapActions({
			showAlert: 'showAlert',
			getUserBookmarks: 'user/getBookmarks',
			getUserNote: 'user/getNote',
			updateUserNote: 'user/updateNote',
			addToBookmarks: 'user/addToBookmarks',
			removeFromBookmarks: 'user/removeFromBookmarks',
			dislike: 'search_services/dislike',
			addQuoteBookmark: 'search_services/addQuoteBookmark',
			removeQuoteBookmark: 'search_services/removeQuoteBookmark',
			dislikeQuote: 'search_services/dislikeQuote',
			removeQuoteDislike: 'search_services/removeQuoteDislike'
		}),
		sortByBookmarked(data) {
			return data.filter((x) => x.is_bookmarked && !x.is_disliked);
		},
		sortByImportant(data) {
			return data.filter((x) => x.important && !x.is_bookmarked && !x.is_disliked);
		},
		getOrdinaryArticles(data) {
			return data.filter((x) => !x.important && !x.is_bookmarked && !x.is_disliked);
		},
		sortByDislike(data) {
			return data.filter((x) => x.is_disliked);
		},
		checkContactSort(uniqueArray) {
			if (this.contactSortMethod === 'relevance') {
				return this.sortByRelevance(uniqueArray);
			} else {
				return this.sortByRecent(uniqueArray);
			}
		},
		checkCompanySort(uniqueArray) {
			if (this.companySortMethod === 'relevance') {
				return this.sortByRelevance(uniqueArray);
			} else {
				return this.sortByRecent(uniqueArray);
			}
		},
		sortByRelevance(data) {
			return data.sort((a, b) => b.meta.relevanceScore - a.meta.relevanceScore);
		},
		sortByRecent(data) {
			return data.sort((a, b) => {
				const date1 = new Date(a.meta.published || a.content.date || a.meta.timestamp);
				const date2 = new Date(b.meta.published || b.content.date || b.meta.timestamp);
				return date2.getTime() - date1.getTime();
			});
		},
		generateIntroEmail(type, item) {
			const data = {
				type,
				item
			};
			this.saveSearchedItem(data);
			this.$router.push({ name: 'EmailHook', query: { id: this.rowId } });
		},
		async toggleDislike(article) {
			this.selectedInsight = article;
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
							is_disliked: false
						};
						return;
					}
				});
			}

			try {
				const response = await this.dislike({
					url: this.selectedInsight.url,
					rowId: this.getSearchedResult.rowId
				});
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: response.data.message || 'Article removed from disliked group',
						showAlert: true
					});
					this.saveSearchedResult(searchResultClone);
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
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
			this.saveSearchedResult(searchResultClone);
		},
		async dislikeResearch() {
			this.dislikeLoading = true;
			let comment = this.dislikeOption !== 'Other' ? this.dislikeOption : this.otherComment;
			try {
				const response = await this.dislike({
					url: this.selectedInsight.url,
					comment: comment,
					rowId: this.getSearchedResult.rowId
				});
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: response.data.message || 'Article disliked successfully.',
						showAlert: true
					});
					this.dislikeOption = '';
					this.otherComment = '';
					this.updateDislikeResult();
					// this.toggleModalClass('dislikeModal', '');
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			} finally {
				this.toggleModalClass('dislikeModal', '');
				this.dislikeLoading = false;
			}
		},
		async initUserBookmarks() {
			try {
				const userBookmarks = await this.getUserBookmarks(this.$route.query.id);
				const { status, data, statusText } = userBookmarks;
				if (status === 200 && statusText === 'OK') {
					const resp = data.response;
					this.allBookmarks = resp;

					this.showAlert({
						status: 'success',
						message: response.data.message,
						showAlert: true
					});
				}
			} catch (error) {
				if (error.response) {
					this.showAlert({
						status: 'error',
						message: error.response.data.message,
						showAlert: true
					});
				}
			}
		},
		async btnAddToBookMarks(article) {
			const research_type = article.type === 'contact_insights' ? 'contact_research' : 'company_research';
			try {
				const response = await this.addToBookmarks({
					rowId: this.getSearchedResult.rowId,
					url: article.url,
					type: research_type,
					description: article.description.slice(0, 254),
					relevance_score: article.meta.relevanceScore,
					title: article.title
				});
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: response.data.message || 'Added to bookmarks',
						showAlert: true
					});
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
				return false;
			}

			const searchResultClone = { ...this.getSearchedResult };
			const obj = searchResultClone[article.type][article.section];
			for (const key in obj) {
				Object.values(obj[key]).filter(async (item, index) => {
					if (item.url === article.url) {
						searchResultClone[article.type][article.section][key][index] = {
							...searchResultClone[article.type][article.section][key][index],
							is_bookmarked: true
						};

						await this.saveSearchedResult(searchResultClone);
					}
				});
			}
		},
		async btnRemoveFromBookMarks(article) {
			const research_type =
				article.type === 'contact_insights' || article.type === 'contact_research' ? 'contact_research' : 'company_research';

			if (this.userBookmarks && Object.keys(this.userBookmarks).length) {
				const bookmarkedArticles = JSON.parse(JSON.stringify(this.userBookmarks));
				let articles = bookmarkedArticles[article.type];

				articles = articles.filter(({ url }) => url !== article.url);
				try {
					const response = await this.removeFromBookmarks({
						url: article.url,
						type: research_type
					});

					if (response.status === 200) {
						this.userBookmarks[article.type] = articles;
						this.showAlert({
							status: 'success',
							message: response.data.message || 'Article removed from bookmarks',
							showAlert: true
						});
					}
				} catch (error) {
					this.showAlert({
						status: 'error',
						message: error.response.data.message,
						showAlert: true
					});
					return false;
				}
			} else {
				const searchResultClone = { ...this.getSearchedResult };
				const obj = searchResultClone[article.type][article.section];

				for (const key in obj) {
					Object.values(obj[key]).filter(async (item, index) => {
						if (item.url === article.url) {
							searchResultClone[article.type][article.section][key][index] = {
								...searchResultClone[article.type][article.section][key][index],
								is_bookmarked: false
							};
							await this.saveSearchedResult(searchResultClone);
						}
					});
				}
				try {
					const response = await this.removeFromBookmarks({
						url: article.url,
						type: research_type
					});
					if (response.status === 200) {
						this.showAlert({
							status: 'success',
							message: response.data.message || 'Article removed from bookmarks',
							showAlert: true
						});
					}
				} catch (error) {
					this.showAlert({
						status: 'error',
						message: error.response.data.message,
						showAlert: true
					});
					return false;
				}
				// await this.initUserBookmarks();
			}
		},
		btnUpdateBookMarks(article, prop) {
			if (prop === 'add') {
				this.btnAddToBookMarks(article);
			} else {
				this.btnRemoveFromBookMarks(article);
			}
		},
		async updateQuoteBookMarks(quote) {
			const type = quote.type === 'contact_insights' ? 'contact_research' : 'company_research';

			let searchResultClone = JSON.parse(JSON.stringify(this.getSearchedResult));
			let quoteArray = searchResultClone.contact_insights.quotes;

			const quoteIndex = quoteArray.findIndex((obj) => obj.id === quote.id);
			quoteArray[quoteIndex].is_bookmarked = quoteArray[quoteIndex].is_bookmarked ? false : true;

			const isBookmarked = quoteArray[quoteIndex].is_bookmarked;
			const bookmarkAction = isBookmarked ? 'addQuoteBookmark' : 'removeQuoteBookmark';
			try {
				const response = await this[bookmarkAction]({
					rowId: this.getSearchedResult.rowId,
					url: quote.article_url,
					quoteId: quote.id,
					type
				});
				if (response.status === 200 && response.statusText === 'OK') {
					this.showAlert({
						status: 'success',
						message: response.data.message || 'Bookmark updated successfully',
						showAlert: true
					});
					this.saveSearchedResult(searchResultClone);
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},

		async updateQuoteDislike(quote) {
			const type = quote.type === 'contact_insights' ? 'contact_research' : 'company_research';

			let searchResultClone = JSON.parse(JSON.stringify(this.getSearchedResult));
			let quoteArray = searchResultClone.contact_insights.quotes;

			const quoteIndex = quoteArray.findIndex((obj) => obj.id === quote.id);
			quoteArray[quoteIndex].is_disliked = quoteArray[quoteIndex].is_disliked ? false : true;

			const isDisliked = quoteArray[quoteIndex].is_disliked;
			const dislikeAction = isDisliked ? 'dislikeQuote' : 'removeQuoteDislike';

			try {
				const response = await this[dislikeAction]({
					rowId: this.getSearchedResult.rowId,
					url: quote.article_url,
					quoteId: quote.id,
					type
				});
				if (response.status === 200 && response.statusText === 'OK') {
					this.showAlert({
						status: 'success',
						message: response.data.message,
						showAlert: true
					});
					this.saveSearchedResult(searchResultClone);
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
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
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			} finally {
				this.noteLoading = false;
			}
		},
		async handleTextareaBlur(notepadTXT) {
			this.editNote = !this.editNote;
			if (notepadTXT) {
				this.sending = true;
				this.sendingNote = true;
				try {
					const response = await this.updateUserNote({
						rowId: this.getSearchedResult.rowId,
						note: notepadTXT
					});
					this.userNote = notepadTXT;
					this.notepadTXT = notepadTXT;
					this.showAlert({
						status: 'success',
						message: response.data.message || 'Note updated successfully',
						showAlert: true
					});
					this.sending = false;
					this.sendingNote = false;
				} catch (error) {
					this.showAlert({
						status: 'error',
						message: error.response.data.message,
						showAlert: true
					});
					this.sending = false;
					this.sendingNote = false;
				}
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
			this.dislikeOption = '';
			this.otherComment = '';
			this.articleType = '';
		},
		scrollTab() {
			this.$refs.content.scrollLeft += 200;
		},
		profileImagePlaceholder(value) {
			const placeHolder = value.trim().toUpperCase().split(' ');
			return placeHolder.length > 1 ? `${placeHolder[0][0]}${placeHolder[1][0] ? placeHolder[1][0] : ''}` : `${placeHolder[0][0]}`;
		}
	}
};
