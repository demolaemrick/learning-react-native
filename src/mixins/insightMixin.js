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
			getSearchedResult: 'search_services/getSearchedResult'
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
				this.sortByDislike(newObj[tab]);
				this.sortByBookmarked(newObj[tab]);
				return this.checkCompanySort(newObj[tab]);
			},
			set(value) {
				return value;
			}
		},
		contact_insights_categories: {
			get() {
				let newObj = {};

				this.searchType = this.searchType === 'contact_research' ? 'contact_insights' : this.searchType;
				let result = JSON.parse(JSON.stringify(this.getSearchedResult[this.searchType]));

				const data = result.news;
				const tab = this.selectedTab;
				this.tabs = result.top_tags.map((item) => item.tag);

				if (tab === 'All') {
					let newArray = [];
					for (const item in data) {
						newArray = [...newArray, ...data[item]];
					}
					const uniqueArray = [...new Map(newArray.map((item) => [item['url'], item])).values()];
					this.sortByDislike(uniqueArray);
					this.sortByBookmarked(uniqueArray);
					return this.checkContactSort(uniqueArray);
				} else {
					const element = Object.keys(data).includes(tab) ? data[tab] : '';
					newObj[tab] = element;
					this.sortByBookmarked(newObj[tab]);
					this.sortByDislike(newObj[tab]);
					return this.checkContactSort(newObj[tab]);
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
				this.sortByDislike(uniqueArray);
				this.sortByBookmarked(uniqueArray);
				return uniqueArray;
			}
		},
		contactQuotes() {
			if (this.showAllQuotes) {
				const quoteArray = [...this.getSearchedResult.contact_insights.quotes];
				this.sortByDislike(quoteArray);
				return this.sortByBookmarked(quoteArray);
			} else {
				const quoteArray = [...this.getSearchedResult.contact_insights.quotes.slice(0, 3)];
				this.sortByDislike(quoteArray);
				return this.sortByBookmarked(quoteArray);
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
		sortByDislike(data) {
			return data.sort(function (a, b) {
				return a.is_disliked - b.is_disliked;
			});
		},
		sortByBookmarked(data) {
			return data.sort(function (a, b) {
				return b.is_bookmarked - a.is_bookmarked;
			});
		},
		checkContactSort(uniqueArray) {
			if (this.contactSortMethod === 'recent') {
				return this.sortByRecent(uniqueArray);
			} else if (this.contactSortMethod === 'relevance') {
				return this.sortByRelevance(uniqueArray);
			} else {
				return uniqueArray;
			}
		},
		checkCompanySort(uniqueArray) {
			if (this.companySortMethod === 'recent') {
				return this.sortByRecent(uniqueArray);
			} else if (this.companySortMethod === 'relevance') {
				return this.sortByRelevance(uniqueArray);
			} else {
				return uniqueArray;
			}
		},
		sortByRelevance(data) {
			return data.sort((a, b) => (a.meta.relevanceScore < b.meta.relevanceScore ? 1 : -1));
		},
		sortByRecent(data) {
			return data.sort((a, b) => {
				return (
					new Date(b.meta.published != null) - new Date(a.meta.published != null) ||
					new Date(b.meta.published) - new Date(a.meta.published)
				);
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
			this.saveSearchedResult(searchResultClone);

			try {
				const response = await this.dislike({
					url: this.selectedInsight.url,
					rowId: this.getSearchedResult.rowId
				});
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: 'Article removed from disliked group',
						showAlert: true
					});
				}
			} catch (error) {
				console.log(error);
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
		async btnAddToBookMarks(article) {
			const research_type = article.type === 'contact_insights' ? 'contact_research' : 'company_research';
			try {
				const response = await this.addToBookmarks({
					rowId: this.getSearchedResult.rowId,
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
				is_bookmarked: true
			};

			await this.saveSearchedResult(searchResultClone);
			await this.initUserBookmarks();
		},
		async btnRemoveFromBookMarks(article) {
			const research_type = article.type === 'contact_insights' ? 'contact_research' : 'company_research';
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
					url: article.url,
					type: research_type
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
						message: 'Bookmark updated successfully',
						showAlert: true
					});
					this.saveSearchedResult(searchResultClone);
				}
			} catch (error) {
				console.log(error);
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
				console.log(error);
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
		scrollTab() {
			this.$refs.content.scrollLeft += 200;
		}
	}
};
