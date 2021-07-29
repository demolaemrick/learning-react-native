export default {
	props: {
		article: {
			type: Object,
			default() {
				return {};
			}
		},
		published: {
			type: String,
			default: null
		},
		quote: {
			type: String,
			default: null
		},
		disliked: {
			type: Boolean,
			default: false
		}
	}
};
