export default {
	name: 'Toggle',
	props: {
		itemKey: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		itemValue() {
			return this.itemKey;
		}
	},
	data() {
		return {
			//itemKey: false
		};
	},
	methods: {
		onOptionToggle() {
			console.log(this.itemKey);
		}
	}
};
