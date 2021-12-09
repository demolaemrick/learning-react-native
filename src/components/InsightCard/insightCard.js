import { tippy } from 'vue-tippy';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Loader from '@/components/Loader';

export default {
	components: {
		tippy,
		Loader
	},
	props: {
		article: {
			type: Object,
			default: {}
		},
		published: {
			type: String,
			default: null
		},
		showEmailIcon: {
			type: Boolean,
			default: true
		},
		showDislikeIcon: {
			type: Boolean,
			default: true
		},
		isFromAdmin: {
			type: Boolean
		},
		isContact: {
			type: Boolean
		},
		showBookmarkIcon: {
			type: Boolean,
			default: true
		},
		type: {
			type: String,
			default: 'contact_insights'
		},
		section: {
			type: String,
			default: 'news'
		}
	},
	data() {
		return {
			sending: false,
			sendingImp: false,
			ranked_by_admin: false,
			hidden: false
		};
	},
	computed: {
		...mapGetters({
			getLoggedUser: 'auth/getLoggedUser',
			getSearchedResult: 'search_services/getSearchedResult'
		}),
		cleanUrl() {
			const url = this.article.url || this.article.article_url;
			return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
		},
		computedArticle() {
			return this.article;
		}
	},
	mounted() {
		this.hidden = this.article.hidden ? true : false;
		this.ranked_by_admin = this.article.ranked_by_admin ? true : false;
	},
	methods: {
		...mapMutations({
			saveSearchedResult: 'search_services/saveSearchedResult'
		}),
		...mapActions({
			toggleArticle: 'users_management/toggleArticle',
			toggleImportance: 'users_management/toggleImportance',
			showAlert: 'showAlert'
		}),
		openArticle() {
			let render = this.article.render;
			if (render !== false) {
				this.$emit('displayInsight');
			} else {
				// open new tab here
				window.open(this.article.url, '_blank');
			}
		},
		async toggleArticleFunc() {
			const rowId = this.$route.query.id;
			let hide = this.article.hidden ? false : true;
			let data = {
				data: {
					rowId,
					url: this.article.url,
					type: this.isContact ? 'contact_research' : 'company_research'
				},
				hide
			};
			this.sending = true;

			try {
				const response = await this.toggleArticle(data);
				this.sending = false;
				this.showAlert({
					status: 'success',
					message: response.data.message,
					showAlert: true
				});
				// this.hidden = hide;
				// this.$emit('hideArticle', {
				// 	id: rowId,
				// 	hide
				// });
			} catch (error) {
				this.sending = false;
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
				return;
			}

			const searchResultClone = {
				...this.getSearchedResult
			};
			const obj = searchResultClone[this.type][this.section];
			for (const key in obj) {
				Object.values(obj[key]).filter(async (item, index) => {
					if (item.url === this.article.url) {
						searchResultClone[this.type][this.section][key][index] = {
							...searchResultClone[this.type][this.section][key][index],
							hidden: !this.article.hidden
						};

						await this.saveSearchedResult(searchResultClone);
					}
				});
			}
		},
		async toggleImportanceFunc() {
			const rowId = this.$route.query.id;
			let important = this.article.ranked_by_admin ? false : true;

			let data = {
				data: {
					rowId,
					url: this.article.url,
					type: this.isContact ? 'contact_research' : 'company_research'
				},
				important
			};
			this.sendingImp = true;

			try {
				const response = await this.toggleImportance(data);
				this.sendingImp = false;
				this.showAlert({
					status: 'success',
					message: response.data.message,
					showAlert: true
				});
				// this.ranked_by_admin = important;
				// this.$emit('rankArticle', { id: rowId, important });
			} catch (error) {
				this.sendingImp = false;
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});

				return;
			}

			const searchResultClone = {
				...this.getSearchedResult
			};
			const obj = searchResultClone[this.type][this.section];
			for (const key in obj) {
				Object.values(obj[key]).filter(async (item, index) => {
					if (item.url === this.article.url) {
						searchResultClone[this.type][this.section][key][index] = {
							...searchResultClone[this.type][this.section][key][index],
							ranked_by_admin: !this.article.ranked_by_admin
						};

						await this.saveSearchedResult(searchResultClone);
					}
				});
			}
		}
	}
};
