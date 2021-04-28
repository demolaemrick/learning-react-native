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
			sortBy: null,
			sortType: 'asc'
		};
	},
	computed: {
		sortedData() {
			return this.tableData;
		}
	},
	methods: {
		sortData(value) {
			if (value) {
				let id;
				value === 'createdAt' ? (id = value) : (id = value.toLowerCase());
				if (this.sortType === 'asc') {
					this.sortedData.sort((a, b) => (a[id].toLowerCase() < b[id].toLowerCase() ? -1 : 1));
					this.sortType = 'desc';
				} else {
					this.sortedData.sort((a, b) => (b[id].toLowerCase() < a[id].toLowerCase() ? -1 : 1));
					this.sortType = 'asc';
				}
			}
		}
	},
	components: {
		CTableHeader
	}
};
