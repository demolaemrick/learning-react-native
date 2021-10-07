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
			default: () => []
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
			sortType: 'asc',
			target: ''
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
				let id = value.toLowerCase();
				this.target = value;
				let mySort = this.tableData.slice();
				if (this.sortType === 'asc') {
					if (value === 'createdAt' || value === 'updatedAt') {
						mySort.sort((a, b) => {
							return new Date(a[value]) - new Date(b[value]);
						});
					} else {
						mySort.sort((a, b) => (a[id] < b[id] ? -1 : 1));
					}
					this.sortType = 'desc';
				} else {
					if (value === 'createdAt' || value === 'updatedAt') {
						mySort.sort((a, b) => {
							return new Date(b[value]) - new Date(a[value]);
						});
					} else {
						mySort.sort((a, b) => (b[id] < a[id] ? -1 : 1));
					}
					this.sortType = 'asc';
				}
				this.$emit('sortedTable', mySort, this.sortType, value);
			}
		}
	},
	components: {
		CTableHeader
	}
};
