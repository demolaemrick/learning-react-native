import { tippy } from 'vue-tippy';

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
		}
	},
	computed: {
		cleanUrl() {
			const url = this.article.url || this.article.article_url;
			return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
		}
	}
};
