export default {
	name: 'modal',
	props: {
		toggleClass: {
			type: Boolean,
			default: true
		},
		position: {
			type: String,
			default: 'right'
		},
		useSlot: {
			type: Boolean,
			default: true
		},
		maxWidth: {
			type: String,
			default: '496px'
		},
		active: {
			type: Boolean,
			default: false
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
