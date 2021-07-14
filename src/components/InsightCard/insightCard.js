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
	},
	// methods: {
	// 	openModal() {
	// 		this.disliked = true
	// 	}
	// }
};
