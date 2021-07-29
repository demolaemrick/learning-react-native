export default {
	props: {
		title: {
			type: String,
			default: null
		},
		article: {
			type: Object,
			default() {
				return {};
			}
		},
		content: {
			type: Object,
			default: null
		},
		published: {
			type: String,
			default: null
		},
		url: {
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
		},
		bookmarked: {
			type: Boolean,
			default: false
		}
	}
	// methods: {
	// 	bookmark() {
	// 		this.bookmarked = !this.bookmarked;
	// 	}
	// }
};
