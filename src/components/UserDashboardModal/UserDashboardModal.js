export default {
	name: 'user-modal',
	props: {
		toggleClass: {
			type: Boolean,
			default: true
		},
		maxWidth: {
			type: String,
			default: '496px'
		}
	},
	computed: {
		style() {
			return {
				maxWidth: this.maxWidth
			};
		}
	},
	methods: {
		closeModal() {
			this.$emit('close');
		},
		submit() {
			this.$emit('submit');
		}
	}
};
