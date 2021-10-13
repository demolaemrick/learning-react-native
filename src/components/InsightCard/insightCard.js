import { tippy } from 'vue-tippy';
import { mapGetters } from 'vuex';

export default {
	components: {
		tippy
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
		showBookmarkIcon: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		...mapGetters({
			loggedInUser: 'auth/getLoggedUser'
		}),
		cleanUrl() {
			const url = this.article.url || this.article.article_url;
			return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
		}
	},
	mounted() {
		// console.log(this.article,'========');
	}
};
