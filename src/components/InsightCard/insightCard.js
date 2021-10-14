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
		},
		showBookmarkIcon: {
			type: Boolean,
			default: true
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
			loggedInUser: 'auth/getLoggedUser'
		}),
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
	mounted() {
		this.hidden = this.article.hidden ? true : false;
		this.ranked_by_admin = this.article.ranked_by_admin ? true : false;
	},
	methods: {
		...mapActions({
			toggleArticle: 'users_management/toggleArticle',
			toggleImportance: 'users_management/toggleImportance',
			showAlert: 'showAlert'
		}),
		async toggleArticleFunc() {
			// console.log(this.article);

			// return;
			const rowId = this.$route.query.id;
			let hide = this.hidden ? false : true;
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
				// console.log(response);
				this.showAlert({
					status: 'success',
					message: response.data.message,
					showAlert: true
				});
				this.sending = false;
				this.hidden = hide;
				this.$emit('hideArticle', {
					id: rowId,
					hide
				});
			} catch (error) {
				// console.log(error.response);
				this.showAlert({
					status: 'erro',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		async toggleImportanceFunc() {
			const rowId = this.$route.query.id;
			let important = this.ranked_by_admin ? false : true;

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
				// console.log(response);
				this.showAlert({
					status: 'success',
					message: response.data.message,
					showAlert: true
				});
				this.sendingImp = false;
				this.ranked_by_admin = important;
				this.$emit('rankArticle', { id: rowId, important });
			} catch (error) {
				// console.log(error.response);
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		}
	}
};
