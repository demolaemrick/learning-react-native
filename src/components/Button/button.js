export default {
	props: {
		size: {
			type: String,
			default: 'default',
			validator: function (value) {
				return ['small', 'medium', 'full', 'modal', 'default'].indexOf(value) !== -1;
			}
		}
	},
	computed: {
		classes() {
			return {
				btn: true,
				[`btn-${this.size}`]: true
			};
		}
	}
};
