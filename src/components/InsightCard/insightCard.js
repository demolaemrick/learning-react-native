export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		content: {
			type: String,
			default: ''
		},
		quote: {
			type: String,
			default: ''
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
