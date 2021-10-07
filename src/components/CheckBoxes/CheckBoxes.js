export default {
	name: 'CheckBoxes',
	props: {
		inputName: {
			type: String,
			require: true
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
	}
};
