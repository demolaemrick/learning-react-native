export default {
	name: 'CheckBoxes',
	props: {
		inputName: {
			type: String,
			require: true
		},
		permissions: {
			type: Array,
			default: () => []
		},
		datas: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			checkDatas: []
		};
	},
	mounted() {
		this.checkDatas = [...this.permissions];
	}
};
