import InputMixin from '../../mixins/input';

export default {
	mixins: [InputMixin],
	name: 'Radio',
	props: {
		id: {
			type: String,
			default: 'Active'
		},
		options: {
			type: Array,
			default: () => []
		}
	}
	// watch: {
	// 	innerValue(val) {
	// 		this.$emit('input', val);
	// 		this.$emit('change', val);
	// 	},

	// }
};
