import { tippy } from 'vue-tippy';
import { mapActions, mapGetters } from 'vuex';
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
		}
	},
	data() {
		return {
			sending: false,
			sendingImp: false
		};
	},
	computed: {
		cleanUrl() {
			const url = this.article.url || this.article.article_url;
			return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
		},
		...mapGetters({
			loggedInUser: 'auth/getLoggedUser'
		}),
		computedArticle() {
			return this.article;
		}
	},
	mounted() {},
	methods: {
		...mapActions({
			toggleArticle: 'users_management/toggleArticle',
			toggleImportance: 'users_management/toggleImportance'
		}),
		async toggleArticleFunc() {
			// console.log(this.article);
			const rowId = this.$route.query.id;
			let data = {
				data: {
					rowId,
					url: this.article.url,
					type: this.isContact ? 'contact_research' : 'company_research'
				},
				hide: this.article.hidden ? false : true
			};
			this.sending = true;

			try {
				const response = await this.toggleArticle(data);
				console.log(response);
				this.showAlert({
					status: 'success',
					message: response.data.message,
					showAlert: true
				});
				this.sending = false;
			} catch (error) {
				console.log(error.response);
				this.showAlert({
					status: 'success',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		async toggleImportanceFunc() {
			const rowId = this.$route.query.id;
			let data = {
				data: {
					rowId,
					url: this.article.url,
					type: this.isContact ? 'contact_research' : 'company_research'
				},
				important: this.article.ranked_by_admin ? false : true
			};
			this.sendingImp = true;

			try {
				const response = await this.toggleImportance(data);
				console.log(response);
				this.showAlert({
					status: 'success',
					message: response.data.message,
					showAlert: true
				});
				this.sendingImp = false;
			} catch (error) {
				console.log(error.response);
				this.showAlert({
					status: 'success',
					message: error.response.data.message,
					showAlert: true
				});
			}
		}
	}
};
