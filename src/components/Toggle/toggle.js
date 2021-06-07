export default {
	name: 'Toggle',
	data() {
		return {
			itemKey: false
		};
	},
	methods: {
		onOptionToggle() {
			console.log(this.itemKey);
		}
	}
};
