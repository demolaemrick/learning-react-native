import CTableHeader from './TableHeader';
export default {
	name: 'CTable',
	props: {
		tableHeaders: {
			required: true,
			default: []
		},
		tableData: {
			required: true,
			default: []
		},
		theme: {
			type: String,
			default: ''
		},
		loading: {
			default: false
		}
	},
	data() {
		return {
			sortBy: null
		};
	},
	computed: {
		sortedData() {
			return this.tableData;
		}
	},
	watch: {
		sortBy(newValue) {
			if (newValue) {
				const id = newValue.toLowerCase();
				this.sortedData.sort((a, b) => (a[id] < b[id] ? -1 : 1));
			}
		}
	},
	components: {
		CTableHeader
	}
};
