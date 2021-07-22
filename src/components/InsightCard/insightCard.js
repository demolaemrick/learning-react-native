export default {
	props: {
		title: {
			type: String,
			default: null
		},
		content: {
			type: String,
			default: null
		},
		timestamp: {
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
	},
	methods: {
		bookmark() {
			this.bookmarked = !this.bookmarked;
		}
	}
};
