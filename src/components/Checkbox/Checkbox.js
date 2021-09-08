import { Boolean } from 'globalthis/implementation';
import InputMixin from '../../mixins/input';
export default {
	name: 'CCheckbox',
	mixins: [InputMixin],
	props: {
		name: {
			type: String,
			default: '',
			required: true
		},
		isRequired: {
			type: Boolean,
			default: false
		},
		truthValue: {
			type: String | Boolean,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		checked: {
			get() {
				let value = this.truthValue;
				return value;
			},
			set(status) {
				this.$emit('update:value', status);
			}
		}
	}
};
